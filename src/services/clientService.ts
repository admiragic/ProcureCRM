import { db } from '@/lib/firebase';
import { ref, get, push, serverTimestamp, set } from 'firebase/database';
import type { Client } from '@/lib/types';

export const getClients = async (): Promise<Client[]> => {
    const clientsRef = ref(db, 'clients');
    const snapshot = await get(clientsRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({ id: key, ...data[key] } as Client));
    }
    return [];
};

export const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    const clientsRef = ref(db, 'clients');
    const newClientRef = push(clientsRef);
    return await set(newClientRef, {
        ...client,
        createdAt: serverTimestamp()
    });
};
