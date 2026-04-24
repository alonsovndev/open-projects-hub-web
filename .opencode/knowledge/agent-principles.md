# Agent Working Principles

This document defines the core working principles that guide agent behavior in this repository.

These principles complement the architectural standards in `AGENTS.md` and provide practical guidance for how agents should approach their work. They emphasize thoughtful analysis, minimal changes, code reuse, efficient communication, and thorough verification.

## Overview

| Principle                     | Focus                                   |
| ----------------------------- | --------------------------------------- |
| **Think Before Act**          | Analysis, context, planning             |
| **Edit the Minimum**          | Surgical changes, respect existing code |
| **Don't Repeat Code**         | DRY principle, reuse utilities          |
| **Don't Explain the Obvious** | Concise communication                   |
| **Test Before Done**          | Progressive verification                |

## 1. Think Before Act

### Principle

Analyze context, understand the problem fully, and plan your approach before making changes.

### Why It Matters

- Prevents introducing bugs or breaking existing functionality
- Avoids unnecessary refactoring or scope creep
- Ensures changes align with existing architecture and patterns
- Reduces wasted effort from misunderstanding requirements

### Guidelines

**Before Making Changes:**

1. **Read relevant context files:**
   - Current file being modified
   - Related components, utilities, or types
   - Architecture documentation (`.opencode/knowledge/`)
   - Existing tests for the area

2. **Understand the problem:**
   - What is the actual requirement?
   - What are the constraints?
   - What are potential side effects?
   - Are there existing patterns to follow?

3. **Plan your approach:**
   - What files need to change?
   - What is the minimal set of changes?
   - Are there dependencies or ordering concerns?
   - What verification steps are needed?

4. **Ask when uncertain:**
   - Clarify ambiguous requirements
   - Confirm architectural decisions
   - Verify understanding before large changes

### Examples

✅ **Do:**

```typescript
// Agent reads context first
// 1. Read src/features/auth/components/LoginForm.tsx
// 2. Read src/features/auth/hooks/use-login-form.ts
// 3. Read src/features/auth/types/index.ts
// 4. Understand the existing validation pattern
// 5. Make targeted change that follows the pattern

// Result: Consistent, well-integrated change
export const LoginForm: FC = () => {
  const { form, handleSubmit, isLoading } = useLoginForm();
  // Change follows existing hook pattern
};
```

❌ **Don't:**

```typescript
// Agent makes assumptions without reading context
// Introduces new pattern that conflicts with existing code
export const LoginForm: FC = () => {
  // Created custom validation instead of using existing useLoginForm hook
  const [errors, setErrors] = useState({});
  const validate = () => {
    /* duplicates existing logic */
  };
};
```

✅ **Do:**

```text
Agent: "I notice you have an existing authentication flow using
       RTK Query in src/features/auth/api/. Should I follow that
       pattern for the new registration endpoint, or do you prefer
       a different approach?"
```

❌ **Don't:**

```text
Agent: "I'll create a new auth system using Axios since that's
       what I'm familiar with."

(Ignores existing RTK Query setup)
```

### Integration with Repository Standards

This principle aligns with:

- **AGENTS.md** Non-Negotiable Rules (lines 445-474)
- **frontend-architecture.md** Layer responsibilities
- **project-preferences.md** Feature isolation and public APIs

## 2. Edit the Minimum

### Principle

Make surgical, targeted changes. Don't refactor unrelated code or expand scope beyond what was requested.

### Why It Matters

- Reduces risk of introducing bugs in working code
- Makes changes easier to review and understand
- Keeps commits focused and atomic
- Respects existing code and team decisions
- Prevents scope creep

### Guidelines

**When Making Changes:**

1. **Target only necessary files:**
   - Modify only what's required for the task
   - Don't "improve" unrelated code
   - Don't reformat entire files

2. **Preserve existing patterns:**
   - Match the style and structure already present
   - Don't impose new patterns without discussion
   - Respect naming conventions in use

3. **One concern per change:**
   - Separate refactoring from feature work
   - Don't mix bug fixes with enhancements
   - Keep changes atomic

4. **Avoid premature optimization:**
   - Don't refactor working code "just because"
   - Don't introduce abstractions before they're needed
   - Performance improvements should be measured

### Examples

✅ **Do:**

```typescript
// Task: Add email validation to login form
// Minimal change: Update validation schema only

// src/features/auth/model/validation.ts
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"), // Added validation
  password: z.string().min(8),
});

// That's it. Don't touch other files.
```

❌ **Don't:**

```typescript
// Task: Add email validation to login form
// Unnecessary changes: Refactor entire auth feature

// Agent refactors:
// - Renames variables in LoginForm.tsx
// - Extracts utility functions from useLoginForm.ts
// - Reorganizes folder structure
// - Updates unrelated components
// - Changes styling approach

// Result: Massive diff, high risk, scope creep
```

✅ **Do:**

```typescript
// Task: Fix bug in normalizeProjectCode
// Surgical fix: Change only the problematic regex

export const normalizeProjectCode = (projectCode: string) => {
  return projectCode
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, ""); // Fixed: removed $ anchor
};
```

❌ **Don't:**

```typescript
// Task: Fix bug in normalizeProjectCode
// Over-engineering: Rewrite entire function with new approach

export const normalizeProjectCode = (projectCode: string) => {
  // Rewrote entire function with different logic
  // Extracted multiple helper functions
  // Changed API contract
  // Added features that weren't requested
  const sanitized = projectCode.split("").filter(isValidChar).join("");
  return applyTransformations(sanitized);
};
```

### Integration with Repository Standards

This principle aligns with:

- **AGENTS.md** Response Efficiency (lines 9-37)
- **project-preferences.md** Keep components focused (lines 98-106)
- **TDD workflow** Make minimum code to pass tests

## 3. Don't Repeat Code

### Principle

Follow the DRY (Don't Repeat Yourself) principle. Extract shared logic, use existing utilities, and create reusable components when patterns emerge.

### Why It Matters

- Reduces maintenance burden (one place to update)
- Prevents inconsistencies and bugs
- Improves code quality and readability
- Encourages thoughtful abstraction
- Aligns with feature-based architecture

### Guidelines

**Before Creating New Code:**

1. **Search for existing solutions:**
   - Check `src/shared/utils/` for utilities
   - Check `src/shared/components/` for UI components
   - Check feature's own utilities and hooks
   - Use grep/search tools to find similar code

2. **Extract when patterns emerge:**
   - Wait until code is repeated 2-3 times
   - Don't prematurely abstract on first use
   - Ensure abstraction makes code clearer, not harder to understand

3. **Choose the right location:**
   - Feature-specific logic → `src/features/<feature>/`
   - Cross-feature utilities → `src/shared/utils/`
   - Cross-feature components → `src/shared/components/`
   - Refer to `frontend-architecture.md` for guidance

4. **Avoid wrong abstractions:**
   - Don't force unrelated code into shared utilities
   - Don't create overly generic abstractions
   - Some duplication is better than bad abstraction

### Examples

✅ **Do:**

```typescript
// Scenario: Need date formatting in multiple places
// Step 1: Search for existing utility
// Found: src/shared/utils/format-date.ts exists!

// Use existing utility
import { formatDate } from "@/shared/utils/format-date";

export const ProjectCard: FC<Props> = ({ project }) => {
  return <span>{formatDate(project.createdAt)}</span>;
};
```

❌ **Don't:**

```typescript
// Scenario: Need date formatting
// Without searching, duplicate the logic

export const ProjectCard: FC<Props> = ({ project }) => {
  // Duplicated logic that already exists in shared utils
  const formatted = new Date(project.createdAt).toLocaleDateString();
  return <span>{formatted}</span>;
};
```

✅ **Do:**

```typescript
// Scenario: Same validation logic used in 3 components
// Extract to shared location

// src/features/viewer/model/validation.ts
export const validateProjectCode = (code: string): boolean => {
  return /^[A-Z0-9-]+$/.test(code);
};

// Multiple components import and use it
import { validateProjectCode } from "@/features/viewer/model/validation";
```

❌ **Don't:**

```typescript
// Scenario: Same validation in 3 components
// Copy-paste the logic everywhere

// Component A
const isValid = /^[A-Z0-9-]+$/.test(code);

// Component B
const isValid = /^[A-Z0-9-]+$/.test(code);

// Component C
const isValid = /^[A-Z0-9-]+$/.test(code);

// Result: Bug in regex requires fixing in 3 places
```

✅ **Do:**

```typescript
// Scenario: Creating wrapper for Ant Design Button
// Check if AppButton already exists first

// Found: src/shared/components/ui/app-button/ exists
import { AppButton } from "@/shared/components/ui/app-button";

// Use existing wrapper
<AppButton type="primary">Submit</AppButton>
```

❌ **Don't:**

```typescript
// Scenario: Need button wrapper
// Create duplicate without checking

// src/features/auth/components/CustomButton.tsx
// Duplicates existing AppButton from shared/components/ui/
export const CustomButton: FC<Props> = (props) => {
  return <Button {...props} />;
};
```

### When NOT to Extract

❌ **Premature abstraction:**

```typescript
// Used in only ONE place - don't extract yet
export const calculateTotal = (items: Item[]) => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Wait until it's used 2-3 times before extracting
```

❌ **Forced generalization:**

```typescript
// Two similar but different concerns - don't force shared abstraction
const formatUserName = (user: User) => `${user.firstName} ${user.lastName}`;
const formatProjectName = (project: Project) => project.code.toUpperCase();

// Bad: Force into generic "formatter" that obscures intent
const formatEntity = (entity: User | Project, type: string) => {
  /* complex logic */
};
```

### Integration with Repository Standards

This principle aligns with:

- **AGENTS.md** Code Organization Best Practices (lines 351-362)
- **project-preferences.md** Component Placement Rules (lines 108-123)
- **frontend-architecture.md** Feature isolation and shared utilities

## 4. Don't Explain the Obvious

### Principle

Be concise and direct. Skip unnecessary explanations, preambles, and status updates. Focus on WHY not WHAT when explanation is needed.

### Why It Matters

- Respects user's time and attention
- Reduces noise in communication
- Makes important information stand out
- Aligns with professional development standards
- Improves signal-to-noise ratio

### Guidelines

**Communication Standards:**

1. **Skip preambles:**
   - ❌ "Here's what I did..."
   - ❌ "I've updated..."
   - ❌ "Let me help you with..."
   - ✅ Just show the code or result

2. **Let code speak:**
   - For simple changes, show code directly
   - No surrounding explanation needed for obvious changes
   - Only add comments for non-obvious logic

3. **Focus on WHY not WHAT:**
   - Don't describe what the code does (visible in code)
   - Explain why you chose an approach
   - Explain tradeoffs when multiple options exist
   - Explain when clarification is genuinely needed

4. **When to be detailed:**
   - Architectural decisions
   - Multiple implementation approaches
   - Complex tradeoffs
   - Error diagnosis and debugging
   - User explicitly requests explanation

### Examples

✅ **Do:**

```typescript
// Simple change - just show it
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US");
};
```

❌ **Don't:**

```text
"I've created a new utility function called formatDate that will
help us format dates consistently across the application. This
function takes a date string as input and returns a formatted
string using the toLocaleDateString method with US locale. I've
placed it in the shared utils folder so it can be reused."

(Then shows the same 3-line function)
```

✅ **Do:**

```text
Two approaches for the modal:

1. Ant Design Modal - faster, built-in validation
2. Custom modal - more brand control, requires styling work

Recommend #1 for admin UI, #2 for marketing pages.
```

❌ **Don't:**

```text
"Okay so I've been thinking about how we should implement this
modal and there are several different ways we could approach
this problem. Let me walk you through my thought process..."

(Then explains both approaches in excessive detail)
```

✅ **Do:**

```typescript
// Only comment the non-obvious
export const normalizeProjectCode = (code: string) => {
  return code
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, ""); // Remove invalid chars throughout string
};
```

❌ **Don't:**

```typescript
// Over-commented obvious code
export const normalizeProjectCode = (code: string) => {
  // First we trim whitespace from both ends
  const trimmed = code.trim();
  // Then we convert to uppercase
  const upper = trimmed.toUpperCase();
  // Finally we remove any characters that aren't letters, numbers, or hyphens
  const cleaned = upper.replace(/[^A-Z0-9-]/g, "");
  // Return the result
  return cleaned;
};
```

✅ **Do:**

```text
Agent: "Build failed - missing import in LoginForm.tsx"

(Shows fix directly)
```

❌ **Don't:**

```text
Agent: "I've run the build command and unfortunately it seems
that there was an error during the build process. Let me
investigate what went wrong here. After examining the error
output, I've determined that the issue is related to a missing
import statement in the LoginForm component. I'm going to fix
this now by adding the proper import..."

(Then shows the same fix)
```

### Communication Levels by Task Complexity

| Task Type       | Response Style                           |
| --------------- | ---------------------------------------- |
| Simple edit     | Code only, no explanation                |
| Medium change   | Brief summary + code                     |
| Complex feature | Approach discussion, then implementation |
| Error diagnosis | Error + fix, skip obvious details        |
| Architecture    | Detailed explanation appropriate         |

### Integration with Repository Standards

This principle aligns with:

- **AGENTS.md** Response Efficiency (lines 9-22)
- **AGENTS.md** Code Output (lines 18-22)
- **AGENTS.md** Token Budget Guidelines (lines 24-37)

## 5. Test Before Done

### Principle

Verify your work with tests, build, and type-checking before claiming completion. Use progressive verification throughout development.

### Why It Matters

- Catches bugs before they reach users
- Ensures changes don't break existing functionality
- Validates type safety and build integrity
- Provides confidence in code quality
- Aligns with TDD workflow

### Guidelines

**Verification Workflow:**

1. **During development:**

   ```bash
   npm run test:watch  # Auto-run tests on save
   ```

2. **After each feature increment:**

   ```bash
   npm run test:run && npm run type-check
   ```

3. **Before claiming completion:**

   ```bash
   npm run build  # Full production build
   ```

4. **For critical flows (when appropriate):**
   ```bash
   npm run test:e2e  # End-to-end tests
   ```

**Never Claim Completion Without:**

- ✅ Running tests (if they exist for the area)
- ✅ Verifying build succeeds
- ✅ Checking type-safety passes
- ✅ Confirming the feature works as expected

**Repository Script Status:**

Current repository has:

- ✅ `npm run build` - available
- ✅ `npm run type-check` - available
- ⚠️ `npm run test` - placeholder (not configured)
- ❌ `npm run lint` - not configured
- ❌ `npm run verify` - not configured

**Always state clearly when scripts are missing.**

### Examples

✅ **Do:**

```text
Agent makes change, then:

1. npm run test:run
   ✅ 20 tests passing

2. npm run type-check
   ✅ No type errors

3. npm run build
   ✅ Build successful

Agent: "Added email validation. Tests pass, types check, build succeeds."
```

❌ **Don't:**

```text
Agent makes change, then:

Agent: "I've added email validation. The feature is complete!"

(Didn't run any verification steps)
(Build might be broken)
(Types might have errors)
```

✅ **Do:**

```text
Agent: "Added normalizeProjectCode utility.

Verification:
- npm run test:run → ✅ 3 new tests passing
- npm run type-check → ✅ No errors
- npm run build → ✅ Success

Feature complete."
```

❌ **Don't:**

```text
Agent: "Added normalizeProjectCode utility. All done!"

User: "Did you test it?"
Agent: "Oh let me run tests now..."

(Tests fail, function has bug)
```

✅ **Do:**

```text
Agent: "Note: npm run lint is not configured in package.json.

Ran available checks:
- type-check: ✅ pass
- build: ✅ pass

Manual code review recommended since lint is unavailable."
```

❌ **Don't:**

```text
Agent: "Ran full verification, everything passes!"

(Claimed to run lint when it doesn't exist)
(User expects more verification than actually happened)
```

### Progressive Verification Workflow

Use **TDD cycle** when working on tested code:

1. **Red:** Write failing test
2. **Green:** Make test pass
3. **Refactor:** Clean up code
4. **Verify:** Run full checks

```bash
# During TDD
npm run test:watch  # See tests turn green

# After feature increment
npm run test:run && npm run type-check

# Before completion
npm run build
```

### When Tests Don't Exist

If the area you're working on doesn't have tests:

✅ **Do:**

```text
Agent: "Added feature X.

Note: No tests exist for this area yet.

Verification:
- Manual testing: ✅ Feature works
- Type-check: ✅ Pass
- Build: ✅ Pass

Consider adding tests for this feature."
```

❌ **Don't:**

```text
Agent: "Added feature X. All tests pass!"

(No tests exist - misleading claim)
```

### Integration with Repository Standards

This principle aligns with:

- **AGENTS.md** Non-Negotiable Rules (lines 445-474)
- **AGENTS.md** Build, Lint, and Test Commands (lines 39-107)
- **tdd-workflow.md** Progressive Verification Workflow (lines 86-121)
- **testing-strategy.md** When and what to test

## Quick Reference

### Before Starting Work

- [ ] Read relevant files and context
- [ ] Understand the problem and constraints
- [ ] Plan minimal set of changes
- [ ] Ask clarifying questions if uncertain

### While Working

- [ ] Make surgical, targeted changes only
- [ ] Search for existing utilities before creating new ones
- [ ] Follow existing patterns and conventions
- [ ] Extract shared logic when pattern emerges (2-3 uses)
- [ ] Run `npm run test:watch` during development

### Before Claiming Done

- [ ] Run `npm run test:run` (if tests exist)
- [ ] Run `npm run type-check`
- [ ] Run `npm run build`
- [ ] Verify feature works as expected
- [ ] State clearly if verification scripts are missing

### Communication

- [ ] Skip unnecessary preambles
- [ ] Show code directly for simple changes
- [ ] Explain WHY for complex decisions
- [ ] Be concise and direct
- [ ] Focus on signal over noise

## Related Documentation

- **AGENTS.md** - Repository-wide agent standards
- **tdd-workflow.md** - Test-driven development workflow
- **testing-strategy.md** - When and what to test
- **frontend-architecture.md** - Architecture and layer responsibilities
- **project-preferences.md** - Naming, structure, and preferences
