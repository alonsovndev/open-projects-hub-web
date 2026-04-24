import { StitchClient } from "../stitch-client.js";

/**
 * Fetch detailed component specifications from Google Stitch
 */
export async function fetchComponent(
  args: { identifier: string; includeStyles?: boolean },
  client: StitchClient
) {
  const { identifier, includeStyles = true } = args;

  let component;

  // Try to fetch by ID first
  try {
    component = await client.getComponent(identifier);
  } catch (error) {
    // If not found by ID, try searching by name
    const searchResults = await client.searchComponents(identifier);

    if (searchResults.length === 0) {
      throw new Error(`Component not found: ${identifier}`);
    }

    // Use first match
    component = await client.getComponent(searchResults[0].id);
  }

  const result: any = {
    id: component.id,
    name: component.name,
    description: component.description,
    category: component.category,
    props: component.props || [],
    variants: component.variants || [],
    examples: component.examples || [],
    tags: component.tags || [],
  };

  // Optionally include styles
  if (includeStyles) {
    try {
      result.styles = await client.getComponentStyles(component.id);
    } catch (error) {
      console.error(`Failed to fetch styles for ${component.name}:`, error);
      result.styles = null;
    }
  }

  return result;
}
