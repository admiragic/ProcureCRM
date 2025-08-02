
import { getDb } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import type { Opportunity, Client } from '@/lib/types';

export const getOpportunities = async (): Promise<Opportunity[]> => {
    const db = getDb();
    const opportunitiesCollection = collection(db, 'opportunities');
    const snapshot = await getDocs(opportunitiesCollection);
    const opportunities = await Promise.all(snapshot.docs.map(async (d) => {
        const data = d.data();
        let client: Client | undefined = undefined;
        if (data.clientId) {
             const clientDocRef = doc(db, 'clients', data.clientId);
            const clientDoc = await getDoc(clientDocRef);
            if (clientDoc.exists()) {
                client = { id: clientDoc.id, ...clientDoc.data() } as Client;
            }
        }
        return { id: d.id, ...data, client } as Opportunity;
    }));
    return opportunities;
};

export const addOpportunity = async (opportunity: Omit<Opportunity, 'id' | 'client'>) => {
    const db = getDb();
    const opportunitiesCollection = collection(db, 'opportunities');
    return await addDoc(opportunitiesCollection, opportunity);
};
