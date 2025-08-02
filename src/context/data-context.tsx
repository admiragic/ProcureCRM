
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-context';
import { get, ref, onValue, off } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Client, Interaction, Opportunity, Task } from '@/lib/types';

type DataContextType = {
  clients: Client[];
  interactions: Interaction[];
  opportunities: Opportunity[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  loading: boolean;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      
      const clientsRef = ref(db, 'clients');
      const interactionsRef = ref(db, 'interactions');
      const opportunitiesRef = ref(db, 'opportunities');
      const tasksRef = ref(db, 'tasks');

      const onClientsValue = onValue(clientsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setClients(Object.keys(data).map(key => ({ id: key, ...data[key] })));
        } else {
          setClients([]);
        }
        setLoading(false);
      }, (error) => {
        console.error("Firebase clients listener error:", error);
        setLoading(false);
      });

      const onInteractionsValue = onValue(interactionsRef, async (snapshot) => {
          if (snapshot.exists()) {
                const interactionsData = snapshot.val();
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
      });
      
      const onOpportunitiesValue = onValue(opportunitiesRef, async (snapshot) => {
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
        });

      const onTasksValue = onValue(tasksRef, async (snapshot) => {
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
        });


      // Detach listeners on cleanup
      return () => {
        off(clientsRef, 'value', onClientsValue);
        off(interactionsRef, 'value', onInteractionsValue);
        off(opportunitiesRef, 'value', onOpportunitiesValue);
        off(tasksRef, 'value', onTasksValue);
      };
    } else {
      // User is logged out, clear all data
      setClients([]);
      setInteractions([]);
      setOpportunities([]);
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  // The refreshData function is no longer needed as data is now real-time
  const refreshData = () => {};

  return (
    <DataContext.Provider value={{ clients, interactions, opportunities, tasks, setTasks, loading, refreshData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
