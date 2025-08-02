import { db } from '@/lib/firebase';
import { ref, get, push, set, serverTimestamp } from 'firebase/database';
import type { Interaction, Client } from '@/lib/types';

export const getInteractions = async (): Promise<Interaction[]> => {
    const interactionsRef = ref(db, 'interactions');
    const snapshot = await get(interactionsRef);
    if (!snapshot.exists()) {
        return [];
    }
    
    const interactionsData = snapshot.val();
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
        
        // Firebase RTDB returns timestamp as number, convert to ISO string for consistency
        const date = new Date(interaction.date).toISOString();
        return { ...interaction, client, date } as Interaction;
    }));

    return interactions;
};

export const addInteraction = async (interaction: Omit<Interaction, 'id' | 'date' | 'client'>) => {
    const interactionsRef = ref(db, 'interactions');
     const newInteractionRef = push(interactionsRef);
    return await set(newInteractionRef, {
        ...interaction,
        date: serverTimestamp()
    });
};
