---
applyTo: "**"
---

# When to Use Ant Design (AntD)

This guideline defines **when to use Ant Design components** and **when to prefer custom HTML/CSS** in this repository.

The goal is to:

- Maintain a consistent UX
- Reduce unnecessary custom CSS
- Avoid over-engineering marketing/content pages
- Keep admin and data-driven features scalable

---

## Core Principle

> **Use Ant Design for behavior and structure.**  
> **Use HTML/CSS for branding and storytelling.**

AntD excels at **data-heavy, stateful, interactive UI**. Custom HTML/CSS excels at **content, layout, and visual identity**.

---

## Always Use Ant Design For

Use AntD by default in these scenarios:

### 1. Forms & Validation

Examples:

- Login / Forgot password
- Create admin account
- Appointment booking forms
- User profile forms

Use:

- `Form`
- `Input`, `Select`, `DatePicker`
- `Form.Item` validation

Why:

- Built-in validation
- Consistent error handling
- Accessibility included

---

### 2. Data Display & CRUD

Examples:

- User lists
- Appointment tables
- Admin dashboards

Use:

- `Table`
- `Pagination`
- `Tag`
- `Badge`

Why:

- Sorting, filtering, pagination
- Standardized patterns
- Less custom logic

---

### 3. Overlays & State-driven UI

Examples:

- Confirmation dialogs
- Edit drawers
- Notifications

Use:

- `Modal`
- `Drawer`
- `Popconfirm`
- `notification`, `message`

Why:

- Keyboard handling
- Focus trapping
- Predictable behavior

---

### 4. Layout for Admin Areas

Examples:

- Admin shell
- Navigation
- Settings pages

Use:

- `Layout`
- `Menu`
- `Breadcrumb`
- `Tabs`

Why:

- Clear information hierarchy
- Consistent spacing
- Easy scaling

---

## Prefer HTML / CSS For

Use custom markup and styling in these scenarios:

### 1. Marketing & Content Sections

Examples:

- Home page sections
- Visit us
- About us
- Hero sections

Use:

- Semantic HTML (`section`, `article`, `h1–h3`, `p`)
- SCSS / CSS modules

Why:

- Branding matters more than consistency
- AntD adds little value
- Easier visual customization

---

### 2. Static Informational Pages

Examples:

- Privacy Policy
- Terms of Service
- Cookie Policy

Use:

- HTML + CSS
- Optional `Typography` only

Why:

- Minimal interactivity
- Simpler DOM

---

### 3. Highly Custom UI Elements

Examples:

- Custom cards
- Branded callouts
- Unique layouts

Why:

- AntD abstractions may fight the design
- Overrides become brittle

---

## Mixed Approach (Recommended)

It is **expected and encouraged** to mix AntD with custom markup.

### Good Example

- Custom section layout
- AntD `Button`, `Icon`, `Typography`
- SCSS for spacing and branding

This balances:

- Developer velocity
- Design flexibility

---

## Anti-Patterns (Avoid These)

❌ Using AntD for purely static content  
❌ Wrapping everything in `Card` by default  
❌ Recreating AntD form validation manually  
❌ Deeply overriding AntD internal CSS classes  
❌ Using AntD just to "look consistent" on marketing pages

---

## Decision Checklist

Before writing or refactoring a component, ask:

1. Is this data-driven or CRUD-related?
2. Does it need validation, state, or accessibility handling?
3. Would AntD reduce custom logic or CSS?

If **2 or more answers are yes → use AntD**  
Otherwise → prefer HTML/CSS

---

## Wrapper Components Strategy

To reduce lock-in and centralize styling:

Create shared UI wrappers:

```
/components/ui/
  AppButton.tsx
  AppForm.tsx
  AppModal.tsx
  AppTable.tsx
```

Rules:

- Wrap AntD, don’t reimplement it
- Apply shared props and styling here
- Use wrappers across admin features

---

## Summary

- **Admin & internal tools → Ant Design first**
- **Marketing & content → HTML/CSS first**
- **Mix intentionally, not accidentally**
- **Refactor only where AntD adds real value**

This guideline exists to keep the codebase:

- Consistent
- Scalable
- Easy to maintain

---
