
import { getDb } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import type { Interaction, Client } from '@/lib/types';

export const getInteractions = async (): Promise<Interaction[]> => {
    const db = getDb();
    const interactionsCollection = collection(db, 'interactions');
    const snapshot = await getDocs(interactionsCollection);
    const interactions = await Promise.all(snapshot.docs.map(async (d) => {
        const data = d.data();
        let client: Client | undefined = undefined;
        if (data.clientId) {
            const clientDocRef = doc(db, 'clients', data.clientId);
            const clientDoc = await getDoc(clientDocRef);
            if (clientDoc.exists()) {
                client = { id: clientDoc.id, ...clientDoc.data() } as Client;
            }
        }
        return { id: d.id, ...data, client, date: data.date.toDate().toISOString() } as Interaction;
    }));
    return interactions;
};

export const addInteraction = async (interaction: Omit<Interaction, 'id' | 'date' | 'client'>) => {
    const db = getDb();
    const interactionsCollection = collection(db, 'interactions');
    return await addDoc(interactionsCollection, {
        ...interaction,
        date: serverTimestamp()
    });
};
