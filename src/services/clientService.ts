
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Client } from '@/lib/types';

const clientsCollection = collection(db, 'clients');

export const getClients = async (): Promise<Client[]> => {
    const snapshot = await getDocs(clientsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
};

export const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    return await addDoc(clientsCollection, {
        ...client,
        createdAt: serverTimestamp()
    });
};
