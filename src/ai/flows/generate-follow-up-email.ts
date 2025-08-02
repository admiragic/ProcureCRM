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
export type GenerateFollowUpEmailInput = z.infer<typeof GenerateFollowUpEmailInputSchema>;

const GenerateFollowUpEmailOutputSchema = z.object({
  emailContent: z.string().describe('The generated follow-up email content.'),
});
export type GenerateFollowUpEmailOutput = z.infer<typeof GenerateFollowUpEmailOutputSchema>;

export async function generateFollowUpEmail(
  input: GenerateFollowUpEmailInput
): Promise<GenerateFollowUpEmailOutput> {
  return generateFollowUpEmailFlow(input);
}

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

const generateFollowUpEmailFlow = ai.defineFlow(
  {
    name: 'generateFollowUpEmailFlow',
    inputSchema: GenerateFollowUpEmailInputSchema,
    outputSchema: GenerateFollowUpEmailOutputSchema,
  },
  async input => {
    const {output} = await generateFollowUpEmailPrompt(input);
    return output!;
  }
);
