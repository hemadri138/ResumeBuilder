'use server';

/**
 * @fileOverview A Genkit flow to get ATS suggestions for a resume based on a job description.
 *
 * - getAtsSuggestions - A function that gets ATS suggestions.
 * - GetAtsSuggestionsInput - The input type for the getAtsSuggestions function.
 * - GetAtsSuggestionsOutput - The return type for the getAtsSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetAtsSuggestionsInputSchema = z.object({
  resume: z.string().describe('The complete resume data in JSON format.'),
  jobDescription: z
    .string()
    .describe('The job description to compare the resume against.'),
});
export type GetAtsSuggestionsInput = z.infer<
  typeof GetAtsSuggestionsInputSchema
>;

const GetAtsSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'Actionable suggestions to improve the resume for the given job description, formatted as markdown. Include an estimated ATS score improvement.'
    ),
});
export type GetAtsSuggestionsOutput = z.infer<
  typeof GetAtsSuggestionsOutputSchema
>;

export async function getAtsSuggestions(
  input: GetAtsSuggestionsInput
): Promise<GetAtsSuggestionsOutput> {
  return getAtsSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getAtsSuggestionsPrompt',
  input: {schema: GetAtsSuggestionsInputSchema},
  output: {schema: GetAtsSuggestionsOutputSchema},
  prompt: `You are an expert ATS resume reviewer and career coach. Your task is to analyze the provided resume against the given job description and provide actionable suggestions to improve its ATS score and overall effectiveness.

    Resume (JSON format):
    {{{resume}}}

    Job Description:
    {{{jobDescription}}}

    Please provide the following:
    1.  A list of specific, actionable suggestions to improve the resume.
    2.  Focus on incorporating relevant keywords from the job description into the resume's experience, skills, and projects sections.
    3.  Suggest improvements to the bullet points in the experience section to better match the job requirements, using action verbs.
    4.  Provide an estimated percentage improvement in the ATS score if the suggestions are applied.
    5.  Format your entire response as a single markdown string in the 'suggestions' field.
    `,
});

const getAtsSuggestionsFlow = ai.defineFlow(
  {
    name: 'getAtsSuggestionsFlow',
    inputSchema: GetAtsSuggestionsInputSchema,
    outputSchema: GetAtsSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
