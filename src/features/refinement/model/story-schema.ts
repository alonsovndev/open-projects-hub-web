import { z } from "zod";

export const refinedStorySchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  acceptanceCriteria: z.array(z.string()),
});
export const generatedStorySchema = refinedStorySchema.extend({ id: z.string().min(1) });
export const generationResponseSchema = z.object({
  stories: z.array(refinedStorySchema),
  rawNotes: z.string(),
  redactionCount: z.number().int().nonnegative().default(0),
  provider: z.enum(["platform", "gemini", "openai", "deepseek"]).default("platform"),
  creditsRemaining: z.number().nonnegative().nullable().default(null),
});
