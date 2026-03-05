# React UI Development

## Description

This skill focuses on building reusable and accessible React components using Ant Design and best practices.

### Capabilities

1. **Component Creation**:
   - Develop modular and reusable components inside `src/features/<feature>/components/<ComponentName>/`.
   - Each component MUST have: `ComponentName.tsx` (named export), `ComponentName.module.scss`, and `index.ts`.
   - Use Ant Design components heavily (`Typography`, `Layout`, `Skeleton`, `Row`, `Col`, etc.).
   - Pages (`src/pages`) only act as high-level layout containers for feature components.

2. **Accessibility**:
   - Ensure WCAG compliance.
   - Use semantic tags and `aria-*` attributes for screen readers.

3. **Styling**:
   - Strictly use SCSS Modules (`.module.scss`) for custom styling. Do not use standard `.css` files.
   - Apply styles using `className={styles["class-name"]}`.
   - Use Ant Design’s grid system (`xs`, `sm`, `md`, `lg`) and override with SCSS media queries when needed.

4. **Loading & Error Handling**:
   - Implement `isLoading` (using `<Skeleton>` or `<Spin>`) and `isError` (using `<Alert>`) gracefully in UI components reading asynchronous data.

---

This skill is essential for front-end feature creation and aligns with the repository's `AGENTS.md` guidelines.
