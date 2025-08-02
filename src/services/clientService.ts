import { db } from '@/lib/firebase';
import { ref, get, push, serverTimestamp, set } from 'firebase/database';
import type { Client } from '@/lib/types';

// This function is no longer the primary way to get data, 
// but can be kept for one-off fetches if needed elsewhere.
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
    // In RTDB, serverTimestamp() returns a placeholder object
    const timestamp = serverTimestamp();
    return await set(newClientRef, {
        ...client,
        createdAt: timestamp,
    });
};
