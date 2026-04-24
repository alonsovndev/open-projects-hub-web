import { StitchClient } from "../stitch-client.js";

/**
 * Fetch design tokens from Stitch
 */
export async function fetchTokens(
  args: { type?: "colors" | "typography" | "spacing" | "all" },
  client: StitchClient
) {
  const { type = "all" } = args;

  const tokenCollection = await client.getDesignTokens(type);

  // Format for easy consumption
  const result: any = {
    type,
  };

  if (type === "all" || type === "colors") {
    result.colors = tokenCollection.colors || [];
  }
  if (type === "all" || type === "typography") {
    result.typography = tokenCollection.typography || [];
  }
  if (type === "all" || type === "spacing") {
    result.spacing = tokenCollection.spacing || [];
  }
  if (type === "all") {
    result.borders = tokenCollection.borders || [];
    result.shadows = tokenCollection.shadows || [];
    result.other = tokenCollection.other || [];
  }

  return result;
}
