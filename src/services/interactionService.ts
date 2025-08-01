
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import type { Interaction, Client } from '@/lib/types';

const interactionsCollection = collection(db, 'interactions');

export const getInteractions = async (): Promise<Interaction[]> => {
    const snapshot = await getDocs(interactionsCollection);
    const interactions = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let client: Client | undefined = undefined;
        if (data.clientId) {
            const clientDoc = await getDoc(doc(db, 'clients', data.clientId));
            if (clientDoc.exists()) {
                client = { id: clientDoc.id, ...clientDoc.data() } as Client;
            }
        }
        return { id: doc.id, ...data, client, date: data.date.toDate().toISOString() } as Interaction;
    }));
    return interactions;
};

export const addInteraction = async (interaction: Omit<Interaction, 'id' | 'date' | 'client'>) => {
    return await addDoc(interactionsCollection, {
        ...interaction,
        date: serverTimestamp()
    });
};
