import { StitchClient } from "../stitch-client.js";

/**
 * List all components in the Stitch project
 */
export async function listComponents(
  args: { category?: string; search?: string },
  client: StitchClient
) {
  const { category, search } = args;

  const components = await client.listComponents({
    category,
    search,
  });

  return {
    total: components.length,
    components: components.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      category: c.category,
      tags: c.tags || [],
    })),
  };
}
