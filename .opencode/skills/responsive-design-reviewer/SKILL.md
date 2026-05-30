# Responsive Design Reviewer Skill

## Purpose

Verify responsive behavior across all breakpoints for Open Projects Hub — a React + TypeScript + Ant Design + CSS Modules application.

## When to Use

Use this skill when:

- Creating new pages or screens
- Modifying existing layouts
- Changing navigation patterns
- Adding new components that affect layout
- Before release QA

## Breakpoint Reference

| Name       | Width       | CSS Variable                  | Target Devices                    |
| ---------- | ----------- | ----------------------------- | --------------------------------- |
| Mobile     | <480px      | `$breakpoint-mobile: 480px`   | Phones                            |
| Tablet     | 480-768px   | `$breakpoint-tablet: 768px`   | Large phones, small tablets       |
| Desktop    | 768-1024px  | `$breakpoint-desktop: 1024px` | Landscape tablets, small desktops |
| Wide       | 1024-1280px | `$breakpoint-wide: 1280px`    | Standard desktops                 |
| Ultra-wide | >1280px     | —                             | Large monitors                    |

## Review Checklist

### 1. Navigation (All Breakpoints)

#### Mobile (<480px)

- [ ] Sider is hidden (replaced by hamburger menu or top bar)
- [ ] Menu items have 48px minimum touch target
- [ ] Hamburger opens full-width overlay drawer (Ant Design `Drawer`)
- [ ] Active route highlighted in mobile menu
- [ ] Close menu on route change
- [ ] No sticky headers that consume >15% of viewport

#### Tablet (480-768px)

- [ ] Sider can be collapsed or hidden
- [ ] Content remains readable without horizonal scroll

#### Desktop (768-1024px)

- [ ] Sider is 240px expanded or 80px collapsed
- [ ] All menu items visible without scrolling

#### Wide (1024px+)

- [ ] Full layout with all nav items visible
- [ ] Content maximized for readability

### 2. Content Padding

- [ ] ≥1024px: content padding is 48px (see layout.module.scss)
- [ ] 768-1023px: content padding is 24px
- [ ] <768px: content padding is 16px
- [ ] No content touches viewport edges

### 3. Forms

- [ ] Single column layout on mobile (<768px)
- [ ] Multi-column layout on desktop (≥768px) via Ant Design `Row`/`Col`
- [ ] Input fields are full width on mobile
- [ ] Buttons are full width on mobile
- [ ] No horizontal scroll on forms
- [ ] Labels above inputs (not inline) on mobile
- [ ] Submit + Cancel stacked vertically on mobile
- [ ] Submit + Cancel inline on desktop

### 4. Tables

- [ ] Ant Design Table horizontal scroll on narrow viewports
- [ ] Minimum column widths prevent text clipping
- [ ] First column (usually name/ID) sticks on scroll (Ant Design `fixed`)
- [ ] Pagination controls don't overflow
- [ ] Table card on mobile: consider stacked card layout for simple data

### 5. Cards & Grids

- [ ] 1 column on mobile (<480px)
- [ ] 2 columns on tablet (480-768px)
- [ ] 3+ columns on desktop (≥768px)
- [ ] Card content doesn't overflow
- [ ] Consistent card height when in grid (use `flex` or Ant Design `Row` `gutter`)

### 6. Dashboards

- [ ] Stat cards stack vertically on mobile
- [ ] Stat cards in 2x2 grid on tablet
- [ ] Stat cards in flexible row on desktop
- [ ] Charts/visualizations resize with viewport
- [ ] Data-dense components don't overflow
- [ ] Filters don't take >30% of viewport on mobile

### 7. Hero Sections (Landing/Home Page)

- [ ] Full-width background image/graphic on desktop
- [ ] Stack headline, subtitle, CTA vertically on mobile
- [ ] CTA button full width on mobile
- [ ] Text overlay doesn't overflow on any breakpoint
- [ ] No horizontal scroll on hero images

### 8. Modals & Drawers

- [ ] Modal width reduces on mobile (use Ant Design `width` prop or CSS)
- [ ] Drawer is full-width on mobile (Ant Design `Drawer` default behavior)
- [ ] Modal content doesn't overflow
- [ ] Modal form single-column on mobile
- [ ] Close button accessible on all breakpoints

### 9. General Responsive Rules

- [ ] No horizontal scroll on `<body>` at any breakpoint
- [ ] No content hidden behind hover-only interactions
- [ ] Touch targets ≥44x44px (WCAG target size)
- [ ] Font sizes don't drop below 14px on mobile
- [ ] No `position: fixed` on mobile without thorough testing
- [ ] Images and media have `max-width: 100%`
- [ ] Ant Design Grid (`Row`/`Col`) handles responsive column layout
- [ ] CSS media queries use `$breakpoint-*` variables, not raw pixel values
- [ ] Content is tested at 320px minimum width
- [ ] Content is tested at 1440px+ width

## Ant Design Responsive Helpers

Use these Ant Design features instead of custom media queries where possible:

| Pattern               | Ant Design Helper                                                |
| --------------------- | ---------------------------------------------------------------- |
| Responsive grid       | `Row`/`Col` with `xs`, `sm`, `md`, `lg`, `xl`, `xxl` breakpoints |
| Responsive space      | `Space` with `size` array: `[small, large]`                      |
| Responsive visibility | CSS media queries in SCSS modules                                |
| Responsive table      | `Table` `scroll={{ x: 'max-content' }}`                          |
| Responsive modal      | `Modal` `width` with media query override                        |
| Mobile menu           | Ant Design `Drawer` + `Menu`                                     |

## Content Padding Quick Reference

```scss
.content {
  padding: $spacing-2xl; // 48px — desktop (≥1024px)

  @media (max-width: $breakpoint-desktop) {
    // <1024px
    padding: $spacing-xl; // 24px
  }

  @media (max-width: $breakpoint-mobile) {
    // <480px
    padding: $spacing-lg; // 16px
  }
}
```

## Output Format

```markdown
## Responsive Design Review

**Score: X/10**

### Responsive Issues

| #   | Severity | Breakpoint | File  | Issue                      |
| --- | -------- | ---------- | ----- | -------------------------- |
| 1   | High     | Mobile     | `...` | Content overflows viewport |
| ... |          |            |       |                            |

### Mobile-First Recommendations

1. Start with mobile layout, enhance for desktop
2. Use Ant Design Row/Col with breakpoint props for grids
3. Stack form fields and CTAs vertically on mobile

### Breakpoint Recommendations

1. Add tablet breakpoint handling to [component]
2. Collapse sider at [breakpoint] instead of [breakpoint]
```
