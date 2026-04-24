# Google Stitch MCP Setup Guide

This guide walks you through setting up the Google Stitch MCP server for your project.

## Quick Start

### Step 1: Get Google Stitch API Credentials

1. Log in to your Google Stitch account
2. Navigate to your project settings
3. Generate an API key
4. Copy your Project ID

### Step 2: Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Add your credentials to `.env`:

   ```bash
   GOOGLE_STITCH_API_KEY=your_actual_api_key
   GOOGLE_STITCH_PROJECT_ID=your_actual_project_id
   ```

3. **IMPORTANT:** Never commit your `.env` file to version control

### Step 3: Verify MCP Server Build

The MCP server dependencies are already installed and built. Verify:

```bash
ls .opencode/mcp-servers/google-stitch/dist/
```

You should see compiled JavaScript files.

### Step 4: Test the MCP Server

Start OpenCode and test the integration:

```bash
opencode
```

Then try a command:

```
Use google_stitch_list_components to show all available components
```

## Customization Required

**IMPORTANT:** The MCP server includes template code that needs customization for your actual Google Stitch API.

### What to Customize

1. **API Endpoints** - Update `.opencode/mcp-servers/google-stitch/src/stitch-client.ts`
   - Verify the base URL matches your Stitch API
   - Adjust endpoint paths to match your API structure
   - Update authentication if needed

2. **Response Formats** - Update type definitions and parsers
   - Modify `src/types.ts` to match your API responses
   - Adjust data transformations in `src/tools/*` files

3. **Code Generation** - Customize React component templates
   - Edit `src/tools/generate-react.ts` to match your project conventions
   - Adjust style generation for your design system

### Testing Your Customizations

After making changes:

1. Rebuild the MCP server:

   ```bash
   cd .opencode/mcp-servers/google-stitch
   npm run build
   ```

2. Restart OpenCode

3. Test each tool:
   ```
   Use google_stitch_list_components
   Use google_stitch_fetch_component with identifier "ButtonPrimary"
   Use google_stitch_fetch_design_tokens
   Use google_stitch_generate_react_component with componentId "btn-123"
   ```

## Usage Examples

### Example 1: Browse Components

```
Show me all components in the "Forms" category using google_stitch_list_components
```

### Example 2: Get Component Details

```
Use google_stitch_fetch_component to get full details for the "LoginForm" component including styles
```

### Example 3: Generate New Component

```
Use google_stitch_generate_react_component to create a React component from the "UserProfileCard" design with tests
```

### Example 4: Sync Design Tokens

```
Use the /stitch-tokens command to update our design tokens
```

### Example 5: Create Component with Custom Command

```
/stitch-new CardComponent
```

## Troubleshooting

### "Missing required environment variables"

- Check that `GOOGLE_STITCH_API_KEY` and `GOOGLE_STITCH_PROJECT_ID` are set in `.env`
- Restart OpenCode after setting variables

### "Cannot find module '@modelcontextprotocol/sdk'"

- The MCP server needs dependencies installed:
  ```bash
  cd .opencode/mcp-servers/google-stitch
  npm install
  ```

### "Stitch API error: 401"

- Verify your API key is correct
- Check if the API key has expired
- Ensure you have proper permissions

### "Component not found"

- List available components first with `google_stitch_list_components`
- Use exact component names or IDs
- Check if you're using the correct project ID

## API Documentation

If your Google Stitch API documentation is different from the templates:

1. Review your API docs
2. Update `src/stitch-client.ts` methods
3. Adjust type definitions in `src/types.ts`
4. Test thoroughly

## Next Steps

1. ✅ Set up environment variables
2. ✅ Verify MCP server build
3. ✅ Test basic commands
4. 📝 Customize API integration for your Stitch setup
5. 📝 Create your first component from Stitch
6. 📝 Set up design token synchronization
7. 📝 Integrate into your development workflow

## Support

If you encounter issues:

1. Check OpenCode logs: `opencode --verbose`
2. Review MCP server logs in the OpenCode output
3. Verify your Google Stitch API credentials
4. Ensure the MCP server is properly configured in `opencode.json`

## Additional Resources

- [OpenCode MCP Documentation](https://opencode.ai/docs/mcp-servers/)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- Google Stitch API Documentation (check your Stitch project)
- Project README: `.opencode/mcp-servers/google-stitch/README.md`
