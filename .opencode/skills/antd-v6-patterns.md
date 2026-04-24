# Ant Design v6 Patterns

## Goal

Keep generated UI aligned with modern Ant Design APIs and avoid deprecated usage.

## Usage Principle

Use Ant Design for behavior and structure.
Use semantic HTML and SCSS Modules for branding, storytelling, and custom visual identity.

## Rules

1. Prefer current documented props and patterns.
2. Do not introduce deprecated component props.
3. Update older snippets to v6-compatible equivalents before reusing them.

## Use Ant Design For

1. Forms and validation
   - `Form`
   - `Input`, `Select`, `DatePicker`
   - `Form.Item` validation
2. Data display and CRUD flows
   - `Table`
   - `Pagination`
   - `Tag`
   - `Badge`
3. Overlays and state-driven interactions
   - `Modal`
   - `Drawer`
   - `Popconfirm`
   - `notification`, `message`
4. Admin and internal application layout
   - `Layout`
   - `Menu`
   - `Breadcrumb`
   - `Tabs`

## Prefer HTML and SCSS For

1. Marketing and content sections
2. Static informational pages
3. Highly custom branded UI elements

## Mixed Approach

Mixing Ant Design with semantic HTML is encouraged.

Good default:

1. Use custom section layout and semantic markup for page composition
2. Use Ant Design for buttons, typography, forms, tables, and interaction-heavy controls
3. Use SCSS Modules for spacing, branding, and layout styling

## Known Preference Examples

1. Use `variant="outlined"` instead of deprecated `bordered` where applicable.
2. Avoid old layout or spacing APIs when the current component set offers a better alternative.
3. Keep styling in SCSS Modules instead of pushing visual decisions into component props unless it is truly component state.

## Anti-Patterns

1. Do not use Ant Design for purely static content by default.
2. Do not wrap everything in `Card` automatically.
3. Do not manually rebuild Ant Design form validation for standard forms.
4. Do not deeply override Ant Design internal CSS classes unless absolutely necessary.
5. Do not use Ant Design only to make marketing pages look superficially consistent.

## Decision Checklist

Before using Ant Design, ask:

1. Is this data-driven or CRUD-related?
2. Does it need validation, state handling, or accessibility behavior?
3. Would Ant Design reduce custom logic or styling effort?

If two or more answers are yes, prefer Ant Design.
Otherwise, prefer semantic HTML and SCSS Modules.

## Wrapper Components Strategy

When repeated Ant Design usage appears across admin or internal features, prefer thin shared wrappers such as:

```text
src/components/ui/
  AppButton.tsx
  AppForm.tsx
  AppModal.tsx
  AppTable.tsx
```

Rules:

1. Wrap Ant Design, do not reimplement it.
2. Centralize shared props and styling in the wrapper.
3. Reuse wrappers across admin and internal tools when it improves consistency.

## Workflow

Before adding a new Ant Design prop or pattern:

1. Check whether the prop is deprecated.
2. Prefer the current API shape.
3. Confirm Ant Design is the right tool for the UI being built.
4. Keep the resulting JSX simple and readable.

## Review Checklist

1. No deprecated props introduced
2. No unnecessary inline styling used to fight library defaults
3. Ant Design components remain easy to upgrade later
4. Ant Design is used intentionally for interactive or data-heavy UI
5. Marketing and content sections are not over-engineered with Ant Design
