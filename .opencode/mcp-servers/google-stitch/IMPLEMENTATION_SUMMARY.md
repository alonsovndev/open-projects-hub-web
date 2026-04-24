# Google Stitch MCP Integration - Complete Setup Summary

## ✅ What Has Been Set Up

Your project now has a complete Google Stitch MCP (Model Context Protocol) server integration that enables AI-powered design-to-code workflows.

### Created Files and Structure

```
.opencode/
  mcp-servers/
    google-stitch/
      ├── src/
      │   ├── index.ts                    # MCP server entry point
      │   ├── stitch-client.ts            # Google Stitch API client
      │   ├── types.ts                    # TypeScript type definitions
      │   └── tools/
      │       ├── index.ts                # Tool registry
      │       ├── fetch-component.ts      # Component fetching tool
      │       ├── list-components.ts      # Component listing tool
      │       ├── fetch-tokens.ts         # Design tokens tool
      │       └── generate-react.ts       # React code generator
      ├── dist/                           # ✅ Compiled JavaScript (ready to use)
      ├── node_modules/                   # ✅ Dependencies installed
      ├── package.json
      ├── tsconfig.json
      ├── .gitignore
      ├── README.md                       # Detailed usage documentation
      └── SETUP.md                        # Step-by-step setup guide
```

### Updated Configuration Files

1. **`opencode.json`** - MCP server configuration and custom commands added
2. **`AGENTS.md`** - Google Stitch integration guidelines added
3. **`.env.example`** - Environment variable template with Stitch credentials

### MCP Tools Available

Once configured, you'll have access to these tools in OpenCode:

| Tool                                     | Description                                          |
| ---------------------------------------- | ---------------------------------------------------- |
| `google_stitch_list_components`          | Browse all components in your design system          |
| `google_stitch_fetch_component`          | Get detailed specs, props, variants, and styles      |
| `google_stitch_fetch_design_tokens`      | Retrieve design tokens (colors, spacing, typography) |
| `google_stitch_generate_react_component` | Generate React component code from Stitch designs    |

### Custom Commands Available

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `/stitch-sync`   | Sync a component with its latest Stitch design |
| `/stitch-new`    | Create a new component from a Stitch design    |
| `/stitch-tokens` | Update project design tokens from Stitch       |

## 🚀 Next Steps

### 1. Configure Your Google Stitch Credentials

**Required:** Add your Google Stitch credentials to your `.env` file:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your credentials
GOOGLE_STITCH_API_KEY=your_actual_api_key_here
GOOGLE_STITCH_PROJECT_ID=your_actual_project_id_here
```

**Where to get these:**

- Log in to your Google Stitch account
- Navigate to Project Settings
- Generate an API key
- Copy your Project ID

### 2. Customize the API Integration

**Important:** The MCP server includes template code that needs customization for your actual Google Stitch API.

**What to customize:**

1. **API Endpoints** - Edit `.opencode/mcp-servers/google-stitch/src/stitch-client.ts`
   - Verify the base URL matches your Stitch API
   - Update endpoint paths to match your API structure
   - Adjust authentication headers if needed

2. **Response Formats** - Update type definitions
   - Modify `src/types.ts` to match your API responses
   - Adjust data transformations in tool implementations

3. **Code Generation** - Customize React templates
   - Edit `src/tools/generate-react.ts` for your project conventions
   - Adjust style generation for your design system

**After customization:**

```bash
cd .opencode/mcp-servers/google-stitch
npm run build
```

### 3. Test the Integration

Start OpenCode and test the MCP tools:

```bash
opencode
```

**Test commands:**

```
Use google_stitch_list_components to show all available components

Use google_stitch_fetch_component to get details for "ButtonPrimary"

Use google_stitch_fetch_design_tokens to get all color tokens

/stitch-new TestComponent
```

### 4. Integrate into Your Workflow

**Example workflow:**

1. **Browse designs:**

   ```
   Show me all form components using google_stitch_list_components
   ```

2. **Get component details:**

   ```
   Use google_stitch_fetch_component to get the LoginForm specs with styles
   ```

3. **Generate component:**

   ```
   Use google_stitch_generate_react_component to create a React component
   from the UserCard design with tests in SCSS module format
   ```

4. **Sync existing components:**

   ```
   /stitch-sync ButtonPrimary
   ```

5. **Update design tokens:**
   ```
   /stitch-tokens
   ```

## 📚 Documentation

Comprehensive documentation has been created:

1. **`.opencode/mcp-servers/google-stitch/README.md`**
   - Complete tool reference
   - Usage examples
   - Development guide
   - Troubleshooting

2. **`.opencode/mcp-servers/google-stitch/SETUP.md`**
   - Step-by-step setup instructions
   - Customization guide
   - Testing procedures

3. **`AGENTS.md`** (updated)
   - Google Stitch integration guidelines
   - Workflow best practices
   - Custom command reference

## 🔍 How It Works

### Architecture

```
┌──────────────┐
│   OpenCode   │
└──────┬───────┘
       │ (stdio)
       ▼
┌──────────────────────────────┐
│  Google Stitch MCP Server    │
│  (.opencode/mcp-servers/     │
│   google-stitch/)            │
└──────────┬───────────────────┘
           │ (HTTP/REST)
           ▼
┌──────────────────────────────┐
│  Google Stitch API           │
│  (Design specifications)     │
└──────────────────────────────┘
```

### Workflow Integration

When you use a Stitch tool in OpenCode:

1. **Request** → OpenCode sends tool call to MCP server
2. **API Call** → MCP server calls Google Stitch API
3. **Transform** → MCP server transforms response
4. **Generate** → MCP server generates React code (if applicable)
5. **Response** → Returns structured data to OpenCode
6. **Action** → OpenCode uses data to create/update components

## ⚙️ Configuration Reference

### Environment Variables

| Variable                   | Required | Description                                                |
| -------------------------- | -------- | ---------------------------------------------------------- |
| `GOOGLE_STITCH_API_KEY`    | ✅ Yes   | Your Google Stitch API key                                 |
| `GOOGLE_STITCH_PROJECT_ID` | ✅ Yes   | Your Google Stitch project ID                              |
| `GOOGLE_STITCH_API_URL`    | ❌ No    | Custom API URL (default: https://api.stitch.google.com/v1) |

### MCP Configuration (opencode.json)

```json
{
  "mcp": {
    "google-stitch": {
      "type": "local",
      "command": ["node", ".opencode/mcp-servers/google-stitch/dist/index.js"],
      "environment": {
        "GOOGLE_STITCH_API_KEY": "{env:GOOGLE_STITCH_API_KEY}",
        "GOOGLE_STITCH_PROJECT_ID": "{env:GOOGLE_STITCH_PROJECT_ID}"
      },
      "enabled": true,
      "timeout": 10000
    }
  }
}
```

## 🐛 Troubleshooting

### "Missing required environment variables"

**Solution:** Set `GOOGLE_STITCH_API_KEY` and `GOOGLE_STITCH_PROJECT_ID` in `.env`

### "Cannot find module"

**Solution:** Install dependencies:

```bash
cd .opencode/mcp-servers/google-stitch && npm install
```

### "Stitch API error: 401"

**Solution:** Verify your API key is correct and hasn't expired

### MCP server not starting

**Solution:** Check OpenCode logs:

```bash
opencode --verbose
```

## 📖 Additional Resources

- [OpenCode MCP Documentation](https://opencode.ai/docs/mcp-servers/)
- [Model Context Protocol Spec](https://spec.modelcontextprotocol.io/)
- [Project AGENTS.md](../../../AGENTS.md) - Integration guidelines

## ✨ Benefits

With this setup, you can now:

✅ **Reference designs directly** - Query Stitch designs without leaving your IDE  
✅ **Generate components** - Auto-generate React components from Stitch specs  
✅ **Stay synchronized** - Keep your codebase in sync with design updates  
✅ **Extract tokens** - Pull design tokens directly into your stylesheets  
✅ **Speed up development** - Reduce manual translation from design to code  
✅ **Maintain consistency** - Ensure components match approved designs

## 🎯 Status

| Task                   | Status                         |
| ---------------------- | ------------------------------ |
| MCP server created     | ✅ Complete                    |
| Dependencies installed | ✅ Complete                    |
| TypeScript compiled    | ✅ Complete                    |
| Configuration updated  | ✅ Complete                    |
| Documentation created  | ✅ Complete                    |
| **Ready to configure** | ⏳ **Your credentials needed** |
| **Ready to customize** | ⏳ **API integration needed**  |
| **Ready to use**       | ⏳ **After configuration**     |

---

**You're all set!** Follow the Next Steps above to complete the setup and start using Google Stitch with OpenCode.
