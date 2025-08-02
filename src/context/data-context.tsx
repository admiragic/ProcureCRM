
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-context';
import { getClients } from '@/services/clientService';
import { getInteractions } from '@/services/interactionService';
import { getOpportunities } from '@/services/opportunityService';
import { getTasks } from '@/services/taskService';
import type { Client, Interaction, Opportunity, Task } from '@/lib/types';

type DataContextType = {
  clients: Client[];
  interactions: Interaction[];
  opportunities: Opportunity[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  loading: boolean;
  refreshData: () => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user, isInitialized } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (user) {
      setLoading(true);
      try {
        const [clientsData, interactionsData, opportunitiesData, tasksData] = await Promise.all([
          getClients(),
          getInteractions(),
          getOpportunities(),
          getTasks(),
        ]);
        setClients(clientsData);
        setInteractions(interactionsData);
        setOpportunities(opportunitiesData);
        setTasks(tasksData);
      } catch (error) {
        console.error("Failed to fetch data", error);
        // Optionally, handle the error in UI
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (isInitialized && user) {
      fetchData();
    } else if (isInitialized && !user) {
      // Clear data on logout
      setClients([]);
      setInteractions([]);
      setOpportunities([]);
      setTasks([]);
      setLoading(false);
    }
  }, [user, isInitialized, fetchData]);

  return (
    <DataContext.Provider value={{ clients, interactions, opportunities, tasks, setTasks, loading, refreshData: fetchData }}>
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
