import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { StitchClient } from "./stitch-client.js";
import { tools, executeTool } from "./tools/index.js";

/**
 * Google Stitch MCP Server
 *
 * Provides tools for interacting with Google Stitch design system API:
 * - Fetch component specifications
 * - List available components
 * - Retrieve design tokens
 * - Generate React components from designs
 */

// Validate required environment variables
const requiredEnvVars = ["GOOGLE_STITCH_API_KEY", "GOOGLE_STITCH_PROJECT_ID"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.error("ERROR: Missing required environment variables:");
  missingVars.forEach((varName) => console.error(`  - ${varName}`));
  console.error("\nPlease set these environment variables and try again.");
  process.exit(1);
}

// Initialize Stitch API client
const stitchClient = new StitchClient({
  apiKey: process.env.GOOGLE_STITCH_API_KEY!,
  projectId: process.env.GOOGLE_STITCH_PROJECT_ID!,
  baseURL: process.env.GOOGLE_STITCH_API_URL, // Optional custom API URL
});

// Create MCP server instance
const server = new Server(
  {
    name: "google-stitch",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handle tool listing requests
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

/**
 * Handle tool execution requests
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    console.error(`Executing tool: ${name}`);
    const result = await executeTool(name, args || {}, stitchClient);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    console.error(`Error executing tool ${name}:`, error);

    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${error?.message || String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the MCP server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Google Stitch MCP server running on stdio");
  console.error(`Connected to project: ${process.env.GOOGLE_STITCH_PROJECT_ID}`);
  console.error(`Available tools: ${tools.length}`);
}

// Run the server
main().catch((error) => {
  console.error("Fatal error starting MCP server:", error);
  process.exit(1);
});
