import { db } from '@/lib/firebase';
import { ref, get, push, set } from 'firebase/database';
import type { Opportunity, Client } from '@/lib/types';

export const getOpportunities = async (): Promise<Opportunity[]> => {
    const opportunitiesRef = ref(db, 'opportunities');
    const snapshot = await get(opportunitiesRef);
     if (!snapshot.exists()) {
        return [];
    }

    const opportunitiesData = snapshot.val();
    const opportunities = await Promise.all(Object.keys(opportunitiesData).map(async (key) => {
        const opp = { id: key, ...opportunitiesData[key] };
        let client: Client | undefined = undefined;
        if (opp.clientId) {
             const clientRef = ref(db, `clients/${opp.clientId}`);
            const clientSnap = await get(clientRef);
            if (clientSnap.exists()) {
                client = { id: clientSnap.key, ...clientSnap.val() } as Client;
            }
        }
        return { ...opp, client } as Opportunity;
    }));
    return opportunities;
};

export const addOpportunity = async (opportunity: Omit<Opportunity, 'id' | 'client'>) => {
    const newOppRef = push(ref(db, 'opportunities'));
    return await set(newOppRef, opportunity);
};
