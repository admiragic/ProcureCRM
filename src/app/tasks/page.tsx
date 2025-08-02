
'use client';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { updateTaskStatus, deleteTask } from "@/services/taskService";
import { cn } from "@/lib/utils";
import { PlusCircle, Clock, MoreVertical, Calendar, CircleHelp, Circle, CheckCircle } from "lucide-react";
import { format, isPast, isToday, parseISO } from "date-fns";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useState, useMemo } from "react";
import type { Task } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useData } from "@/context/data-context";

// A map to associate a Lucide icon with each task status.
const statusIcons: Record<Task['status'], React.ElementType> = {
    planned: CircleHelp,
    open: Circle,
    closed: CheckCircle,
};

// A map to associate a text color with each task status for visual cues.
const statusColors: Record<Task['status'], string> = {
    planned: "text-amber-500",
    open: "text-blue-500",
    closed: "text-green-500",
};


/**
 * The main page for displaying and managing tasks.
 * It features filtering, task completion, and deletion functionalities.
 * @returns {React.ReactElement} The rendered tasks page.
 */
export default function TasksPage() {
    const { t } = useLanguage();
    // Using the useData hook to get tasks and a function to update them.
    const { tasks, setTasks } = useData();
    // State for filtering tasks by status.
    const [filter, setFilter] = useState<'all' | Task['status']>('all');

    /**
     * Handles toggling the completion status of a task.
     * It updates the status in the database and then optimistically updates the local state.
     * @param {string} taskId - The ID of the task to update.
     * @param {Task['status']} currentStatus - The current status of the task.
     */
    const handleTaskCompletion = async (taskId: string, currentStatus: Task['status']) => {
        const newStatus = currentStatus === 'closed' ? 'open' : 'closed';
        await updateTaskStatus(taskId, newStatus);
        // Optimistic UI update for a smoother user experience.
        setTasks(currentTasks =>
            currentTasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        );
    };

    /**
     * Handles the deletion of a task.
     * @param {string} taskId - The ID of the task to delete.
     */
    const handleDelete = async (taskId: string) => {
        // Placeholder alert, should be replaced with a confirmation dialog in a real app.
        alert(`Deleting task ${taskId}`);
        await deleteTask(taskId);
        setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
    };
    
    /**
     * Memoized calculation to filter tasks based on the selected filter.
     * This avoids re-calculating on every render unless `tasks` or `filter` changes.
     */
    const filteredTasks = useMemo(() => {
        if (filter === 'all') return tasks;
        return tasks.filter(task => task.status === filter);
    }, [tasks, filter]);

    /**
     * Memoized calculation for the total estimated hours of the filtered tasks.
     */
    const totalHours = useMemo(() => {
        return filteredTasks.reduce((acc, task) => acc + task.timeEstimate, 0);
    }, [filteredTasks]);

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
        {/* Header with filter buttons */}
        <CardHeader className="border-b">
            <div className="flex items-center gap-2">
                <Button variant={filter === 'all' ? 'default' : 'ghost'} size="sm" onClick={() => setFilter('all')}>
                    {t('task_form.status_all')}
                </Button>
                <Button variant={filter === 'planned' ? 'default' : 'ghost'} size="sm" onClick={() => setFilter('planned')}>
                    <CircleHelp className="mr-2 h-4 w-4" />
                    {t('task_form.status_planned')}
                </Button>
                 <Button variant={filter === 'open' ? 'default' : 'ghost'} size="sm" onClick={() => setFilter('open')}>
                    <Circle className="mr-2 h-4 w-4" />
                    {t('task_form.status_open')}
                </Button>
                 <Button variant={filter === 'closed' ? 'default' : 'ghost'} size="sm" onClick={() => setFilter('closed')}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {t('task_form.status_closed')}
                </Button>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* List of tasks */}
          <ul className="divide-y divide-border">
            {filteredTasks
              // Sort tasks by due date
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map(task => {
                const dueDate = parseISO(task.dueDate);
                const isOverdue = task.status !== 'closed' && isPast(dueDate) && !isToday(dueDate);
                const StatusIcon = statusIcons[task.status];
                return (
                  <li key={task.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group">
                    <button onClick={() => handleTaskCompletion(task.id, task.status)} className={cn("cursor-pointer", statusColors[task.status])}>
                        <StatusIcon className="h-5 w-5" />
                    </button>
                    <div className="flex-1 grid gap-1">
                      <span className={cn("font-medium", task.status === 'closed' && "line-through text-muted-foreground")}>{task.title}</span>
                      {task.client && <p className="text-sm text-muted-foreground">{task.client.companyName}</p>}
                    </div>
                    <div className="text-sm text-muted-foreground">{task.assignedTo}</div>
                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{task.timeEstimate}h</span>
                    </div>
                    <div className={cn("text-sm font-medium w-28 text-right flex items-center gap-2 justify-end", isOverdue ? "text-destructive" : "text-muted-foreground")}>
                      <Calendar className="h-4 w-4" />
                      {format(dueDate, "MMM dd, yyyy")}
                    </div>
                    {/* Dropdown menu for task actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href="/tasks/new">{t('opportunities_page.edit_button')}</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-red-500">
                               {t('opportunities_page.delete_button')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              })}
          </ul>
        </CardContent>
        {/* Footer displaying total estimated hours */}
        <CardFooter className="justify-end font-bold p-4 border-t">
            {t('task_form.total_time')}: {totalHours}h
        </CardFooter>
      </Card>
    </>
  );
}
