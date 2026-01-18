'use server';

import { optimizeResumeSectionOrder } from '@/ai/flows/optimize-resume-section-order';
import type { OptimizeResumeSectionOrderInput, OptimizeResumeSectionOrderOutput } from '@/ai/flows/optimize-resume-section-order';

type ActionResult = OptimizeResumeSectionOrderOutput | { error: string };

export async function getOptimalSectionOrder(input: OptimizeResumeSectionOrderInput): Promise<ActionResult> {
  try {
    const result = await optimizeResumeSectionOrder(input);
    if (!result || !result.orderedSections) {
      throw new Error("AI failed to return a valid response.");
    }
    return result;
  } catch (error) {
    console.error('Error optimizing resume section order:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: `Failed to optimize section order: ${errorMessage}` };
  }
}
