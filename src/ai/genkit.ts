/**
 * @file This file configures and initializes the Genkit AI instance.
 * It sets up the necessary plugins (like Google AI) and specifies a default model
 * that will be used across the application for AI-powered features.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

/**
 * The global AI instance for the application.
 * It's configured with the Google AI plugin and sets a default model.
 * This `ai` object will be used to define flows, prompts, and other Genkit features.
 */
export const ai = genkit({
  plugins: [
    // The Google AI plugin provides access to Google's generative models (e.g., Gemini).
    googleAI()
  ],
  // Specifies the default model to be used for generation tasks.
  // This can be overridden in specific prompts or flows if needed.
  model: 'googleai/gemini-2.0-flash',
});
