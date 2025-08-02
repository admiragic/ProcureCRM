
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { get, ref, onValue, off } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { Client, Interaction, Opportunity, Task } from '@/lib/types';
import type { User } from '@/lib/users';

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

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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

      const listeners = [
        onValue(refs[0], (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setClients(Object.keys(data).map(key => ({ id: key, ...data[key] })));
          } else {
            setClients([]);
          }
        }),
        onValue(refs[1], async (snapshot) => {
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
        }),
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
        onValue(refs[4], (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setUsers(Object.keys(data).map(key => ({ id: key, ...data[key] })));
            } else {
                setUsers([]);
            }
        }),
      ];

      Promise.all(listeners).then(() => setLoading(false)).catch(() => setLoading(false));


      // Detach listeners on cleanup
      return () => {
        refs.forEach((r, i) => off(r, 'value', listeners[i]));
      };
    } else {
      // User is logged out, clear all data
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

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
