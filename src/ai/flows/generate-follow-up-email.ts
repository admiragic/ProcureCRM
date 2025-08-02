// This file is machine-generated - edit with caution!

'use server';

/**
 * @fileOverview AI-powered email generator for personalized follow-ups.
 *
 * - generateFollowUpEmail - A function that generates personalized follow-up email content.
 * - GenerateFollowUpEmailInput - The input type for the generateFollowUpEmail function.
 * - GenerateFollowUpEmailOutput - The return type for the generateFollowUpEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @description The Zod schema for the input of the email generation flow.
 * It defines the expected data structure and includes descriptions for each field,
 * which helps the AI model understand the context.
 */
const GenerateFollowUpEmailInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  recentInteractions: z
    .string()
    .describe(
      'A summary of recent interactions with the client (call, email, meeting, demo).'      
    ),
  opportunityStage: z.string().describe('The current stage of the sales opportunity (lead, prospect, customer).'),
  assignedSalesperson: z.string().describe('The name of the assigned salesperson.'),
  language: z.string().describe('The language for the email output (e.g., "en", "hr", "pl").'),
});

/**
 * @description The TypeScript type inferred from the input schema.
 * This type is used in the function signature for type safety.
 */
export type GenerateFollowUpEmailInput = z.infer<typeof GenerateFollowUpEmailInputSchema>;

/**
 * @description The Zod schema for the output of the email generation flow.
 * It specifies the format of the data that the AI model should return.
 */
const GenerateFollowUpEmailOutputSchema = z.object({
  emailContent: z.string().describe('The generated follow-up email content.'),
});

/**
 * @description The TypeScript type inferred from the output schema.
 */
export type GenerateFollowUpEmailOutput = z.infer<typeof GenerateFollowUpEmailOutputSchema>;

/**
 * An asynchronous function that serves as a wrapper for the Genkit flow.
 * It takes the input, calls the flow, and returns the generated email content.
 * This is the primary function exported and used by the application frontend.
 * @param {GenerateFollowUpEmailInput} input - The data required to generate the email.
 * @returns {Promise<GenerateFollowUpEmailOutput>} A promise that resolves to the generated email content.
 */
export async function generateFollowUpEmail(
  input: GenerateFollowUpEmailInput
): Promise<GenerateFollowUpEmailOutput> {
  return generateFollowUpEmailFlow(input);
}

/**
 * @description Defines the AI prompt for generating the follow-up email.
 * It specifies the input and output schemas, and provides the core instruction (prompt)
 * for the AI model, using Handlebars syntax `{{{...}}}` to insert dynamic data.
 */
const generateFollowUpEmailPrompt = ai.definePrompt({
  name: 'generateFollowUpEmailPrompt',
  input: {schema: GenerateFollowUpEmailInputSchema},
  output: {schema: GenerateFollowUpEmailOutputSchema},
  prompt: `You are an AI assistant specializing in generating personalized follow-up emails for sales representatives.

  Based on the recent client interactions, opportunity stage, and assigned salesperson, generate a follow-up email that is both engaging and effective.
  
  IMPORTANT: The generated email MUST be in the following language: {{{language}}}.

  Client Name: {{{clientName}}}
  Recent Interactions: {{{recentInteractions}}}
  Opportunity Stage: {{{opportunityStage}}}
  Assigned Salesperson: {{{assignedSalesperson}}}

  Write a personalized follow-up email.`,
});

/**
 * @description Defines the Genkit flow for generating the follow-up email.
 * A flow orchestrates the AI logic. In this case, it's a simple flow
 * that takes an input, calls the defined prompt, and returns the output.
 */
const generateFollowUpEmailFlow = ai.defineFlow(
  {
    name: 'generateFollowUpEmailFlow',
    inputSchema: GenerateFollowUpEmailInputSchema,
    outputSchema: GenerateFollowUpEmailOutputSchema,
  },
  async input => {
    // Execute the prompt with the given input.
    const {output} = await generateFollowUpEmailPrompt(input);
    // Return the output, ensuring it's not null with the `!` operator.
    return output!;
  }
);
