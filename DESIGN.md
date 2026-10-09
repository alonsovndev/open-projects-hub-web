---
# ============================================================
# Open Projects Hub — Design System
# ============================================================
# This file is the SINGLE SOURCE OF TRUTH for all UI and UX
# decisions. Every component, page, and interaction must
# conform to these standards.
# ============================================================

name: Open Projects Hub
colors:
  primary: "#0057c2"
  primary-light: "#4a8fd9"
  primary-dark: "#004da8"
  primary-hover: "#006ef2"
  surface-white: "#ffffff"
  surface-light: "#f9f9f9"
  surface-base: "#eeeeee"
  text-primary: "#1a1a1a"
  text-secondary: "#666666"
  semantic:
    success: "#52c41a"
    warning: "#faad14"
    error: "#ff4d4f"
    info: "#1677ff"
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
  md: 12px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px
breakpoints:
  mobile: 480px
  tablet: 768px
  desktop: 1024px
  wide: 1280px
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

# Open Projects Hub — Design System

## 1. Design Philosophy

Open Projects Hub follows a **Precision Editorial** design philosophy — clean, structured, and focused on data clarity. It evokes a premium matte-finish aesthetic: high-contrast neutrals, a confident blue primary, and generous whitespace.

### Core Principles

| Principle         | Description                                                      |
| ----------------- | ---------------------------------------------------------------- |
| **Clarity first** | Every UI element must communicate its purpose without ambiguity  |
| **Data density**  | Information-rich views without visual clutter                    |
| **Trust**         | Blue primary (#0057c2) conveys reliability and professionalism   |
| **Consistency**   | One component, one pattern — never two ways to do the same thing |
| **Accessibility** | WCAG AA compliant across all surfaces and interactions           |
| **Performance**   | Fast renders, minimal CSS, optimized assets                      |

---

## 2. Colors

The palette is built on a high-contrast neutral foundation with a single blue primary for interaction.

### Brand Palette

| Token              | Value   | Usage                                                           |
| ------------------ | ------- | --------------------------------------------------------------- |
| **Primary**        | #0057c2 | Buttons, links, selected menu items, interactive elements       |
| **Primary Light**  | #4a8fd9 | Hover states, disabled interactions, subtle backgrounds         |
| **Primary Dark**   | #004da8 | Button active press, focus rings                                |
| **Surface White**  | #ffffff | Card backgrounds, modals, sidebars                              |
| **Surface Light**  | #f9f9f9 | Page backgrounds, section dividers                              |
| **Surface Base**   | #eeeeee | Borders, dividers, disabled states, skeletons                   |
| **Text Primary**   | #1a1a1a | Headlines, body copy, labels. AA on white: 14.9:1               |
| **Text Secondary** | #666666 | Captions, metadata, placeholders, help text. AA on white: 5.4:1 |

### Semantic Colors

Use Ant Design's built-in semantic tokens. Do NOT define custom semantic colors.

| Purpose | Ant Design Token | Value   |
| ------- | ---------------- | ------- |
| Success | `colorSuccess`   | #52c41a |
| Warning | `colorWarning`   | #faad14 |
| Error   | `colorError`     | #ff4d4f |
| Info    | `colorInfo`      | #1677ff |

### Text Contrast Requirements

All text must meet WCAG AA contrast ratios:

- **Large text (18px+ / 14px bold+)**: 3:1 minimum
- **Normal text**: 4.5:1 minimum
- **Primary on white**: 6.3:1 ✅
- **Text Primary on white**: 14.9:1 ✅
- **Text Secondary on white**: 5.4:1 ✅
- **Placeholder text**: May use 3:1 minimum (NOT the body text standard)

### Color Usage Rules

- ✅ Primary blue (#0057c2) for ALL interactive elements
- ✅ Surface Light (#f9f9f9) as page background to separate cards
- ✅ Semantic Ant Design tokens for errors/success/warnings — never custom colors
- ❌ Never add additional brand colors to the palette
- ❌ Never hardcode hex values in components or SCSS — use the token system only
- ❌ Never use color alone to convey state — pair with icons or text labels

### Shadow System

| Token                | Value                          | Usage             |
| -------------------- | ------------------------------ | ----------------- |
| `$shadow-sm`         | 0 1px 2px rgba(0,0,0,0.05)     | Small UI elements |
| `$shadow-md`         | 0 2px 8px rgba(0,0,0,0.06)     | Medium elevation  |
| `$shadow-lg`         | 0 4px 16px rgba(0,0,0,0.08)    | High elevation    |
| `$shadow-card`       | 0 2px 8px rgba(0,0,0,0.06)     | Card components   |
| `$shadow-card-hover` | 0 4px 16px rgba(0,87,194,0.12) | Card hover state  |

### Extended Palette

| Token                | Value              | Usage                     |
| -------------------- | ------------------ | ------------------------- |
| **Primary**          | #0057c2            | Interactive elements      |
| **Surface White**    | #ffffff            | Card backgrounds          |
| **Surface Light**    | #f9f9f9            | Page backgrounds          |
| **Surface Base**     | #eeeeee            | Borders, dividers         |
| **Surface Dark**     | #1a1a1a            | Inverted sections (CTA)   |
| **Text Primary**     | #1a1a1a            | Headlines, body           |
| **Text Secondary**   | #666666            | Captions, metadata        |
| **Text on Dark**     | #f0f0f0            | Text on dark backgrounds  |
| **Border Light**     | #d0d0d0            | Light borders             |
| **Border Medium**    | #b0b0b0            | Medium borders            |
| **Border Subtle**    | rgba(0,0,0,0.06)   | Subtle borders            |
| **Hover Overlay**    | rgba(0,0,0,0.04)   | Hover state backgrounds   |
| **Primary BG Light** | rgba(0,87,194,0.1) | Primary color backgrounds |
| **Success Base**     | #52c41a            | Semantic success color    |

---

## 3. Typography

The UI uses the existing **Inter** font stack with system-font fallbacks. No secondary typeface or font dependency is introduced.

### Type Scale

| Level          | Size            | Weight | Line Height | Letter Spacing | Usage                                          |
| -------------- | --------------- | ------ | ----------- | -------------- | ---------------------------------------------- |
| **H1**         | 2rem (32px)     | 700    | 1.25        | normal         | Page titles — Dashboard, Backlog, Settings     |
| **H2**         | 1.5rem (24px)   | 600    | 1.3         | normal         | Section headings within a page                 |
| **H3**         | 1.125rem (18px) | 600    | 1.4         | normal         | Card titles, panel headers                     |
| **Body MD**    | 1rem (16px)     | 400    | 1.5         | normal         | Paragraphs, table cells, inputs, button labels |
| **Body SM**    | 0.875rem (14px) | 400    | 1.5         | normal         | Metadata, captions, secondary info, help text  |
| **Label Caps** | 0.75rem (12px)  | 600    | 1.5         | 0.05em         | Column headers, filter labels, section labels  |
| **Code**       | 0.875rem (14px) | 400    | 1.5         | normal         | Code snippets, technical IDs                   |

### Typography Rules

- ✅ Use Ant Design `Typography.Title` for H1-H3, `Typography.Text` for body, `Typography.Paragraph` for prose
- ✅ Prefer sentence-case labels; reserve uppercase styling for compact metadata where it improves scanning.
- ✅ Line heights are set and should not be overridden per component
- ❌ Never use more than 2 type sizes on a single card
- ❌ Never use font weights below 400 for body text (keeps readability high)
- ❌ Never change font-family from Inter except for code blocks
- ✅ Public display titles use fluid sizes between 32px and 48px. Workspace titles use 28–32px; supporting copy uses 14–16px.

### Font Loading

Inter is the preferred font in the CSS stack. When unavailable, the browser uses:

```
-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
```

---

## 4. Spacing

Spacing follows a 4px grid with 7 tiers. Use SCSS variables, never raw values.

### Spacing Scale

| Token          | rem     | px   | Typical Usage                          |
| -------------- | ------- | ---- | -------------------------------------- |
| `$spacing-xs`  | 0.25rem | 4px  | Icon gaps, compact layouts             |
| `$spacing-sm`  | 0.5rem  | 8px  | Button groups, inline spacing          |
| `$spacing-md`  | 1rem    | 16px | Form fields, card padding              |
| `$spacing-lg`  | 1.5rem  | 24px | Section spacing, card internal padding |
| `$spacing-xl`  | 2rem    | 32px | Page section separation                |
| `$spacing-2xl` | 3rem    | 48px | Public form vertical spacing           |
| `$spacing-3xl` | 4rem    | 64px | Hero sections, major page dividers     |

### Spacing Rules

- ✅ Use the 7-tier scale — never 6px, 10px, 14px, 20px, 36px, etc.
- ✅ Derive all padding and margin from the scale
- ✅ Prefer rem values for spacing (accessibility — respects user font size)
- ❌ Never use arbitrary px or em values outside the scale
- ❌ Never use negative margins for layout positioning

---

## 5. Layout

### Page Structure

Workspace layout follows a **left sidebar + flexible content** pattern at 1024px and above. Below 1024px, a header menu button opens an Ant Design Drawer with the same destinations and role permissions.

```
┌──────────────┬──────────────────────────────────────┐
│              │                                      │
│   Sider      │          Content Area                │
│   240px      │    (shell fills viewport)               │
│   ↓ 80px     │                                      │
│   collapsed   │    Page Title Row                    │
│              │    ─────────────────────              │
│   Logo       │    Content Sections                   │
│   Nav Menu   │    (Tabs, Tables, Forms, Cards)       │
│   User       │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

### Content Padding

| Breakpoint        | Padding                        |
| ----------------- | ------------------------------ |
| ≥1024px (desktop) | 32px                           |
| 481–1023px        | 24px                           |
| ≤480px (mobile)   | 16px horizontal, 24px vertical |

The workspace shell owns page gutters; feature pages do not add a second outer padding layer. Public sections use a maximum width of 1280px, with 16px mobile, 24px tablet and 32px desktop gutters. PublicLayout owns the single main landmark and footer.

### Sider

| State     | Width | Behavior                            |
| --------- | ----- | ----------------------------------- |
| Expanded  | 240px | Default on desktop                  |
| Collapsed | 80px  | Toggle button, shows icons only     |
| Hidden    | —     | Mobile (replaced by hamburger menu) |

### Layout Rules

- ✅ Keep horizontal scrolling inside dense tables; the page itself must fit the viewport.
- ✅ Feature pages compose vertically: title → content sections (tabs, tables, forms, stat cards)
- ✅ Use Ant Design `Layout`, `Layout.Sider`, `Layout.Content` for structural layout
- ✅ Use Ant Design grids or CSS Grid as appropriate; project grids must fit the available content width.
- ✅ Mobile refinement uses normal page scrolling; avoid nested viewport-height panes.

---

## 6. Elevation & Depth

The UI uses minimal elevation — flat design with subtle shadow cues.

| Element              | Shadow             | Usage                                    |
| -------------------- | ------------------ | ---------------------------------------- |
| Cards                | None               | Borders distinguish records and forms    |
| Sider                | None               | Border separates navigation from content |
| Modals               | Default Ant Design | 16px blur at 0.15 opacity                |
| Dropdowns            | Default Ant Design | Mathches Ant Design elevation            |
| No persistent floats | —                  | No FABs, no sticky headers beyond sider  |

### Elevation Rules

- ✅ Keep record cards and forms flat; use grouping and borders for hierarchy.
- ✅ Reserve shadows for elevated overlays such as modals and dropdowns.
- ❌ Never use box-shadow with blur > 8px for surface elements
- ❌ Never add shadows to buttons, inputs, or menu items
- ❌ Never use multiple shadow layers on cards

---

## 7. Shapes (Border Radius)

Controls use 8px radii and containers use 12px. Existing SM/MD/LG token names are retained; MD and LG resolve to the same container radius.

| Tier | Value               | Applied To                                               |
| ---- | ------------------- | -------------------------------------------------------- |
| SM   | 8px (`$radius-sm`)  | Buttons, inputs, menu items, table rows, tags, dropdowns |
| MD   | 12px (`$radius-md`) | Larger containers, stat cards, filter panels, alerts     |
| LG   | 12px (`$radius-lg`) | Card components, modals, form sections                   |

### Radius Rules

- ✅ All corners in a single component use the same radius (no mixed treatments)
- ✅ Ant Design global `borderRadius: 8` with `borderRadiusLG: 12` covers most cases
- ✅ Card radius uses LG (12px) via component token override
- ❌ Never use pill-shaped radii (border-radius ≥ component height)
- ❌ Never set individual `border-top-left-radius` etc. — always use shorthand

---

## 8. Components

### 8.1 Buttons

| Property   | Primary           | Default             | Text                | Link          |
| ---------- | ----------------- | ------------------- | ------------------- | ------------- |
| Background | Primary (#0057c2) | Transparent         | Transparent         | Transparent   |
| Text       | White             | Text Primary        | Primary             | Primary       |
| Border     | None              | Surface Base        | None                | None          |
| Radius     | SM (8px)          | SM (8px)            | SM (8px)            | None          |
| Padding    | 12px 16px         | 12px 16px           | 8px 12px            | —             |
| Font       | Body MD (600)     | Body MD (400)       | Body MD (400)       | Body MD (400) |
| Hover BG   | Primary Dark      | rgba(0,87,194,0.04) | rgba(0,87,194,0.04) | —             |
| Hover Text | White             | Primary             | Primary             | Primary       |
| Shadow     | None              | None                | None                | None          |

- ✅ Primary buttons for main CTAs — one per view maximum
- ✅ Default buttons for secondary actions
- ✅ Text buttons for tertiary actions (cancel, skip)
- ✅ Link buttons for navigation-like actions
- ✅ Full width on mobile; inline on desktop
- ❌ Never use dashed or danger buttons without design approval
- ❌ Never disable text-only buttons — disable primary and default only

### 8.2 Cards

| Property         | Value                            |
| ---------------- | -------------------------------- |
| Background       | White (#ffffff)                  |
| Radius           | LG (12px)                        |
| Border           | 1px solid Surface Base (#eeeeee) |
| Shadow           | None                             |
| Internal Padding | 24px (Ant Design default)        |

- ✅ Use Ant Design `Card` component with `variant="outlined"`
- ✅ Cards separate content groupings on Surface Light pages
- ❌ Never nest cards inside other cards
- ❌ Never change card border radius per instance
- ❌ Never remove card borders (unless specifically required by design)

### 8.3 Forms

| Property      | Value                                                |
| ------------- | ---------------------------------------------------- |
| Label         | Body MD (400), Text Primary                          |
| Input BG      | White (#ffffff)                                      |
| Input Border  | 1px solid Surface Base (#eeeeee)                     |
| Input Radius  | SM (8px)                                             |
| Input Focus   | Border Primary (#0057c2)                             |
| Input Padding | 8px 12px                                             |
| Error         | Red border + helper text below field                 |
| Required      | Red asterisk via Ant Design `labelRequiredMarkColor` |

See [Form Standards](#12-form-standards) for detailed UX requirements.

### 8.4 Tables

| Property    | Value                                |
| ----------- | ------------------------------------ |
| Header BG   | Surface Light (#f9f9f9)              |
| Header Text | Text Secondary (#666666), Label Caps |
| Row Hover   | rgba(0, 87, 194, 0.02)               |
| Row Radius  | SM (8px)                             |
| Border      | 1px solid Surface Base               |

- ✅ Use Ant Design `Table` component
- ✅ Pagination below table, right-aligned
- ✅ Sortable columns use Ant Design's built-in sorters
- ❌ Never use custom table implementations
- ❌ Never disable row hover

### 8.5 Navigation (Menu)

| State    | Background                     | Text                     |
| -------- | ------------------------------ | ------------------------ |
| Default  | Transparent                    | Text Secondary (#666666) |
| Hover    | rgba(0, 87, 194, 0.04)         | Primary (#0057c2)        |
| Selected | rgba(0, 87, 194, 0.1) gradient | Primary (#0057c2)        |

- Height: 40px
- Radius: SM (8px)
- Margin inline: 8px
- Icons: 16-18px, matching text color

### 8.6 Modals

| Property | Value                                   |
| -------- | --------------------------------------- |
| Radius   | LG (12px)                               |
| Padding  | 24px horizontal                         |
| Header   | None or minimal (use title prop)        |
| Footer   | Right-aligned primary + default buttons |

- ✅ Use Ant Design `Modal` — never custom modal implementations
- ✅ Destroy on close to reset form state
- ❌ Never use modals wider than 720px

### 8.7 Tags & Badges

- ✅ Use Ant Design `Tag` component
- ✅ Radius: SM (8px)
- ✅ Semantic colors via Ant Design preset colors (`success`, `processing`, `error`, `warning`)
- ✅ Use `color` prop from predefined set — never custom hex

### 8.8 Alerts & Notifications

| Type         | Ant Design Component | Usage                                   |
| ------------ | -------------------- | --------------------------------------- |
| Page-level   | `Alert`              | Form errors, success messages, warnings |
| Toast        | `message` hook       | Quick success/error confirmations       |
| Confirmation | `Modal.confirm`      | Destructive action confirmations        |

- ✅ `Alert` radius: MD (12px)
- ✅ `Alert` padding: 16px 24px (with description)
- ❌ Never use toast notifications for critical errors — use page-level Alerts
- ❌ Never show more than one notification at a time

---

## 9. Navigation Patterns

### Desktop Navigation (≥768px)

- Left sider (240px) with Ant Design `Menu` in `inline` mode
- Active section highlighted with primary bg tint
- Menu groups with section labels (Label Caps)
- Collapse to icon-only at 80px

### Mobile Navigation (<768px)

- Sider hidden by default
- Hamburger icon in top app bar (if present) or as floating toggle
- Full-width overlay drawer when open
- Menu items larger touch targets (48px height minimum)
- Close on route change

### Breadcrumbs

- ✅ Use Ant Design `Breadcrumb` for pages 2+ levels deep
- ✅ Located above page title
- ✅ Current page is last item — not a link

### Tabs

- ✅ Use Ant Design `Tabs` for same-page content switching
- ✅ No custom tab styling — use Ant Design defaults with primary accent
- ❌ Never use tabs for navigation between routes (use the menu)

---

## 10. Responsive Breakpoints

| Name       | Width       | Target                               |
| ---------- | ----------- | ------------------------------------ |
| Mobile     | <480px      | Phones                               |
| Tablet     | 480-768px   | Large phones, small tablets          |
| Desktop    | 768-1024px  | Tablets in landscape, small desktops |
| Wide       | 1024-1280px | Standard desktops                    |
| Ultra-wide | >1280px     | Large monitors                       |

### Responsive Rules

- ✅ Every page must be functional at 320px width minimum
- ✅ Every page must be functional at 1440px+ width
- ✅ Use CSS media queries in SCSS modules with variable breakpoints
- ✅ Tables → stacked card layout on mobile
- ✅ Forms → single column on mobile
- ✅ Cards → 1 column mobile, 2 tablet, 3+ desktop
- ❌ Never use horizontal scroll on body
- ❌ Never hide content behind hover-only interactions
- ❌ Never use `position: fixed` on mobile without careful testing

### Responsive Padding Collapse

```
Desktop (≥1024px):  padding: 48px
Tablet (768-1023px): padding: 24px
Mobile (<768px):     padding: 16px
```

---

## 11. Accessibility Standards

### Target: WCAG AA

All interfaces must meet WCAG 2.1 Level AA compliance.

### Contrast

- Normal text: 4.5:1 minimum contrast ratio
- Large text (18px/14px bold): 3:1 minimum
- UI components (borders, icons): 3:1 minimum
- Placeholder text: May fall below 4.5:1 but must be ≥3:1

### Focus

- All interactive elements must have visible focus indicators
- Use Ant Design's built-in focus rings (primary blue outline)
- Never use `outline: none` without providing an alternative focus style
- Custom components must implement focus management (tabIndex, onKeyDown)

### Keyboard Navigation

- All functionality must be reachable via keyboard
- Tab order must follow visual order
- No keyboard traps (focus must leave modals, drawers, menus)
- Escape key closes modals, drawers, dropdowns (Ant Design provides this)

### Labels

- All form inputs must have associated labels (Ant Design `Form.Item` + `label` prop)
- Icon-only buttons must have `aria-label` or tooltip
- Use semantic HTML: `<nav>`, `<main>`, `<header>`, `<footer>`, `<button>`, `<a>`

### Screen Reader Support

- Use Ant Design's built-in ARIA attributes
- Dynamic content updates should use `aria-live` regions
- Loading states should announce to screen readers
- Error messages must be programmatically associated with inputs

### Reduced Motion

- ✅ The `animations.scss` file already includes `@media (prefers-reduced-motion: reduce)`
- ✅ All new animations must respect this preference
- ✅ Use CSS transitions instead of JavaScript animations where possible

---

## 12. Form Standards

### Labeling

- Every field must have a visible label (use Ant Design `Form.Item` `label`)
- Labels are Body MD (400), Text Primary
- Required fields marked with red asterisk (Ant Design's `labelRequiredMarkColor`)
- Optional fields clearly noted

### Validation & Errors

| Aspect        | Behavior                                                      |
| ------------- | ------------------------------------------------------------- |
| Timing        | Validate on field blur + form submit (not on every keystroke) |
| Inline errors | Red text below field. Ant Design `status="error"`             |
| Summary       | Page-level `Alert` description for critical form errors       |
| Success       | Toast (`message.success`) for successful submission           |

### Error Messages

- Seen from user perspective, not technical: "Enter a valid email" not "Invalid format"
- Specific: "Password must be at least 8 characters" not "Invalid password"
- Helpful: include suggestions when possible

### Helper Text

- Use Ant Design `Form.Item` `help` prop for contextual guidance
- Helper text is Body SM, Text Secondary
- Place below the input, not above

### Form Width

- Forms should not exceed 480px width for optimal readability (unless data-dense)
- Full-width forms (profile, settings) may use the full content area
- In modals, forms match modal width with standard padding

### Submit Buttons

- Primary button for submit, aligned right
- Default button for cancel (left of submit)
- Disable submit during processing (show loading spinner via Ant Design `loading` prop)

---

## 13. Empty States

### No Data Yet

For features with no records (new user, fresh database):

- Use Ant Design `Empty` component with custom description
- Include a call-to-action when applicable ("Create your first project")
- Illustration should be informative, not decorative

### No Search Results

- Ant Design `Empty` with "No results for [query]"
- Suggest actions: clear filters, adjust search terms

### First-Time Users

- Welcome panel or guided tour for complex features
- Avoid overwhelming the user with too many empty states at once
- Dashboard should show meaningful content or a getting-started CTA

---

## 14. Loading States

### Page Load

- Use Ant Design `Spin` with content height 400px for initial page loads
- Full-page spinner only during auth checks or critical data fetches

### Component Load

- Use Ant Design `Skeleton` for card lists, tables, and detail panels
- Match skeleton shape to content shape (Skeleton.Input, Skeleton.Button, Skeleton.Avatar)

### Button Loading

- Use Ant Design button `loading` prop during mutations
- Prevent double-submission while loading

### Table Loading

- Use Ant Design Table `loading` prop with spinner overlay

### Rules

- ✅ Every data-fetching view must have loading state
- ✅ Skeletons preferred over spinners for recognizable content shapes
- ✅ Loading states must show within 200ms of trigger
- ❌ Never show multiple loading indicators simultaneously
- ❌ Never use custom spinner components — use Ant Design Spin only

---

## 15. Error States

### Page-Level Errors

- Use Ant Design `Result` component with appropriate status (`error`, `403`, `404`, `500`)
- Include actionable recovery: "Go back", "Retry", "Contact support"
- Located inside the content area (not full-screen)

### API Errors

- Use the centralized `handleApiError` utility from `shared/utils/error-handler.ts`
- Toast for non-critical errors (update failure)
- Page Alert for critical errors (load failure)
- Never show raw API error messages to users

### Network Offline

- Ant Design `Alert` banner at the top of the app when offline
- Auto-dismiss when connection restores

### 404 (Not Found)

- Ant Design `Result` with status="404"
- "Go to Home" button
- No custom 404 illustration

### 403 (Forbidden)

- Use `shared/pages/unauthorized/` component
- Explanation of what the user needs (role access)
- "Go to Home" or "Contact Admin" action

---

## 16. Animations & Transitions

### Available Animations (from `styles/animations.scss`)

| Class                     | Effect                 | Usage                         |
| ------------------------- | ---------------------- | ----------------------------- |
| `.animate-fade-in-up`     | Fade + 30px translateY | Page entries, section reveals |
| `.animate-fade-in`        | Opacity fade           | Subtle reveals                |
| `.animate-slide-in-left`  | Slide from left        | Side panels                   |
| `.animate-slide-in-right` | Slide from right       | Drawer content                |
| `.animate-scale-in`       | Scale from 0.95        | Modal-like entries            |

### Delay Utility Classes

| Class        | Delay |
| ------------ | ----- |
| `.delay-100` | 0.1s  |
| `.delay-200` | 0.2s  |
| `.delay-300` | 0.3s  |
| `.delay-400` | 0.4s  |
| `.delay-500` | 0.5s  |

### Animation Rules

- ✅ Use CSS animations from `animations.scss` — never write per-component animations
- ✅ Duration: 600ms for entrances, 150ms for micro-interactions (hover, focus)
- ✅ Apply reduced-motion support (already built into `animations.scss`)
- ✅ Stagger delays for multi-element reveals (100ms steps, max 5 items)
- ❌ Never use animation for critical information (accessibility)
- ❌ Never use bounce, shake, or flash animations
- ❌ Never animate layout properties (width, height, top, left) — causes layout shifts

---

## 17. Do's and Don'ts

### ✅ Do

- Use the primary blue (#0057c2) for all interactive elements — buttons, links, selected states, focus indicators
- Use Surface Light (#f9f9f9) as the page background — it separates content areas from cards
- Use restrained 12px radii and borders on record cards; present statistics and filters without extra boxes.
- Use the 4px spacing scale consistently — never freehand spacing values
- Use Ant Design components over custom HTML elements
- Write CSS Modules for page/component-specific styles only
- Add `aria-label` to icon-only buttons and links
- Check layouts at 375px, 430px, 768px, 1280px and 1440px, including keyboard and reduced-motion behavior.
- Show loading skeletons for recognizable content patterns
- Show empty states with CTAs for zero-data scenarios
- Use the centralized error handler for API error messages
- Pair color with icons/text for state indicators

### ❌ Don't

- Add additional colors to the palette — one primary is sufficient
- Use box-shadows heavier than 8px blur — the design is intentionally flat
- Use more than two type sizes on a single card — hierarchies should stay simple
- Override Ant Design component radii inconsistently — use the control/container tokens (8/12)
- Hardcode colors, spacing, or radius values in components — use the token system
- Create custom modals, tables, or form components — Ant Design provides them
- Disable focus outlines without providing alternatives
- Use horizontal scrolling on body or page-level containers
- Nest cards inside cards
- Use bounce, shake, flash, or layout-shifting animations
- Show technical error messages to users
- Use custom spinner components when `Spin` exists

---

## 18. Design Token Reference

All design tokens are defined in three synchronized locations:

| Location                        | Purpose                                                         |
| ------------------------------- | --------------------------------------------------------------- |
| `src/styles/variables.scss`     | SCSS variables for CSS Modules (links to CSS custom properties) |
| `src/styles/global.scss`        | CSS custom properties on `:root`                                |
| `src/app/theme/theme-tokens.ts` | Ant Design ThemeConfig for ConfigProvider (light)               |
| `DESIGN.md`                     | Single source of truth documentation                            |

### Rules for Token Management

- ✅ When changing a design token, update ALL four locations
- ✅ SCSS variables use the `$prefix` naming convention (`$primary-base`, `$spacing-md`)
- ✅ CSS custom properties use `--color-`, `--spacing-`, `--radius-` prefix
- ✅ Ant Design tokens use standard Ant Design token names
- ❌ Never add a token without documenting it in this file first
- ❌ Never reference raw CSS custom properties in component code — use SCSS variables

---

## 19. SCSS Architecture

### File Organization

```
src/styles/
├── variables.scss      # SCSS variables mapping to CSS custom properties
├── global.scss         # CSS custom properties, base element resets
└── animations.scss     # Keyframe animations + utility classes
```

### Component/Page Styles

- Each component gets a `.module.scss` file in its own directory
- Each page gets a `.module.scss` file in the page directory
- Import with `@use "@/styles/variables.scss" as *;`
- Use `.module.scss` extension for CSS Modules (automatic scoping)
- No global class names except in `global.scss` and `animations.scss`

### Naming Convention

- SCSS class names: kebab-case (`.page-container`, `.card-title`, `.form-section`)
- Modifier classes: kebab-case with double-hyphen (`.button--primary`, `.card--compact`)
- State classes: kebab-case with is-/has- prefix (`.is-active`, `.has-error`, `.is-loading`)
- No BEM — CSS Modules provide scoping, simple kebab-case is sufficient

---

## 20. Performance Guidelines

### CSS Performance

- ✅ Minimize nesting depth (max 4 levels)
- ✅ Avoid `@extend` — use mixins or compose classes
- ✅ Avoid expensive selectors (`~`, `+`, `*`, `:not()` with complex args)
- ✅ Use `content-visibility: auto` for off-screen sections on long pages

### Render Performance

- ✅ Use React.lazy for route-level code splitting (already configured)
- ✅ Memoize expensive components with `React.memo`
- ✅ Debounce search inputs and filter changes
- ❌ Never use inline styles for layout — CSS Modules only

### Bundle Size

- ✅ Tree-shake Ant Design imports — import from `antd` directly (Vite handles this)
- ✅ Lazy-load route components (already configured in `lazy-loader.ts`)
- ❌ Never import entire Ant Design icons (`@ant-design/icons` — tree-shake at component level)

---

## 21. File & Folder Conventions

### Component File Structure

```
<component-name>/
├── ComponentName.tsx
├── component-name.module.scss
└── index.ts
```

### Page File Structure

```
<pages/page-name>/
├── index.tsx
└── page-name.module.scss
```

### Naming

- Component files: PascalCase (`ProjectForm.tsx`, `DashboardStats.tsx`)
- Hooks: kebab-case prefix with `use-` (`use-projects-overview.ts`)
- SCSS modules: kebab-case matching component file (`project-form.module.scss`)
- Directories: kebab-case (`edit-project-modal/`, `project-form/`)

### Import Convention

```typescript
// Component imports — use index.ts barrel
import { ProjectForm } from "@/features/projects/components/project-form";

// Third-party
import { Button, Card, Form, Input } from "antd";

// Hooks
import { useProjectsOverview } from "@/features/projects/hooks/use-projects-overview";
```

---

## 22. Changelog

| Date    | Change                                                                                                                                                                                                                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2025-01 | Initial design system                                                                                                                                                                                                                                                                |
| 2026-05 | Major revision: added form standards, empty/loading/error states, accessibility requirements, responsive guidelines, animation rules, semantic colors, navigation patterns, performance guidelines, and design token management. Standardized file structure and naming conventions. |
| 2026-07 | Removed dark theme. Application now supports light theme only. Deleted theme toggle, `useActiveTheme` hook, `darkTokens`, dark CSS variables, dark favicon, and pre-hydration favicon init script.                                                                                   |
