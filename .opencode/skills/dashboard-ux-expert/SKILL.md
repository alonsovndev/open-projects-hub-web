# Dashboard UX Expert Skill

## Purpose

Improve admin panels and SaaS dashboards for Open Projects Hub.

## When to Use

Use this skill when:

- Creating or redesigning the Dashboard page
- Reviewing other admin pages (Projects, Backlog, Settings)
- Evaluating navigation and information architecture
- Assessing data density and readability

## Review Checklist

### 1. Navigation

- [ ] Dashboard is first item in sider menu
- [ ] Active route is highlighted in sider
- [ ] Navigation labels match page titles exactly
- [ ] Most frequently used items are at the top
- [ ] Menu groups have clear section labels (Label Caps)
- [ ] Sider collapses to icon-only (80px) on smaller screens
- [ ] Mobile menu via drawer overlay

### 2. Sidebars

- [ ] Sider width: 240px expanded, 80px collapsed
- [ ] No horizontal scroll in sider
- [ ] Menu item height: 40px (as per DESIGN.md)
- [ ] Menu item radius: 8px
- [ ] Icons: 16-18px, matching text color
- [ ] User section at bottom of sider
- [ ] Collapse toggle accessible

### 3. Tables

- [ ] Ant Design `Table` component used
- [ ] Header background: Surface Light (#f9f9f9)
- [ ] Header text: Label Caps (0.75rem/600/0.05em), Text Secondary
- [ ] Row hover: rgba(0, 87, 194, 0.02)
- [ ] Pagination below table, right-aligned
- [ ] Sortable columns with visual indicator
- [ ] Loading state via `loading` prop
- [ ] Empty state via Ant Design `Empty`
- [ ] Responsive horizontal scroll for wide tables
- [ ] First column fixed on scroll for reference

### 4. Search & Filters

- [ ] Search is Ant Design `Input.Search`
- [ ] Filters use Ant Design `Select`, `DatePicker`, `Input`
- [ ] Active filters clearly visible (tags or badges)
- [ ] "Clear all filters" action
- [ ] Filters collapse on mobile (show as expandable section)
- [ ] Search debounced (300ms minimum)
- [ ] Results update as filters change (not on manual submit)

### 5. Metrics & Data Visualization

- [ ] Metric cards in a grid (1 col mobile, 2 tablet, 3+ desktop)
- [ ] Card has: value (large, bold), label (Body SM, secondary), optional trend indicator
- [ ] Values formatted for readability (1,234 — not 1234)
- [ ] Loading state: Ant Design `Skeleton` matching card shape
- [ ] Error state: inline error message within card
- [ ] No more than 6 stat cards (cognitive load)
- [ ] Most important metric first (top-left scanning pattern)

### 6. Data Density

- [ ] Information-rich without visual clutter
- [ ] White space used strategically to separate content groupings
- [ ] No more than 2 type sizes on stat cards
- [ ] Labels consistently positioned (above or beside values)
- [ ] Color used sparingly for data (avoid rainbow effect)
- [ ] Tables don't show more than 10-15 columns without horizontal scroll
- [ ] Truncate long text with ellipsis, show full on hover
- [ ] Date formats consistent across all views

### 7. User Workflows (Dashboard Context)

- [ ] Dashboard shows meaningful content immediately (no blank state confusion)
- [ ] Common actions are 1 click away from dashboard
- [ ] User can navigate to full feature from dashboard stats
- [ ] Creation flows (new project) accessible from dashboard
- [ ] Recent activity/updates visible at a glance

### 8. Welcome/Panels

- [ ] First-time user: welcome panel with getting-started guide
- [ ] Returning user: immediate data, minimal onboarding noise
- [ ] Welcome panel is dismissible (persist dismissal)
- [ ] Context-sensitive help for complex dashboard features

### 9. Ant Design Dashboard Components

| Use Case          | Component                 | Notes                                       |
| ----------------- | ------------------------- | ------------------------------------------- |
| Stat cards        | `Card` + `Statistic`      | Use `Statistic` for formatted values        |
| Data grid         | `Table`                   | Always use Ant Design Table                 |
| Quick actions     | `Button` group            | Inline action buttons                       |
| Activity feed     | `List`                    | `List.Item` with `List.Item.Meta`           |
| Status indicators | `Tag` with `color` prop   | Semantic colors                             |
| Charts            | External library (future) | Not currently in scope                      |
| Welcome panel     | `Card` with illustration  | Dismissible                                 |
| Loading metrics   | `Skeleton`                | Use `Skeleton.Input` for value placeholders |

## Dashboard Hierarchy

```
Page Title (H1)
├── Welcome / Stats Row (Card + Statistic)
│   ├── Metric 1 (most important)
│   ├── Metric 2
│   └── Metric 3
├── Quick Actions Row (Buttons or Links)
├── Main Content Area
│   ├── Tabs (for content switching) or...
│   ├── Recent Projects Table
│   └── Activity / Updates List
└── Footer actions (Create New, View All, etc.)
```

## Output Format

```markdown
## Dashboard UX Expert Review

**Dashboard Usability Score: X/10**

### Critical

1. **Issue** — Location — Why it hurts productivity — Recommendation

### High

1. **Issue** — Location — Why it hurts productivity — Recommendation

### Medium

1. **Issue** — Location — Recommendation

### Low

1. **Issue** — Location — Recommendation

### Recommendations

1. Reorder metrics by importance (most critical first)
2. Add quick action buttons for common tasks
3. Use Ant Design Statistic for number formatting
4. Add loading skeletons to metric cards

### Quick Wins

1. Change stat card label position: above → below
2. Add pagination to projects table
3. Right-align numeric columns in table
```
