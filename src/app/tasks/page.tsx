
'use client';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { tasks as initialTasks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { PlusCircle, Clock } from "lucide-react";
import { format, isPast, isToday, parseISO } from "date-fns";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useState, useMemo } from "react";
import type { Task } from "@/lib/types";

export default function TasksPage() {
    const { t } = useLanguage();
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    const handleTaskCompletion = (taskId: string, completed: boolean) => {
        setTasks(currentTasks =>
            currentTasks.map(task =>
                task.id === taskId ? { ...task, completed } : task
            )
        );
    };
    
    const totalHours = useMemo(() => {
        return tasks.reduce((acc, task) => acc + task.timeEstimate, 0);
    }, [tasks]);

  return (
    <>
      <PageHeader title={t('sidebar.tasks')} description={t('tasks_page.description')}>
        <Button asChild>
            <Link href="/tasks/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('tasks_page.add_button')}
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {tasks
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map(task => {
                const dueDate = parseISO(task.dueDate);
                const isOverdue = !task.completed && isPast(dueDate) && !isToday(dueDate);
                return (
                  <li key={task.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                    <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={(checked) => handleTaskCompletion(task.id, !!checked)} aria-label={`Mark task '${task.title}' as complete`} />
                    <div className="flex-1 grid gap-1">
                      <label htmlFor={`task-${task.id}`} className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>{task.title}</label>
                      {task.client && <p className="text-sm text-muted-foreground">{task.client.companyName}</p>}
                    </div>
                    <div className="text-sm text-muted-foreground">{task.assignedTo}</div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{task.timeEstimate}h</span>
                    </div>
                    <div className={cn("text-sm font-medium w-20 text-right", isOverdue ? "text-destructive" : "text-muted-foreground")}>
                      {format(dueDate, "MMM dd")}
                    </div>
                  </li>
                );
              })}
          </ul>
        </CardContent>
        <CardFooter className="justify-end font-bold p-4 border-t">
            {t('task_form.total_time')}: {totalHours}h
        </CardFooter>
      </Card>
    </>
  );
}
