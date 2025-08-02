/**
 * @file Contains service functions for interacting with the 'tasks' node in the Firebase Realtime Database.
 */
import { db } from '@/lib/firebase';
import { ref, get, push, set, update, remove } from 'firebase/database';
import type { Task, Client } from '@/lib/types';

/**
 * Fetches all tasks and enriches them with associated client data.
 * Note: Data is primarily loaded via `DataContext`. This is for one-off fetches.
 * @returns {Promise<Task[]>} A promise that resolves to an array of tasks.
 */
export const getTasks = async (): Promise<Task[]> => {
    const tasksRef = ref(db, 'tasks');
    const snapshot = await get(tasksRef);
    if (!snapshot.exists()) {
        return [];
    }

    const tasksData = snapshot.val();
    // Process each task to fetch and embed client data.
    const tasks = await Promise.all(Object.keys(tasksData).map(async (key) => {
        const task = { id: key, ...tasksData[key] };
        let client: Client | null = null;
        if (task.clientId) {
            const clientRef = ref(db, `clients/${task.clientId}`);
            const clientSnap = await get(clientRef);
            if (clientSnap.exists()) {
                client = { id: clientSnap.key, ...clientSnap.val() } as Client;
            }
        }
        return { ...task, client } as Task;
    }));
    return tasks;
};

/**
 * Adds a new task to the database.
 * @param {Omit<Task, 'id' | 'client'>} task - The task data to add.
 * @returns {Promise<void>} A promise that resolves when the task is saved.
 */
export const addTask = async (task: Omit<Task, 'id' | 'client'>) => {
    const newTaskRef = push(ref(db, 'tasks'));
    return await set(newTaskRef, task);
};

/**
 * Updates the status of a specific task.
 * @param {string} taskId - The ID of the task to update.
 * @param {Task['status']} status - The new status for the task.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    const taskRef = ref(db, `tasks/${taskId}`);
    return await update(taskRef, { status });
};

/**
 * Deletes a task from the database.
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<void>} A promise that resolves when the task is deleted.
 */
export const deleteTask = async (taskId: string) => {
    const taskRef = ref(db, `tasks/${taskId}`);
    return await remove(taskRef);
};
