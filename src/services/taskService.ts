import { db } from '@/lib/firebase';
import { ref, get, push, set, update, remove } from 'firebase/database';
import type { Task, Client } from '@/lib/types';

export const getTasks = async (): Promise<Task[]> => {
    const tasksRef = ref(db, 'tasks');
    const snapshot = await get(tasksRef);
    if (!snapshot.exists()) {
        return [];
    }

    const tasksData = snapshot.val();
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

export const addTask = async (task: Omit<Task, 'id' | 'client'>) => {
    const newTaskRef = push(ref(db, 'tasks'));
    return await set(newTaskRef, task);
};

export const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    const taskRef = ref(db, `tasks/${taskId}`);
    return await update(taskRef, { status });
};

export const deleteTask = async (taskId: string) => {
    const taskRef = ref(db, `tasks/${taskId}`);
    return await remove(taskRef);
};
