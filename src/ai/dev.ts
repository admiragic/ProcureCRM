/**
 * @file This is the entry point for the Genkit development server.
 * It imports the necessary environment configuration and the defined AI flows.
 * This file is executed by the `genkit:dev` and `genkit:watch` scripts.
 */

import { config } from 'dotenv';
// Load environment variables from a .env file into process.env
config();

// Import the AI flow for generating follow-up emails.
// This makes the flow available to the Genkit development server.
import '@/ai/flows/generate-follow-up-email.ts';
