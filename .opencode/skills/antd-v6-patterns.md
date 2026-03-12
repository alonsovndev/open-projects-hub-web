# Ant Design v6 Patterns

## Goal

Keep generated UI aligned with modern Ant Design APIs and avoid deprecated usage.

## Rules

1. Prefer current documented props and patterns.
2. Do not introduce deprecated component props.
3. Update older snippets to v6-compatible equivalents before reusing them.

## Known Preference Examples

1. Use `variant="outlined"` instead of deprecated `bordered` where applicable.
2. Avoid old layout or spacing APIs when the current component set offers a better alternative.
3. Keep styling in SCSS Modules instead of pushing visual decisions into component props unless it is truly component state.

## Workflow

Before adding a new Ant Design prop or pattern:

1. Check whether the prop is deprecated.
2. Prefer the current API shape.
3. Keep the resulting JSX simple and readable.

## Review Checklist

1. No deprecated props introduced
2. No unnecessary inline styling used to fight library defaults
3. Ant Design components remain easy to upgrade later
