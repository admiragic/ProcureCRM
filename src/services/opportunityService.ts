/**
 * @file Contains service functions for interacting with the 'opportunities' node in the Firebase Realtime Database.
 */

import { db } from '@/lib/firebase';
import { ref, get, push, set } from 'firebase/database';
import type { Opportunity, Client } from '@/lib/types';

/**
 * Fetches all opportunities and enriches them with their associated client data.
 * Note: Data is primarily loaded via `DataContext`, so this is for one-off fetches.
 * @returns {Promise<Opportunity[]>} A promise resolving to an array of opportunities.
 */
export const getOpportunities = async (): Promise<Opportunity[]> => {
    const opportunitiesRef = ref(db, 'opportunities');
    const snapshot = await get(opportunitiesRef);
     if (!snapshot.exists()) {
        return [];
    }

    const opportunitiesData = snapshot.val();
    // Process each opportunity to fetch and embed client data.
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

/**
 * Adds a new opportunity to the database.
 * @param {Omit<Opportunity, 'id' | 'client'>} opportunity - The opportunity data to add.
 * @returns {Promise<void>} A promise that resolves when the data is saved.
 */
export const addOpportunity = async (opportunity: Omit<Opportunity, 'id' | 'client'>) => {
    const newOppRef = push(ref(db, 'opportunities'));
    return await set(newOppRef, opportunity);
};
