'use server';

import { getAtsSuggestions } from '@/ai/flows/optimize-resume-section-order';
import type { GetAtsSuggestionsInput, GetAtsSuggestionsOutput } from '@/ai/flows/optimize-resume-section-order';

type ActionResult = GetAtsSuggestionsOutput | { error: string };

export async function getAtsSuggestionsAction(input: GetAtsSuggestionsInput): Promise<ActionResult> {
  try {
    const result = await getAtsSuggestions(input);
    if (!result || !result.suggestions) {
      throw new Error("AI failed to return a valid response.");
    }
    return result;
  } catch (error) {
    console.error('Error getting ATS suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: `Failed to get suggestions: ${errorMessage}` };
  }
}
