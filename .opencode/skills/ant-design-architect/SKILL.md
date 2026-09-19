# Ant Design Architect Skill

## Purpose

Ensure proper use of Ant Design components and conventions in Open Projects Hub — a React 19 + Ant Design v6 + TypeScript application.

## When to Use

Use this skill when:

- Building new UI components or pages
- Reviewing existing component implementations
- Deciding between custom and Ant Design approaches
- Refactoring custom code into Ant Design patterns

## Responsibilities

### 1. Layout Components

Review usage of:

- `Layout`, `Layout.Sider`, `Layout.Content`, `Layout.Header`, `Layout.Footer`
- `Grid` (`Row`, `Col`) for responsive layouts
- `Space` for consistent spacing between inline elements
- `Divider` for visual section separation

**Check**: Are custom layout implementations replacing Ant Design Layout? They should not be.

### 2. Menu

Review usage of:

- `Menu` component with `mode="inline"` for sider navigation
- `Menu.Item` for nav items, `Menu.SubMenu` for groups
- `Menu.ItemGroup` for section labels
- Icons from `@ant-design/icons` for menu items

**Check**: Is the sider using Ant Design `Menu` or a custom implementation?

### 3. Typography

Review usage of:

- `Typography.Title` for headings (level 1-5)
- `Typography.Text` for inline text, body, labels
- `Typography.Paragraph` for prose content
- `Typography.Text code` for code snippets

**Check**: Are raw `<h1>`, `<p>`, `<span>` tags used when `Typography` components should be?

### 4. Button

Review usage of:

- `Button type="primary"` for primary CTAs (max 1 per view)
- `Button` (default) for secondary actions
- `Button type="text"` for tertiary actions
- `Button type="link"` for navigation-like actions
- `Button danger` for destructive actions
- `Button loading` during async operations
- `Button icon` for icon-only buttons (with `aria-label`)
- `Button size="large"`, `"middle"`, `"small"` appropriately

**Check**: Are custom button-like elements (divs with onClick) used instead of Button?

### 5. Form

Review usage of:

- `Form`, `Form.Item`, `Form.List`
- Validation via `rules` prop (not custom validation logic)
- `label` prop on `Form.Item` for labels
- `name` prop for field management
- `status="error"` for inline error display
- `help` prop for helper text
- `Form.Item` with `noStyle` for inline layouts
- `Form.useForm` for form instance control

**Check**: Are there custom form validation patterns that Ant Design Forms could replace?

### 6. Input

Review usage of:

- `Input` for text/email/password fields
- `Input.TextArea` for multi-line text
- `Input.Password` for password fields (with visibility toggle)
- `Input.Search` for search fields
- `InputNumber` for numeric inputs
- `Select` for dropdowns
- `DatePicker` for date selection
- `Switch` for boolean toggles
- `Checkbox`, `Radio` for selection

**Check**: Are custom input-like elements replacing Ant Design Input components?

### 7. Card

Review usage of:

- `Card` with `variant="outlined"` for content containers
- `Card` `title` prop for card headers
- `Card.Grid` for dashboard-style card grids
- `Card.Meta` for card with avatar + title + description

**Check**: Are custom card-like divs replacing Ant Design Card?

### 8. Modal & Drawer

Review usage of:

- `Modal` for confirmations, forms in overlay
- `Modal.confirm`, `Modal.info`, `Modal.error`, `Modal.success`, `Modal.warning`
- `Drawer` for side panels with form content
- `destroyOnClose` for modal form reset
- Proper `width` constraints (max 720px for modals)

**Check**: Are custom modal/drawer implementations replacing Ant Design Modal/Drawer?

### 9. Table

Review usage of:

- `Table` for data grids — never custom table HTML
- `columns` prop for column definitions
- `dataSource` with unique `rowKey`
- `pagination` prop (Ant Design handles this)
- `onChange` for sort/filter/paginate
- `loading` prop for loading state
- `expandable` rows for detail expansion
- `custom` render functions for cell formatting

**Check**: Are custom table HTML implementations used instead of Ant Design Table?

### 10. Feedback Components

Review usage of:

- `Alert` for page-level messages (error, success, warning, info)
- `message` hook for toast notifications
- `notification` hook for richer notifications
- `Spin` for loading indicators
- `Skeleton` for content placeholder loading
- `Result` for full-page status (404, 403, 500, success)
- `Progress` for progress indication
- `Empty` for zero-data states
- `Tag` for labels and status indicators
- `Badge` for notification counts

### 11. Navigation Components

Review usage of:

- `Breadcrumb` for breadcrumb trails
- `Tabs` for same-page content switching
- `Steps` for multi-step workflows
- `Pagination` for page navigation (Ant Design Table provides this)
- `Dropdown` for context menus and action lists
- `Popover` for lightweight tooltips/help
- `Tooltip` for element descriptions

### 12. Common Ant Design Patterns to Check

| Pattern              | Ant Design Approach                  | Common Mistake                    |
| -------------------- | ------------------------------------ | --------------------------------- |
| Page header          | `Typography.Title` + `Breadcrumb`    | Raw `<h1>` with manual breadcrumb |
| Search + filter bar  | `Input.Search` + `Select` + `Button` | Custom filter UI                  |
| Action confirmations | `Modal.confirm`                      | Custom confirm dialog             |
| Loading list         | `Skeleton` + `Card`                  | Custom spinner                    |
| Empty data           | `Empty` component                    | Manual "No data" text             |
| Status display       | `Tag` with color prop                | Styled `<span>`                   |
| Form layout          | `Form` + `Row`/`Col` for responsive  | CSS Grid form layouts             |

## Output Format

```markdown
## Ant Design Architecture Review

**Architecture Score: X/10**

### Finding Summary

- Ant Design components used correctly: X/Y
- Custom component replacements found: X
- Unnecessary custom CSS for Ant Design: X cases
- Missed Ant Design opportunities: X

### Reinvented Components

| Component | Custom Location | Ant Design Replacement | Effort |
| --------- | --------------- | ---------------------- | ------ |
| Modal     | `src/...`       | `Modal`                | Low    |
| ...       |                 |                        |        |

### Unnecessary Custom Code

1. **File** — Custom [thing] — Ant Design [component] provides this — Recommendation

### Missed Opportunities

1. **File** — Could use [Ant Design component] instead of custom [approach] — Benefit

### Recommendations

1. Replace custom modal with Ant Design Modal
2. Add Skeleton loading to [page]
3. Use Typography.Title for page headings instead of raw HTML

### Quick Wins

1. **File:line** — Replace `<h1>` with `Typography.Title`
2. **File:line** — Add `loading` prop to Table
```
