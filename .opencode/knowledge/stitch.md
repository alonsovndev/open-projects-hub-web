# Stitch Project — Open Project Hub

> Design-to-code via Google Stitch MCP. The MCP server is configured in `opencode.json` and exposes tools like `get_screen`, `edit_screens`, `generate_screen_from_text`, etc.

## Project

- **Name:** Open Project Hub
- **Project ID:** `16776115461154935486`
- **Design System:** Open Projects Hub — Precision Editorial (Asset ID: `64c0bbcd704041f3a925eb09c697f79b`)
- **Theme:** Precision Editorial (Light mode, Inter, ROUND_EIGHT, primary #0057c2)
- **Device:** Desktop
- **API Key Env Var:** `STITCH_OPEN_PROJECT_API_KEY` (set in `~/.bash_profile`, loaded via `~/.zprofile`)

## Design System Tokens

- **Primary:** #0057c2
- **Surface:** #f9f9f9 (page bg)
- **Surface Container Lowest:** #ffffff (cards)
- **Surface Container:** #eeeeee (borders)
- **Text Primary:** #2f3334
- **Text Secondary:** #5b6061
- **Radius:** SM 8px, MD 16px, LG 24px (cards/modals)
- **Typography:** Inter, H1 2rem/700, H2 1.5rem/600, H3 1.125rem/600, Body MD 0.875rem/400
- **Shadows:** Cards: 0 2px 8px rgba(0,0,0,0.06)
- **Spacing:** 4px grid (xs 4px → xxxl 64px)
- **Buttons:** Solid #0057c2 primary, 8px radius, 44px min height

## Refined Screens

All screens below are refined to the "Open Projects Hub — Precision Editorial" design system (Inter, #0057c2, ROUND_EIGHT, 8px/24px radii, #f9f9f9 bg, #ffffff cards).

### Public Pages

| Screen           | ID                                 | Notes                                                    |
| ---------------- | ---------------------------------- | -------------------------------------------------------- |
| Home Page        | `28d6df230c704dd28f5458508e9b5faf` | Hero + Features + Testimonials + Footer                  |
| Role Selection   | `6cc07bfa47944abd91f2bc645b97a883` | Two role cards (Admin/Client), feature lists, clear CTAs |
| Project ID Entry | `026ab0fe335343e5b4efbc4983cda126` | Centered card, ID input, Back to Role Selection link     |

### Admin Authentication

| Screen          | ID                                 | Notes                                             |
| --------------- | ---------------------------------- | ------------------------------------------------- |
| Sign In         | `065cb3c2b6e64b2f8155b52adeebdf2c` | Centered card, form UX, Inter, #0057c2            |
| Create Account  | `9ccb3094294145b7aa405861b4a3237c` | Centered card, password toggle, validation hints  |
| Forgot Password | `79900b0971974ebb89f5176a01aa3d43` | Centered card, email input, "Send Reset Link" CTA |
| Reset Password  | `c428a460e24d45c08f0a5d9d3db41cc6` | Centered card, new password + confirm fields      |

### Admin Dashboard & Management

| Screen                  | ID                                 | Notes                                                      |
| ----------------------- | ---------------------------------- | ---------------------------------------------------------- |
| Dashboard               | `340d853d15eb4be59acfe5c928e6ab91` | 240px sider, 4 stat cards, Recent Projects table           |
| Projects Overview       | `ebc71f32d6994dc68f5786b853167438` | 240px sider, filters, table with semantic tags, pagination |
| Create Project Modal    | `9e0d302806f0497baf8b5ed8115b59fc` | 600px modal, form with date pickers, validation            |
| Backlog                 | `a499c990bc184cb4b602a59420ba60b3` | Full backlog table with status/priority tags, filters      |
| Settings                | `efc391e6e9ff4e8d9bea43070c212c33` | Profile/Password/Preferences tabs, password strength       |
| AI Refinement Workspace | `515491f12dfc4df4a244eed1ad61d732` | Two-panel design, story cards, empty state                 |

### Client / Collaboration

| Screen                 | ID                                 | Notes                                                  |
| ---------------------- | ---------------------------------- | ------------------------------------------------------ |
| Final Approved Stories | `a5cb81662a294ae89504e20f51747540` | Read-only, story cards with status tags, public layout |

## Design System Applied

The "Open Projects Hub — Precision Editorial" design system has been applied to all refined screens. Key token values:

- `customColor: #0057c2`
- `roundness: ROUND_EIGHT`
- `colorVariant: TONAL_SPOT`
- `overridePrimaryColor: #0057c2`
- `overrideSecondaryColor: #666666`
- `overrideNeutralColor: #f9f9f9`

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
  prompt: "...",
  deviceType: "DESKTOP",
  designSystem: "assets/64c0bbcd704041f3a925eb09c697f79b"
});
```

## Implementation Guidelines

1. Fetch the design using the screen ID from the table above
2. Follow project structure — place in appropriate `src/features/` directory
3. Apply design tokens (SCSS variables matching the design system)
4. Use Ant Design for forms, tables, modals
5. Use semantic HTML + SCSS for custom layouts
6. Run `npm run type-check && npm run build` after implementation
7. Use Inter font via `@fontsource/inter`
8. All design values must reference DESIGN.md as the source of truth
