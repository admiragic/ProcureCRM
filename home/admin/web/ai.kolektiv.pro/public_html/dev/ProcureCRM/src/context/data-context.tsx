
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/auth-context';
import { get, ref, onValue, off } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Client, Interaction, Opportunity, Task } from '@/lib/types';
import type { User } from '@/lib/users';

/**
 * Defines the shape of the data context.
 * This context provides access to all major data collections in the app.
 * @property {Client[]} clients - Array of client data.
 * @property {Interaction[]} interactions - Array of interaction data.
 * @property {Opportunity[]} opportunities - Array of opportunity data.
 * @property {Task[]} tasks - Array of task data.
 * @property {User[]} users - Array of user data.
 * @property {React.Dispatch<React.SetStateAction<Task[]>>} setTasks - Function to update tasks state.
 * @property {React.Dispatch<React.SetStateAction<User[]>>} setUsers - Function to update users state.
 * @property {boolean} loading - A boolean indicating if the initial data load is complete.
 */
type DataContextType = {
  clients: Client[];
  interactions: Interaction[];
  opportunities: Opportunity[];
  tasks: Task[];
  users: User[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  loading: boolean;
};

// Create the data context.
const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * The provider component for the data context.
 * It fetches and manages all the main data collections for the application from Firebase
 * and makes them available to its children.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @returns {React.ReactElement} The rendered provider.
 */
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Effect to set up real-time data listeners when a user logs in.
   * It uses Firebase's `onValue` to listen for changes and automatically update the state.
   * When the user logs out, it cleans up the listeners.
   */
  useEffect(() => {
    if (user && db) {
        setLoading(true);
        const refs = {
            clients: ref(db, 'clients'),
            interactions: ref(db, 'interactions'),
            opportunities: ref(db, 'opportunities'),
            tasks: ref(db, 'tasks'),
            users: ref(db, 'users'),
        };

        const listeners = [
            onValue(refs.clients, (snapshot) => {
                const data = snapshot.val();
                setClients(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
            }),
            onValue(refs.interactions, async (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const processed = await Promise.all(
                        Object.keys(data).map(async (key) => {
                            const interaction = { id: key, ...data[key] };
                            let client: Client | undefined = undefined;
                            if (interaction.clientId) {
                                const clientSnap = await get(ref(db, `clients/${interaction.clientId}`));
                                if (clientSnap.exists()) {
                                    client = { id: clientSnap.key, ...clientSnap.val() } as Client;
                                }
                            }
                            return { ...interaction, client, date: new Date(interaction.date).toISOString() } as Interaction;
                        })
                    );
                    setInteractions(processed);
                } else {
                    setInteractions([]);
                }
            }),
            onValue(refs.opportunities, async (snapshot) => {
                const data = snapshot.val();
                if (data) {
                     const processed = await Promise.all(
                        Object.keys(data).map(async (key) => {
                            const opp = { id: key, ...data[key] };
                            let client: Client | undefined = undefined;
                            if (opp.clientId) {
                                const clientSnap = await get(ref(db, `clients/${opp.clientId}`));
                                if (clientSnap.exists()) {
                                    client = { id: clientSnap.key, ...clientSnap.val() } as Client;
                                }
                            }
                            return { ...opp, client } as Opportunity;
                        })
                    );
                    setOpportunities(processed);
                } else {
                    setOpportunities([]);
                }
            }),
            onValue(refs.tasks, async (snapshot) => {
               const data = snapshot.val();
                if (data) {
                     const processed = await Promise.all(
                        Object.keys(data).map(async (key) => {
                            const task = { id: key, ...data[key] };
                            let client: Client | null = null;
                            if (task.clientId) {
                                const clientSnap = await get(ref(db, `clients/${task.clientId}`));
                                if (clientSnap.exists()) {
                                    client = { id: clientSnap.key, ...clientSnap.val() } as Client;
                                }
                            }
                            return { ...task, client } as Task;
                        })
                    );
                    setTasks(processed);
                } else {
                    setTasks([]);
                }
            }),
            onValue(refs.users, (snapshot) => {
                const data = snapshot.val();
                setUsers(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
            }),
        ];

        setLoading(false);

        return () => {
            off(refs.clients, 'value', listeners[0]);
            off(refs.interactions, 'value', listeners[1]);
            off(refs.opportunities, 'value', listeners[2]);
            off(refs.tasks, 'value', listeners[3]);
            off(refs.users, 'value', listeners[4]);
        };
    } else {
        // If user is logged out, clear all data and set loading to false.
        setClients([]);
        setInteractions([]);
        setOpportunities([]);
        setTasks([]);
        setUsers([]);
        setLoading(false);
    }
  }, [user]); 

  return (
    <DataContext.Provider value={{ clients, interactions, opportunities, tasks, users, setTasks, setUsers, loading }}>
      {children}
    </DataContext.Provider>
  );
};

/**
 * A custom hook to easily access the data context.
 * Throws an error if used outside of a DataProvider.
 * @returns {DataContextType} The data context.
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
