---
name: Open Projects Hub
colors:
  primary: "#0057c2"
  primary-light: "#4a8fd9"
  primary-dark: "#006ef2"
  surface-white: "#ffffff"
  surface-light: "#f9f9f9"
  surface-base: "#eeeeee"
  text-primary: "#1a1a1a"
  text-secondary: "#666666"
typography:
  h1:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.25
  h2:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.3
  h3:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.4
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label-caps:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 600
    letterSpacing: 0.05em
    textTransform: uppercase
  code:
    fontFamily: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace
    fontSize: 0.875rem
rounded:
  sm: 8px
  md: 16px
  lg: 24px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.sm}"
    padding: 12px 16px
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  card:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.surface-base}"
  menu-item-active:
    backgroundColor: rgba(0, 87, 194, 0.1)
    textColor: "{colors.primary}"
  input:
    rounded: "{rounded.sm}"
    border: "1px solid {colors.surface-base}"
---

## Overview

Open Projects Hub is a professional project management platform for consulting teams. The UI follows a **Precision Editorial** design philosophy — clean, structured, and focused on data clarity. It evokes a premium matte-finish aesthetic: high-contrast neutrals, a confident blue primary, and generous whitespace.

The design prioritizes:

- **Readability** — high-contrast text on clean surfaces, Inter typeface at comfortable sizes
- **Data density** — information-rich views (tables, kanban boards, stat cards) without visual clutter
- **Trust** — the blue primary (#0057c2) conveys reliability and professionalism

## Colors

The palette is built on a high-contrast neutral foundation with a single blue primary for interaction.

- **Primary (#0057c2):** Action driver for buttons, links, selected menu items, and interactive elements. Passes WCAG AA on white (contrast 6.3:1) and on dark surfaces.
- **Primary Light (#4a8fd9):** Hover states, disabled interactions, subtle backgrounds.
- **Primary Dark (#006ef2):** Button hover, active press states, focus rings.
- **Surface White (#ffffff):** Card backgrounds, form containers, sidebars, modals.
- **Surface Light (#f9f9f9):** Page-level background, subtle section dividers.
- **Surface Base (#eeeeee):** Borders, dividers, disabled states, skeleton placeholders.
- **Text Primary (#1a1a1a):** Headlines, body copy, table content, form labels. Contrast 14.9:1 on white.
- **Text Secondary (#666666):** Captions, metadata, placeholder text, help text. Contrast 5.4:1 on white.

### Dark mode

When the user selects "Dark" or "Auto" (system preference matches `prefers-color-scheme: dark`), surfaces invert: white → #1e1e1e, light → #141414, base → #2d2d2d. Text flips: primary → #e8e8e8, secondary → #a0a0a0. The primary blue is preserved but lightened slightly for contrast on dark backgrounds.

## Typography

The entire UI uses **Inter** (variable font) for both headlines and body text. No secondary typeface — the single-family approach keeps the interface cohesive and avoids visual conflict.

- **H1 (2rem/700):** Page titles — Dashboard, Backlog, Settings, Projects
- **H2 (1.5rem/600):** Section headings within a page
- **H3 (1.125rem/600):** Card titles, panel headers
- **Body MD (1rem/400):** Paragraphs, table cells, form inputs, button labels
- **Body SM (0.875rem/400):** Metadata, captions, secondary info, help text
- **Label Caps (0.75rem/600/0.05em):** Column headers, filter labels, section labels
- **Code (0.875rem/monospace):** Code snippets, technical identifiers

Inter font files are loaded via `@fontsource/inter` (already a dependency). The font stack falls back to `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

## Layout

Page layout follows a fixed-left-sider + fluid-content pattern:

- **Sider:** 240px collapsed to 80px. Contains logo, navigation menu, user section.
- **Content:** `min-height: 100vh`, padded at 48px (desktop), 24px (tablet), 16px (mobile).
- **Background:** Surface Light (#f9f9f9) for the content area; Surface White (#ffffff) for cards.

Feature pages are composed vertically: page title row → content sections (tabs, tables, forms, stat cards). No horizontal scrolling on any page.

Spacing follows a 4px grid with 7 tiers: 4px → 8px → 16px → 24px → 32px → 48px → 64px.

## Elevation & Depth

The UI uses minimal elevation — flat design with subtle shadow cues:

- **Cards:** `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06)` — subtle lift from page background
- **Sider:** `box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03)` — shallow right-side shadow
- **Modals & Dropdowns:** Default Ant Design elevation (16px blur at 0.15 opacity)
- **No persistent floating elements** — no FABs, no sticky headers beyond the sider

## Shapes

Border radii are generous but not pill-shaped:

- **SM (8px):** Buttons, inputs, menu items, table rows
- **MD (16px):** Larger containers, stat cards, filter panels
- **LG (24px):** Card components, modals, form sections

All corners in a component use the same radius (no mixed corner treatments).

## Components

### button-primary

- Background: Primary (#0057c2) → hover: Primary Dark (#006ef2)
- Text: White (#ffffff)
- Radius: SM (8px)
- Padding: 12px 16px
- Typography: Body MD (1rem/600)
- Full width on mobile; inline on desktop

### card

- Background: White (#ffffff)
- Radius: LG (24px)
- Border: 1px solid Surface Base (#eeeeee)
- Shadow: 0 2px 8px rgba(0, 0, 0, 0.06)
- Padding: 24px (internal, via Ant Design Card)

### menu-item

- Default: Text Secondary (#666666), transparent background
- Hover: Text Primary (#0057c2), background rgba(0, 87, 194, 0.04)
- Selected: Text Primary (#0057c2), background gradient rgba(0, 87, 194, 0.1)
- Radius: SM (8px)
- Height: 40px

### form-input

- Background: White (#ffffff)
- Border: 1px solid Surface Base (#eeeeee)
- Radius: SM (8px)
- Focus: Border Primary (#0057c2)
- Typography: Body MD (1rem/400)

## Do's and Don'ts

- ✅ **Do use the primary blue (#0057c2) for all interactive elements** — buttons, links, selected states, focus indicators
- ✅ **Do use Surface Light (#f9f9f9) as the page background** — it separates content areas from cards
- ✅ **Do use generous border radius (24px) on cards** — it distinguishes containers from the page
- ❌ **Don't add additional colors to the palette** — one primary is sufficient. Use semantic Ant Design colors (red for errors, green for success) via Ant Design's built-in tokens, not custom colors
- ❌ **Don't use box-shadows heavier than 8px blur** — the design is intentionally flat
- ❌ **Don't use more than two type sizes on a single card** — hierarchies should stay simple
- ❌ **Don't override Ant Design component radii inconsistently** — use the three-tier system (8/16/24)
