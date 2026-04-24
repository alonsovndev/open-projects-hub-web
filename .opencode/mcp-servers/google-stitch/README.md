# Google Stitch MCP Server

A Model Context Protocol (MCP) server for integrating Google Stitch design specifications with your React development workflow.

## Overview

This MCP server provides tools for:

- Fetching component designs and specifications from Google Stitch
- Listing available components in your design system
- Retrieving design tokens (colors, typography, spacing, etc.)
- Generating React component code from Stitch designs

## Prerequisites

- Node.js 18+ or Bun
- Google Stitch API access
- OpenCode installed and configured

## Setup

### 1. Environment Variables

Add these environment variables to your `.env` file:

```bash
GOOGLE_STITCH_API_KEY=your_api_key_here
GOOGLE_STITCH_PROJECT_ID=your_project_id_here
```

Optional:

```bash
GOOGLE_STITCH_API_URL=https://api.stitch.google.com/v1  # Custom API URL
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Server

```bash
npm run build
```

## Usage

The MCP server is automatically started by OpenCode when configured in `opencode.json`.

### Available Tools

#### 1. `google_stitch_list_components`

List all available components in your Stitch project.

**Arguments:**

- `category` (optional): Filter by component category
- `search` (optional): Search query to filter components

**Example:**

```
Use google_stitch_list_components to show all button components
```

#### 2. `google_stitch_fetch_component`

Fetch detailed specifications for a specific component.

**Arguments:**

- `identifier` (required): Component ID or name
- `includeStyles` (optional, default: true): Include CSS/SCSS styles

**Example:**

```
Use google_stitch_fetch_component to get the specs for the LoginButton component
```

#### 3. `google_stitch_fetch_design_tokens`

Retrieve design system tokens.

**Arguments:**

- `type` (optional, default: 'all'): Type of tokens ('colors', 'typography', 'spacing', 'all')

**Example:**

```
Use google_stitch_fetch_design_tokens to get all color tokens
```

#### 4. `google_stitch_generate_react_component`

Generate React component code from a Stitch design.

**Arguments:**

- `componentId` (required): Stitch component ID
- `includeTests` (optional, default: false): Generate test file
- `styleFormat` (optional, default: 'scss-module'): Style format ('scss-module', 'css-module', 'styled-components')

**Example:**

```
Use google_stitch_generate_react_component to create a React component from the UserCard design
```

## Custom Commands

The following custom commands are available in OpenCode:

- `/stitch-sync` - Sync an existing component with its Stitch design
- `/stitch-new` - Create a new component from a Stitch design
- `/stitch-tokens` - Update project design tokens from Stitch

## Development

### Watch Mode

```bash
npm run watch
```

### Local Testing

```bash
npm start
```

## API Customization

**IMPORTANT:** This MCP server includes template implementations that need to be adapted to your actual Google Stitch API.

### Files to Customize

1. **`src/stitch-client.ts`** - Adapt API endpoints and authentication
   - Update the `baseURL` if different
   - Adjust request/response formats to match your API
   - Modify authentication headers if needed

2. **`src/types.ts`** - Update type definitions
   - Match types to your actual API responses
   - Add/remove fields as needed

3. **Tool implementations** (`src/tools/`) - Adjust data transformations
   - Modify how API responses are processed
   - Update code generation templates

### Example Customization

If your Stitch API returns components in a different format:

```typescript
// Before (template)
const response = await this.client.get(`/projects/${this.projectId}/components`);
return response.data.components || [];

// After (customized for your API)
const response = await this.client.get(`/api/v2/designs/${this.projectId}/library`);
return response.data.items.map((item) => ({
  id: item.designId,
  name: item.displayName,
  // ... map other fields
}));
```

## Troubleshooting

### Server won't start

Check that environment variables are set:

```bash
echo $GOOGLE_STITCH_API_KEY
echo $GOOGLE_STITCH_PROJECT_ID
```

### API errors

Enable debug logging by checking OpenCode logs:

```bash
opencode --verbose
```

### TypeScript errors

Rebuild the server:

```bash
npm run build
```

## Architecture

```
src/
├── index.ts              # MCP server entry point
├── stitch-client.ts      # Google Stitch API client
├── types.ts              # TypeScript type definitions
└── tools/
    ├── index.ts          # Tool registry
    ├── fetch-component.ts
    ├── list-components.ts
    ├── fetch-tokens.ts
    └── generate-react.ts
```

## Contributing

When adding new tools:

1. Create tool implementation in `src/tools/`
2. Add tool definition to `src/tools/index.ts`
3. Update this README with usage examples
4. Rebuild and test

## License

ISC
