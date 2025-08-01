
import { Timestamp } from 'firebase/firestore';

export type Client = {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  industry: string;
  status: 'active' | 'inactive' | 'archived';
  type: 'lead' | 'prospect' | 'customer';
  createdAt: Timestamp | string;
};

export type Interaction = {
  id: string;
  clientId: string;
  type: 'call' | 'email' | 'meeting' | 'demo';
  notes: string;
  salesperson: string;
  date: string;
  client?: Client;
};

export type Opportunity = {
  id: string;
  clientId: string;
  stage: 'lead' | 'prospecting' | 'proposal' | 'negotiation' | 'won' | 'lost';
  value: number;
  closingDate: string;
  client?: Client;
};

export type Task = {
  id:string;
  clientId: string | null;
  title: string;
  dueDate: string;
  assignedTo: string;
  status: 'planned' | 'open' | 'closed';
  timeEstimate: number;
  documents?: string[];
  client?: Client | null;
};
