import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { tasks } from "@/lib/data";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { format, isPast, isToday, parseISO } from "date-fns";

export default function TasksPage() {
  return (
    <>
      <PageHeader title="Tasks" description="Manage your to-do list.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
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
                    <Checkbox id={`task-${task.id}`} checked={task.completed} aria-label={`Mark task '${task.title}' as complete`} />
                    <div className="flex-1 grid gap-1">
                      <label htmlFor={`task-${task.id}`} className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>{task.title}</label>
                      {task.client && <p className="text-sm text-muted-foreground">{task.client.companyName}</p>}
                    </div>
                    <div className="text-sm text-muted-foreground">{task.assignedTo}</div>
                    <div className={cn("text-sm font-medium", isOverdue ? "text-red-500" : "text-muted-foreground")}>
                      {format(dueDate, "MMM dd")}
                    </div>
                  </li>
                );
              })}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
