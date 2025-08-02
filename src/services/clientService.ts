/**
 * @file This file contains service functions for interacting with the 'clients' node in the Firebase Realtime Database.
 */

import { db } from '@/lib/firebase';
import { ref, get, push, serverTimestamp, set } from 'firebase/database';
import type { Client } from '@/lib/types';

/**
 * Fetches all clients from the database.
 * Note: This function is not the primary way data is loaded in the app anymore, as `onValue` listeners in `DataContext` are used for real-time updates.
 * However, it can be useful for one-off data fetches if needed.
 * @returns {Promise<Client[]>} A promise that resolves to an array of clients.
 */
export const getClients = async (): Promise<Client[]> => {
    const clientsRef = ref(db, 'clients');
    const snapshot = await get(clientsRef);
    if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert the snapshot object into an array of clients, including their IDs.
        return Object.keys(data).map(key => ({ id: key, ...data[key] } as Client));
    }
    return [];
};

/**
 * Adds a new client to the database.
 * @param {Omit<Client, 'id' | 'createdAt'>} client - The client data to add. The 'id' and 'createdAt' fields are omitted as they will be generated.
 * @returns {Promise<void>} A promise that resolves when the client has been added.
 */
export const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    const clientsRef = ref(db, 'clients');
    // `push` generates a new unique key for the client.
    const newClientRef = push(clientsRef);
    // Use `serverTimestamp()` to ensure the creation time is set by the Firebase server, not the client.
    const timestamp = serverTimestamp();
    return await set(newClientRef, {
        ...client,
        createdAt: timestamp,
    });
};
