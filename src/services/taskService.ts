
import { getDb } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Task, Client } from '@/lib/types';

export const getTasks = async (): Promise<Task[]> => {
    const db = getDb();
    const tasksCollection = collection(db, 'tasks');
    const snapshot = await getDocs(tasksCollection);
    const tasks = await Promise.all(snapshot.docs.map(async (d) => {
        const data = d.data();
        let client: Client | null = null;
        if (data.clientId) {
            const clientDocRef = doc(db, 'clients', data.clientId);
            const clientDoc = await getDoc(clientDocRef);
            if (clientDoc.exists()) {
                client = { id: clientDoc.id, ...clientDoc.data() } as Client;
            }
        }
        return { id: d.id, ...data, client } as Task;
    }));
    return tasks;
};

export const addTask = async (task: Omit<Task, 'id' | 'client'>) => {
    const db = getDb();
    const tasksCollection = collection(db, 'tasks');
    return await addDoc(tasksCollection, task);
};

export const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    const db = getDb();
    const taskRef = doc(db, 'tasks', taskId);
    return await updateDoc(taskRef, { status });
};

export const deleteTask = async (taskId: string) => {
    const db = getDb();
    const taskRef = doc(db, 'tasks', taskId);
    return await deleteDoc(taskRef);
};
