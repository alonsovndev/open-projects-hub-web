# Form UX Expert Skill

## Purpose

Optimize forms and data entry experiences for Open Projects Hub.

## When to Use

Use this skill when:

- Creating new forms (login, register, project form, settings, etc.)
- Reviewing existing form implementations
- Debugging form submission issues
- Optimizing form completion rates

## Review Checklist

### 1. Labels

- [ ] Every form field has a visible label (Ant Design `Form.Item` `label` prop)
- [ ] Labels are above inputs (not inline/placeholder labels)
- [ ] Labels use Body MD (1rem/400), Text Primary color
- [ ] Labels are concise (1-3 words)
- [ ] Placeholder text is NOT used as a substitute for labels
- [ ] Ant Design `Form.Item` `label` used — not manual `<label>` elements

### 2. Validation

- [ ] Validation occurs on blur + submit (not on every keystroke by default)
- [ ] Inline validation messages below the field
- [ ] Validation rules use Ant Design `rules` prop — not custom validation JS
- [ ] Error messages are specific and helpful:
  - ❌ "Invalid input" → ✅ "Enter a valid email address"
  - ❌ "Required" → ✅ "Project name is required"
- [ ] Error color is Ant Design error red (#ff4d4f) via `status="error"`
- [ ] Multiple errors on same field show the most relevant one first
- [ ] Async validation (checking if username exists) shows loading state

### 3. Required Fields

- [ ] Required fields marked with red asterisk (Ant Design default)
- [ ] If all fields are required, consider: "All fields are required" note at top
- [ ] Required indicator is not the only cue (color-blind users)
- [ ] Star placement: left of label text (Ant Design default)

### 4. Helper Text

- [ ] Contextual help below input via Ant Design `Form.Item` `help` prop
- [ ] Helper text is Body SM (0.875rem/400), Text Secondary
- [ ] Helper text is informative, not repetitive
- [ ] Helper text does not disappear on input focus (stays visible)

### 5. Error Messages

- [ ] User-centered language: describe the problem, not the code
- [ ] Suggest correction when possible: "Password needs 8+ characters"
- [ ] Show errors inline (below the field) + summary at top for complex forms
- [ ] Errors do not disappear until the field is valid
- [ ] Errors do not clear user input (user can correct without retyping everything)
- [ ] Page-level errors use Ant Design `Alert` component at form top

### 6. Success Feedback

- [ ] Success message visible after form submission:
  - Modal forms: close modal + toast (`message.success`)
  - Page forms: success message (`Alert type="success"`) or redirect
- [ ] Feedback is specific: "Project 'Q4 Planning' created" not "Success"
- [ ] User knows what happens next after success

### 7. Field Grouping

- [ ] Related fields grouped together (e.g., address fields, date range)
- [ ] Groups visually separated with spacing or sections (Ant Design `Card` or spacing)
- [ ] Long forms broken into sections with clear headings (H3 or Label Caps)
- [ ] Section headings describe what follows ("Contact Information", "Project Details")
- [ ] More than 10 fields: consider multi-step (Ant Design `Steps` component)

### 8. Completion Flow

- [ ] Tab order follows visual layout (left → right, top → bottom)
- [ ] Enter key submits the form or moves to next field
- [ ] Auto-focus first field on mount
- [ ] Auto-advance for predictable inputs (verification codes)
- [ ] Back button preserves form state (don't clear on navigation away)
- [ ] Submit button disabled while submitting (Ant Design `loading` prop)
- [ ] Prevent double submission
- [ ] Scroll to first error on validation failure

### 9. Accessibility for Forms

- [ ] Form has `<form>` element with `onSubmit` (Ant Design `Form` provides this)
- [ ] All inputs have associated `<label>` elements
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Required fields announced to screen readers (Ant Design does this)
- [ ] Success/failure announcements via `aria-live`
- [ ] Tab through all fields works without mouse

### 10. Ant Design Form Best Practices

- [ ] `Form` component used — not manual `<form>` with state management
- [ ] `Form.useForm()` for form instance control (reset, setFields, validate)
- [ ] `rules` array for validation — not manual `onChange` validation
- [ ] `validateTrigger` set to `"onBlur"` for better UX (default is onChange)
- [ ] `preserve={false}` for modals to reset on close
- [ ] `Form.List` for dynamic form sections
- [ ] `Form.Item` `noStyle` for inline composition
- [ ] `shouldUpdate` or `dependencies` for cross-field validation

### Form Type Reference

| Form Type            | Best Practices                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------- |
| **Login**            | 2 fields (email, password), "Remember me" checkbox, "Forgot password" link, max 480px width |
| **Register**         | 3-5 fields, inline validation, password strength indicator, terms acceptance                |
| **Project/Create**   | Name + description + dates + type, multi-column when appropriate                            |
| **Settings/Profile** | Section dividers, save per section or single save, preview before save                      |
| **Search**           | Ant Design `Input.Search`, debounced, results visible immediately                           |
| **Filter**           | Horizontal on desktop, collapsible on mobile, clear all button                              |

## Output Format

```markdown
## Form UX Expert Review

**Form Completion Score: X/10**

### Friction Points

| #   | Severity | Field/Area | Issue                | Effect on User           |
| --- | -------- | ---------- | -------------------- | ------------------------ |
| 1   | High     | Email      | No inline validation | User submits, gets error |
| ... |          |            |                      |                          |

### UX Recommendations

1. Add inline validation on blur for email field
2. Move helper text below password field
3. Add "Show password" toggle

### Completion Optimization Opportunities

1. Reduce form fields from 8 to 5
2. Add autocomplete attributes
3. Group address fields together

### Quick Wins

1. Add `autoFocus` to first field
2. Change submit button text from "Submit" to "Create Project"
3. Add `preserve={false}` to modal form
```
