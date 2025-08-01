
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import type { Opportunity, Client } from '@/lib/types';

const opportunitiesCollection = collection(db, 'opportunities');

export const getOpportunities = async (): Promise<Opportunity[]> => {
    const snapshot = await getDocs(opportunitiesCollection);
    const opportunities = await Promise.all(snapshot.docs.map(async (doc) => {
        const data = doc.data();
        let client: Client | undefined = undefined;
        if (data.clientId) {
            const clientDoc = await getDoc(doc(db, 'clients', data.clientId));
            if (clientDoc.exists()) {
                client = { id: clientDoc.id, ...clientDoc.data() } as Client;
            }
        }
        return { id: doc.id, ...data, client } as Opportunity;
    }));
    return opportunities;
};

export const addOpportunity = async (opportunity: Omit<Opportunity, 'id' | 'client'>) => {
    return await addDoc(opportunitiesCollection, opportunity);
};
