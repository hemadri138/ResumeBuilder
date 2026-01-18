'use server';

/**
 * @fileOverview A Genkit flow to optimize the order of resume sections (Education, Skills, Experience, Projects) for better ATS and human readability.
 *
 * - optimizeResumeSectionOrder - A function that reorders the sections of a resume to optimize it for ATS and human readability.
 * - OptimizeResumeSectionOrderInput - The input type for the optimizeResumeSectionOrder function.
 * - OptimizeResumeSectionOrderOutput - The return type for the optimizeResumeSectionOrder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeResumeSectionOrderInputSchema = z.object({
  education: z.string().describe('The education section of the resume.'),
  skills: z.string().describe('The skills section of the resume.'),
  experience: z.string().describe('The work experience section of the resume.'),
  projects: z.string().describe('The projects section of the resume.'),
});
export type OptimizeResumeSectionOrderInput = z.infer<typeof OptimizeResumeSectionOrderInputSchema>;

const OptimizeResumeSectionOrderOutputSchema = z.object({
  orderedSections: z
    .array(z.string())
    .describe(
      'An array of strings representing the reordered sections (education, skills, experience, projects) in the optimal order.'
    ),
  reasoning: z.string().describe('The reasoning behind the reordering of the resume sections.'),
});
export type OptimizeResumeSectionOrderOutput = z.infer<typeof OptimizeResumeSectionOrderOutputSchema>;

export async function optimizeResumeSectionOrder(
  input: OptimizeResumeSectionOrderInput
): Promise<OptimizeResumeSectionOrderOutput> {
  return optimizeResumeSectionOrderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeResumeSectionOrderPrompt',
  input: {schema: OptimizeResumeSectionOrderInputSchema},
  output: {schema: OptimizeResumeSectionOrderOutputSchema},
  prompt: `You are an AI resume optimization expert. You will reorder the sections of a resume to optimize it for both Applicant Tracking Systems (ATS) and human readability.

  The available sections are Education, Skills, Experience, and Projects.

  Consider the content of each section when determining the optimal order.

  Education: {{{education}}}
  Skills: {{{skills}}}
  Experience: {{{experience}}}
  Projects: {{{projects}}}

  Output an array containing the ordered sections, and reasoning for the new ordering. Do not include any sections other than Education, Skills, Experience and Projects.
  `,
});

const optimizeResumeSectionOrderFlow = ai.defineFlow(
  {
    name: 'optimizeResumeSectionOrderFlow',
    inputSchema: OptimizeResumeSectionOrderInputSchema,
    outputSchema: OptimizeResumeSectionOrderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
