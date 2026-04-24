import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { StitchClient } from "../stitch-client.js";
import { fetchComponent } from "./fetch-component.js";
import { listComponents } from "./list-components.js";
import { fetchTokens } from "./fetch-tokens.js";
import { generateReact } from "./generate-react.js";

/**
 * MCP tool definitions for Google Stitch integration
 */
export const tools: Tool[] = [
  {
    name: "fetch_component",
    description:
      "Fetch detailed specifications for a component from Google Stitch by ID or name. Returns component props, variants, examples, and optionally styles.",
    inputSchema: {
      type: "object",
      properties: {
        identifier: {
          type: "string",
          description: "Component ID or name to fetch",
        },
        includeStyles: {
          type: "boolean",
          description: "Include CSS/SCSS style information",
          default: true,
        },
      },
      required: ["identifier"],
    },
  },
  {
    name: "list_components",
    description:
      "List all available components in the Google Stitch project. Optionally filter by category or search query.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Filter by component category (optional)",
        },
        search: {
          type: "string",
          description: "Search query to filter components by name or description (optional)",
        },
      },
    },
  },
  {
    name: "fetch_design_tokens",
    description:
      "Fetch design system tokens (colors, typography, spacing, borders, shadows) from Google Stitch",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["colors", "typography", "spacing", "all"],
          description: "Type of design tokens to fetch",
          default: "all",
        },
      },
    },
  },
  {
    name: "generate_react_component",
    description:
      "Generate React component code (TypeScript, styles, tests) from a Google Stitch design specification",
    inputSchema: {
      type: "object",
      properties: {
        componentId: {
          type: "string",
          description: "Stitch component ID to generate from",
        },
        includeTests: {
          type: "boolean",
          description: "Generate test file",
          default: false,
        },
        styleFormat: {
          type: "string",
          enum: ["scss-module", "css-module", "styled-components"],
          description: "Preferred styling approach",
          default: "scss-module",
        },
      },
      required: ["componentId"],
    },
  },
];

/**
 * Execute a tool by name with provided arguments
 */
export async function executeTool(name: string, args: any, client: StitchClient): Promise<any> {
  switch (name) {
    case "fetch_component":
      return fetchComponent(args, client);

    case "list_components":
      return listComponents(args, client);

    case "fetch_design_tokens":
      return fetchTokens(args, client);

    case "generate_react_component":
      return generateReact(args, client);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
