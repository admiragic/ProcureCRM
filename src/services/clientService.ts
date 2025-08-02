
import { getDb } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Client } from '@/lib/types';

export const getClients = async (): Promise<Client[]> => {
    const db = getDb();
    const clientsCollection = collection(db, 'clients');
    const snapshot = await getDocs(clientsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
};

export const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    const db = getDb();
    const clientsCollection = collection(db, 'clients');
    return await addDoc(clientsCollection, {
        ...client,
        createdAt: serverTimestamp()
    });
};
