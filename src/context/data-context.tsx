
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
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
    if (user) {
      setLoading(true);
      
      const refs = [
        ref(db, 'clients'),
        ref(db, 'interactions'),
        ref(db, 'opportunities'),
        ref(db, 'tasks'),
        ref(db, 'users'),
      ];

      // Array to hold the listener functions for easy cleanup
      const listeners = [
        // Listener for clients
        onValue(refs[0], (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setClients(Object.keys(data).map(key => ({ id: key, ...data[key] })));
          } else {
            setClients([]);
          }
        }),
        // Listener for interactions, with client data enrichment
        onValue(refs[1], async (snapshot) => {
            if (snapshot.exists()) {
                  const interactionsData = snapshot.val();
                  // Process each interaction to fetch its associated client data
                  const processedInteractions = await Promise.all(
                      Object.keys(interactionsData).map(async (key) => {
                          const interaction = { id: key, ...interactionsData[key] };
                          let client: Client | undefined = undefined;

                          if (interaction.clientId) {
                              const clientRef = ref(db, `clients/${interaction.clientId}`);
                              const clientSnap = await get(clientRef);
                              if (clientSnap.exists()) {
                                  client = { id: clientSnap.key, ...clientSnap.val() } as Client;
                              }
                          }
                          const date = new Date(interaction.date).toISOString();
                          return { ...interaction, client, date } as Interaction;
                      })
                  );
                  setInteractions(processedInteractions);
              } else {
                  setInteractions([]);
              }
        }),
        // Listener for opportunities, with client data enrichment
        onValue(refs[2], async (snapshot) => {
              if (snapshot.exists()) {
                  const opportunitiesData = snapshot.val();
                  const processedOpportunities = await Promise.all(
                      Object.keys(opportunitiesData).map(async (key) => {
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
                      })
                  );
                  setOpportunities(processedOpportunities);
              } else {
                  setOpportunities([]);
              }
          }),
        // Listener for tasks, with client data enrichment
        onValue(refs[3], async (snapshot) => {
              if (snapshot.exists()) {
                  const tasksData = snapshot.val();
                  const processedTasks = await Promise.all(
                      Object.keys(tasksData).map(async (key) => {
                          const task = { id: key, ...tasksData[key] };
                          let client: Client | null = null;
                          if (task.clientId) {
                              const clientRef = ref(db, `clients/${task.clientId}`);
                              const clientSnap = await get(clientRef);
                              if (clientSnap.exists()) {
                                  client = { id: clientSnap.key, ...clientSnap.val() } as Client;
                              }
                          }
                          return { ...task, client } as Task;
                      })
                  );
                  setTasks(processedTasks);
              } else {
                  setTasks([]);
              }
          }),
        // Listener for users
        onValue(refs[4], (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setUsers(Object.keys(data).map(key => ({ id: key, ...data[key] })));
            } else {
                setUsers([]);
            }
        }),
      ];

      // Once all initial data is fetched, set loading to false.
      Promise.all(listeners).then(() => setLoading(false)).catch(() => setLoading(false));


      // Cleanup function to detach all listeners when the component unmounts or the user logs out.
      return () => {
        refs.forEach((r, i) => off(r, 'value', listeners[i]));
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
  }, [user]); // This effect re-runs whenever the user object changes.

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
