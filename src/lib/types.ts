
/**
 * @file This file defines the core TypeScript types used throughout the application.
 * It ensures data consistency and provides type safety.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Represents a client in the CRM.
 * @property {string} id - The unique identifier for the client.
 * @property {string} companyName - The name of the client's company.
 * @property {string} contactPerson - The primary contact person at the company.
 * @property {string} phone - The client's phone number.
 * @property {string} email - The client's email address.
 * @property {string} address - The physical address of the client.
 * @property {string} industry - The industry the client operates in.
 * @property {'active' | 'inactive' | 'archived'} status - The current status of the client.
 * @property {'lead' | 'prospect' | 'customer'} type - The type of client relationship.
 * @property {Timestamp | string} createdAt - The timestamp when the client was created.
 */
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

/**
 * Represents an interaction with a client.
 * @property {string} id - The unique identifier for the interaction.
 * @property {string} clientId - The ID of the client this interaction is associated with.
 * @property {'call' | 'email' | 'meeting' | 'demo'} type - The type of interaction.
 * @property {string} notes - Detailed notes about the interaction.
 * @property {string} salesperson - The salesperson who handled the interaction.
 * @property {string} date - The date of the interaction (in ISO string format).
 * @property {Client} [client] - The full client object, optionally included.
 */
export type Interaction = {
  id: string;
  clientId: string;
  type: 'call' | 'email' | 'meeting' | 'demo';
  notes: string;
  salesperson: string;
  date: string;
  client?: Client;
};

/**
 * Represents a sales opportunity.
 * @property {string} id - The unique identifier for the opportunity.
 * @property {string} clientId - The ID of the client this opportunity is for.
 * @property {'lead' | 'prospecting' | 'proposal' | 'negotiation' | 'won' | 'lost'} stage - The current stage in the sales pipeline.
 * @property {number} value - The monetary value of the opportunity.
 * @property {string} closingDate - The estimated closing date (in 'yyyy-MM-dd' format).
 * @property {Client} [client] - The full client object, optionally included.
 */
export type Opportunity = {
  id: string;
  clientId: string;
  stage: 'lead' | 'prospecting' | 'proposal' | 'negotiation' | 'won' | 'lost';
  value: number;
  closingDate: string;
  client?: Client;
};

/**
 * Represents a task in the CRM.
 * @property {string} id - The unique identifier for the task.
 * @property {string | null} clientId - The ID of the client this task is related to, or null.
 * @property {string} title - The title or description of the task.
 * @property {string} dueDate - The due date for the task (in 'yyyy-MM-dd' format).
 * @property {string} assignedTo - The user or team member the task is assigned to.
 * @property {'planned' | 'open' | 'closed'} status - The current status of the task.
 * @property {number} timeEstimate - The estimated time in hours to complete the task.
 * @property {string[]} [documents] - An optional array of URLs to documents related to the task.
 * @property {Client | null} [client] - The full client object, optionally included.
 */
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
