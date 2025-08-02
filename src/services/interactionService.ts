/**
 * @file Contains service functions for interacting with the 'interactions' node in the Firebase Realtime Database.
 */
import { db } from '@/lib/firebase';
import { ref, get, push, set, serverTimestamp } from 'firebase/database';
import type { Interaction, Client } from '@/lib/types';

/**
 * Fetches all interactions from the database and enriches them with client data.
 * Note: This function is not the primary way data is loaded in the app, as `DataContext` handles real-time updates.
 * @returns {Promise<Interaction[]>} A promise that resolves to an array of interactions.
 */
export const getInteractions = async (): Promise<Interaction[]> => {
    const interactionsRef = ref(db, 'interactions');
    const snapshot = await get(interactionsRef);
    if (!snapshot.exists()) {
        return [];
    }
    
    const interactionsData = snapshot.val();
    // Process each interaction to fetch and embed its associated client data.
    const interactions = await Promise.all(Object.keys(interactionsData).map(async (key) => {
        const interaction = { id: key, ...interactionsData[key] };
        let client: Client | undefined = undefined;

        if (interaction.clientId) {
            const clientRef = ref(db, `clients/${interaction.clientId}`);
            const clientSnap = await get(clientRef);
            if (clientSnap.exists()) {
                client = { id: clientSnap.key, ...clientSnap.val() } as Client;
            }
        }
        
        // Convert Firebase timestamp (number) to a standard ISO string for consistency.
        const date = new Date(interaction.date).toISOString();
        return { ...interaction, client, date } as Interaction;
    }));

    return interactions;
};

/**
 * Adds a new interaction to the database.
 * @param {Omit<Interaction, 'id' | 'date' | 'client'>} interaction - The interaction data to add.
 * @returns {Promise<void>} A promise that resolves when the interaction is saved.
 */
export const addInteraction = async (interaction: Omit<Interaction, 'id' | 'date' | 'client'>) => {
    const interactionsRef = ref(db, 'interactions');
     const newInteractionRef = push(interactionsRef);
    return await set(newInteractionRef, {
        ...interaction,
        // Use serverTimestamp for accurate, server-side time.
        date: serverTimestamp()
    });
};
