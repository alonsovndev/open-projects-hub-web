# Stitch Project Configuration

## Project Details

- **Project Name:** Open Project Hub
- **Project ID:** `16776115461154935486`
- **Design System:** Anthesis Corporate (Asset ID: `64c0bbcd704041f3a925eb09c697f79b`)
- **Device Type:** Desktop
- **Theme:** Precision Editorial

## Design System Overview

### Color Philosophy

- **Primary:** #0057c2 (Enterprise Blue)
- **Primary Container:** #006ef2
- **Background:** #f9f9f9
- **Surface:** #f9f9f9
- **Surface Container:** #eeeeee
- **Surface Container Low:** #f3f3f3
- **Surface Container Lowest:** #ffffff (for floating elements)

### Key Design Principles

1. **No-Line Rule:** Prohibit 1px solid borders - use background color shifts instead
2. **Tonal Layering:** Create depth through surface variations, not heavy shadows
3. **Glassmorphism:** Use backdrop-blur for floating navigation
4. **Gradient CTAs:** Primary buttons use gradient from primary to primary_container at 135deg

### Typography

- **Font Family:** Inter
- **Display:** 3.5rem (sparingly for dashboards)
- **Headline:** 1.75rem (section headers)
- **Body:** 0.875rem (default content)
- **Labels:** 0.6875rem (all caps with 0.05rem letter-spacing)

### Spacing & Roundness

- **Roundness:** ROUND_FOUR (0.375rem)
- **Spacing Scale:** 1.0
- **Recommended Padding:** spacing-8 (1.75rem) for crowded content

## Available Screens

### Public Pages

- **Home Page** - `23f464856c494512909f4aa73ccedef0`
- **Role Selection** - `e5f59a404e884a3f8eba912923aac38b`
- **Project ID Entry** - `631c3df2f07d4873927988b03586feca`

### Admin Authentication

- **Sign In** - `2bc2d0dc20a440a39d83b1e2d889016d`
- **Create Account** - `cd9d4a5660a8401688a9ecbe4c1c0afc`
- **Forgot Password** - `0425f80e4aee4639963a9fa7233b1162`
- **Reset Password** - `9127d913b4554107bec811b2e0c6f9b5`

### Admin Dashboard & Management

- **Projects Overview** - `7caa98a2b08f43eaadfac3a5ac712bdf`
- **Create Project Modal** - `aa829dfa414a41ada24a63a5f286a49b`
- **Dashboard (Project Summary)** - `2997d721d6ef4f229492c542676556f2`
- **Settings** - `4f8de914ea604c1a81ee22fb5a6d951e`
- **Backlog** - `a5069ec193b0462e88cf7f94e1a4557d`

### Client/Collaboration

- **Client Viewer (Final Stories)** - `9db5422e604e41c98cd91f9be7d96611`
- **AI Refinement Workspace** - `110b2b19025a4e19a7e317c2a7552bb1`

## Stitch MCP Usage

### Fetching Screen Details

```typescript
// Get screen with HTML code
stitch_get_screen({
  name: "projects/16776115461154935486/screens/{screenId}",
  projectId: "16776115461154935486",
  screenId: "{screenId}",
});
```

### Applying Design System

```typescript
// Apply design system to screens
stitch_apply_design_system({
  projectId: "16776115461154935486",
  assetId: "64c0bbcd704041f3a925eb09c697f79b",
  selectedScreenInstances: [...]
})
```

### Generating New Screens

```typescript
// Generate from text prompt
stitch_generate_screen_from_text({
  projectId: "16776115461154935486",
  prompt: "Create a...",
  deviceType: "DESKTOP",
});
```

## Implementation Guidelines

When implementing components from Stitch designs:

1. **Fetch the design** using `stitch_get_screen` or reference the screen ID above
2. **Download HTML code** for structural reference
3. **Follow project structure** - place in appropriate `src/pages/` or `src/features/` directory
4. **Apply design tokens** - use SCSS variables matching the design system colors
5. **Use Ant Design** for forms, tables, modals, and data-driven interactions
6. **Use semantic HTML + SCSS** for marketing content and custom layouts
7. **Verify** - Run `npm run type-check && npm run build` after implementation

## Notes

- The design system emphasizes **"Precision Editorial"** aesthetic
- Avoid traditional "boxed-in" enterprise templates
- Use intentional asymmetry and high-contrast typography
- Minimize cognitive load through clear content-first hierarchy
