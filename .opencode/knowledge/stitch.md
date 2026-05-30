# Stitch Project — Open Project Hub

> Design-to-code via Google Stitch MCP. The MCP server is configured in `opencode.json` and exposes tools like `get_screen`, `edit_screens`, `generate_screen_from_text`, etc.

## Project

- **Name:** Open Project Hub
- **Project ID:** `16776115461154935486`
- **Design System:** Anthesis Corporate (Asset ID: `64c0bbcd704041f3a925eb09c697f79b`)
- **Device:** Desktop
- **Theme:** Precision Editorial
- **API Key Env Var:** `STITCH_OPEN_PROJECT_API_KEY` (set in `~/.bash_profile`, loaded via `~/.zprofile`)

## Available Screens

### Public Pages

| Screen           | ID                                 |
| ---------------- | ---------------------------------- |
| Home Page        | `23f464856c494512909f4aa73ccedef0` |
| Role Selection   | `e5f59a404e884a3f8eba912923aac38b` |
| Project ID Entry | `631c3df2f07d4873927988b03586feca` |

### Admin Authentication

| Screen          | ID                                 |
| --------------- | ---------------------------------- |
| Sign In         | `2bc2d0dc20a440a39d83b1e2d889016d` |
| Create Account  | `cd9d4a5660a8401688a9ecbe4c1c0afc` |
| Forgot Password | `0425f80e4aee4639963a9fa7233b1162` |
| Reset Password  | `9127d913b4554107bec811b2e0c6f9b5` |

### Admin Dashboard & Management

| Screen                      | ID                                 |
| --------------------------- | ---------------------------------- |
| Projects Overview           | `7caa98a2b08f43eaadfac3a5ac712bdf` |
| Create Project Modal        | `aa829dfa414a41ada24a63a5f286a49b` |
| Dashboard (Project Summary) | `2997d721d6ef4f229492c542676556f2` |
| Settings                    | `4f8de914ea604c1a81ee22fb5a6d951e` |
| Backlog                     | `a5069ec193b0462e88cf7f94e1a4557d` |

### Client / Collaboration

| Screen                        | ID                                 |
| ----------------------------- | ---------------------------------- |
| Client Viewer (Final Stories) | `9db5422e604e41c98cd91f9be7d96611` |
| AI Refinement Workspace       | `110b2b19025a4e19a7e317c2a7552bb1` |

## Usage

Fetch a screen design:

```
stitch_get_screen({
  name: "projects/16776115461154935486/screens/{screenId}",
  projectId: "16776115461154935486",
  screenId: "{screenId}",
});
```

Generate a new screen:

```
stitch_generate_screen_from_text({
  projectId: "16776115461154935486",
  prompt: "Create a...",
  deviceType: "DESKTOP",
});
```

Apply design system:

```
stitch_apply_design_system({
  projectId: "16776115461154935486",
  assetId: "64c0bbcd704041f3a925eb09c697f79b",
  selectedScreenInstances: [...]
});
```

## Implementation Guidelines

1. Fetch the design using the screen ID from the table above
2. Follow project structure — place in appropriate `src/features/` directory
3. Apply design tokens (SCSS variables matching the design system)
4. Use Ant Design for forms, tables, modals
5. Use semantic HTML + SCSS for custom layouts
6. Run `npm run type-check && npm run build` after implementation
