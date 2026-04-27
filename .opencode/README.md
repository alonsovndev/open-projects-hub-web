# OpenCode Configuration for Open Projects Hub

This directory contains OpenCode-specific configuration and documentation for this project.

## Directory Structure

```
.opencode/
├── README.md              # This file - setup and configuration guide
├── knowledge/             # Project-specific knowledge base
│   └── stitch-project.md # Google Stitch project details and screen IDs
├── package.json           # OpenCode plugin dependency
└── .gitignore            # Ignored files for this directory
```

## Google Stitch Integration

This project uses Google Stitch for design specifications and component library management.

### Configuration

The Stitch MCP is configured via environment variables in the project's `.env` file:

```bash
# Your Google Stitch API key
export GOOGLE_STITCH_API_KEY=your_api_key_here

# Your Google Stitch project ID
export GOOGLE_STITCH_PROJECT_ID=16776115461154935486
```

### Project Details

- **Project Name:** Open Project Hub
- **Project ID:** `16776115461154935486`
- **Design System:** Anthesis Corporate (Asset ID: `64c0bbcd704041f3a925eb09c697f79b`)

See `knowledge/stitch-project.md` for:

- Complete list of all screen IDs
- Design system color tokens
- Typography specifications
- Implementation guidelines
- MCP usage examples

### Setup Instructions

1. **Copy environment template:**

   ```bash
   cp .env.example .env
   ```

2. **Add your credentials:**
   - Get your Stitch API key from Google Stitch project settings
   - The project ID is already documented: `16776115461154935486`

3. **Verify MCP connection:**
   Use OpenCode to test the connection:
   ```
   "Test the Stitch MCP by listing screens"
   ```

### Using Stitch MCP

The MCP tools automatically use the project ID from `.env`:

```typescript
// Fetch a specific screen
stitch_get_screen({
  name: "projects/16776115461154935486/screens/{screenId}",
  projectId: "16776115461154935486",
  screenId: "{screenId}",
});

// List all screens
stitch_list_screens({
  projectId: "16776115461154935486",
});

// Get design system
stitch_list_design_systems({
  projectId: "16776115461154935486",
});
```

## Knowledge Base

The `knowledge/` directory contains project-specific documentation that OpenCode can reference:

- `stitch-project.md` - Complete Stitch project reference including all screen IDs, design tokens, and implementation patterns

## Package Management

This directory has its own `package.json` to manage OpenCode-specific dependencies:

```json
{
  "dependencies": {
    "@opencode-ai/plugin": "1.3.17"
  }
}
```

To update dependencies:

```bash
cd .opencode
npm install
```

## Best Practices

1. **Keep project-specific**: Only project-specific OpenCode configuration goes here
2. **Document thoroughly**: Update knowledge base files when adding new screens or patterns
3. **Version control**: All files except secrets (which go in `.env`) should be committed
4. **Security**: Never commit `.env` - it's in `.gitignore` at the project root

## Troubleshooting

### Stitch MCP Not Working

1. Verify `.env` has correct API key and project ID
2. Check environment variables are exported (note the `export` prefix)
3. Restart OpenCode to reload environment variables
4. Test with: `stitch_list_projects` or `stitch_get_project`

### Environment Variables Not Loading

The `.env` file in the project root is automatically loaded by Vite and available to MCP servers. Ensure:

- File is named exactly `.env` (not `.env.local` or similar for MCP)
- Variables use `export` prefix for shell compatibility
- No syntax errors in the file

## Related Documentation

- Project-level: `../AGENTS.md` - Main agent working standards
- User-level: `~/.config/opencode/` - Global OpenCode configuration
- Stitch docs: `knowledge/stitch-project.md` - Complete screen and design system reference
