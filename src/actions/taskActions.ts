
'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { ref, push, set, update, remove } from 'firebase/database';
import type { Task } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const taskFormSchema = z.object({
    title: z.string().min(5),
    clientId: z.string().nullable(),
    assignedTo: z.string().min(2),
    dueDate: z.string(), // yyyy-MM-dd format
    timeEstimate: z.coerce.number().min(0),
    status: z.enum(['planned', 'open', 'closed']),
    documents: z.array(z.string().url()).optional(),
});


export async function addTaskAction(values: z.infer<typeof taskFormSchema>) {
    const validatedFields = taskFormSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    if (!db) {
        return { error: 'Database not configured' };
    }

    const newTaskRef = push(ref(db, 'tasks'));
    try {
        await set(newTaskRef, validatedFields.data);
        revalidatePath('/tasks');
        return { message: "Task added successfully" };
    } catch (error) {
        return { error: "Failed to save task" };
    }
}

export async function updateTaskStatusAction(taskId: string, status: Task['status']) {
    if (!taskId) return { error: "Task ID is missing" };

    if (!db) {
        return { error: 'Database not configured' };
    }

    const taskRef = ref(db, `tasks/${taskId}`);
    try {
        await update(taskRef, { status });
        revalidatePath('/tasks');
        return { message: "Task status updated" };
    } catch (error) {
        return { error: "Failed to update task status" };
    }
}

export async function deleteTaskAction(taskId: string) {
    if (!taskId) return { error: "Task ID is missing" };
    
    if (!db) {
        return { error: 'Database not configured' };
    }

    const taskRef = ref(db, `tasks/${taskId}`);
    try {
        await remove(taskRef);
        revalidatePath('/tasks');
        return { message: "Task deleted" };
    } catch (error) {
        return { error: "Failed to delete task" };
    }
}
