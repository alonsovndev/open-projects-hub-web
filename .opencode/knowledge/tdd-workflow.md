# Test-Driven Development (TDD) Workflow

This guide documents the TDD methodology adopted for this project, including practical examples and progressive adoption strategy.

## Core TDD Cycle: Red-Green-Refactor

### 1. Red Phase - Write a Failing Test

Write a test that describes the desired behavior **before** implementing the functionality.

```typescript
// Example: src/features/viewer/model/project-code.test.ts
it("should remove special characters throughout the string", () => {
  expect(normalizeProjectCode("PRJ-123@456")).toBe("PRJ-123456");
  expect(normalizeProjectCode("PRJ-123$456")).toBe("PRJ-123456");
});
```

**Run the test** to confirm it fails:

```bash
npm run test:run
```

Expected output: `❌ FAIL` with specific failure message showing what's wrong.

**Why this matters**: If the test passes immediately, you either:

- Already implemented the feature (test isn't driving development)
- Wrote a test that doesn't actually test the behavior
- Have a false positive test

### 2. Green Phase - Make the Test Pass

Write the **minimum code** required to make the test pass.

```typescript
// Before (buggy):
export const normalizeProjectCode = (projectCode: string) => {
  return projectCode
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]+$/g, "");
  //                                                           ^^
  //                                                  Only removes at END
};

// After (fixed):
export const normalizeProjectCode = (projectCode: string) => {
  return projectCode
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "");
  //                                                         ^^
  //                                             Removes throughout string
};
```

**Run the test** to confirm it passes:

```bash
npm run test:run
```

Expected output: `✅ PASS` with all tests green.

### 3. Refactor Phase - Improve Without Breaking

Clean up the code while keeping tests green.

- Extract repeated logic
- Improve naming
- Simplify complex expressions
- Remove duplication

**Run tests after each refactor** to ensure nothing broke:

```bash
npm run test:watch  # Watches for changes and re-runs
```

### 4. Repeat

Start the cycle again for the next piece of functionality.

## Progressive Verification Workflow

Use progressive verification during development instead of waiting until the end.

### During Active Development

```bash
npm run test:watch
```

Tests auto-run on file save, giving immediate feedback.

### After Each Feature Increment

```bash
npm run test:run && npm run type-check
```

Confirms tests pass and types are correct.

### Before Committing

```bash
npm run verify
```

Runs full verification: `test:run && type-check && build`

### Critical User Flows (When Available)

```bash
npm run test:e2e
```

Runs Playwright E2E tests for critical journeys (auth, checkout, etc.).

## Practical TDD Example: Bug Fix in `project-code.ts`

### Problem Identified

The `normalizeProjectCode` function had a regex bug:

```typescript
// Bug: Only removes invalid chars at the END of string
replace(/[^A-Z0-9-]+$/g, "");
//                    ^ Anchor matches end only

// Input:  "PRJ-123@456"
// Output: "PRJ-123@456"  ❌ Invalid char remains
```

### TDD Approach

**Step 1: Write Failing Test (Red)**

```typescript
it("should remove special characters throughout the string", () => {
  expect(normalizeProjectCode("PRJ-123@456")).toBe("PRJ-123456");
  expect(normalizeProjectCode("PRJ-123$456")).toBe("PRJ-123456");
  expect(normalizeProjectCode("PRJ@123-456")).toBe("PRJ123-456");
});
```

**Run test**: `npm run test:run`

```
❌ FAIL  normalizeProjectCode > should remove special characters throughout the string
AssertionError: expected 'PRJ-123@456' to be 'PRJ-123456'

Expected: "PRJ-123456"
Received: "PRJ-123@456"
```

**Step 2: Fix Implementation (Green)**

```typescript
export const normalizeProjectCode = (projectCode: string) => {
  return projectCode
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "");
  // Removed $ anchor to match throughout entire string
};
```

**Run test**: `npm run test:run`

```
✅ PASS  20 tests passing
```

**Step 3: Verify (Full Check)**

```bash
npm run verify
```

```
✅ test:run  - 20 passed
✅ type-check - no errors
✅ build - successful
```

### Key Takeaways

1. **Test caught the bug** - Without the test, the bug would silently exist
2. **Red-Green cycle proved the fix** - Failed first, then passed after fix
3. **Regression protection** - Future changes won't reintroduce this bug
4. **Documentation** - Test describes expected behavior clearly

## When to Write Tests

Refer to `.opencode/knowledge/testing-strategy.md` for comprehensive guidance.

**High Priority** (Always write tests):

- ✅ Business-critical utilities and validators
- ✅ Redux slices and state management
- ✅ Custom hooks with logic
- ✅ API integration logic
- ✅ Critical user journeys (E2E)

**Medium Priority** (Write when appropriate):

- ⚠️ Complex components with conditional rendering
- ⚠️ Forms with validation logic
- ⚠️ Data transformation pipelines

**Low Priority** (Usually skip):

- ❌ Simple presentational components
- ❌ UI-only components without logic
- ❌ Trivial utility wrappers

## TDD Anti-Patterns to Avoid

### ❌ Don't: Test Implementation Details

```typescript
// Bad: Testing internal state
expect(component.state.isLoading).toBe(false);

// Good: Testing user-visible behavior
expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
```

### ❌ Don't: Write Tests After the Fact (Without Red Phase)

```typescript
// Bad: Implementation already exists, test always passes
it("should normalize code", () => {
  expect(normalizeProjectCode("prj-123456")).toBe("PRJ-123456"); // ✅ Already works
});

// Good: Test fails first, drives implementation
it("should remove special chars", () => {
  expect(normalizeProjectCode("PRJ-123@456")).toBe("PRJ-123456"); // ❌ Fails, then fixed
});
```

### ❌ Don't: Make Tests Pass by Weakening Assertions

```typescript
// Bad: Test always passes, doesn't verify behavior
expect(true).toBe(true);

// Good: Test verifies actual behavior
expect(normalizeProjectCode("PRJ-123@456")).toBe("PRJ-123456");
```

### ❌ Don't: Skip the Refactor Phase

Write code to pass the test, **then** clean it up. Don't leave messy code just because tests pass.

## TDD Benefits Realized

### 1. Catches Bugs Early

The `project-code.ts` example showed how TDD caught a regex bug that would have gone unnoticed.

### 2. Documents Behavior

Tests serve as executable documentation:

```typescript
it("should remove special characters throughout the string", () => {
  expect(normalizeProjectCode("PRJ-123@456")).toBe("PRJ-123456");
});
```

Anyone reading this test knows exactly what `normalizeProjectCode` does with special characters.

### 3. Enables Confident Refactoring

With comprehensive tests, you can refactor code safely:

- Change implementation details
- Optimize performance
- Simplify complex logic

Tests will catch regressions immediately.

### 4. Reduces Debugging Time

When a test fails, you know exactly what broke and where.

### 5. Improves Design

Writing tests first forces you to think about:

- Clear function contracts
- Minimal dependencies
- Testable architecture

## Quick Reference Commands

| Task                   | Command                  |
| ---------------------- | ------------------------ |
| Watch tests during dev | `npm run test:watch`     |
| Run tests once         | `npm run test:run`       |
| Run tests with UI      | `npm run test:ui`        |
| Coverage report        | `npm run test:coverage`  |
| Type check             | `npm run type-check`     |
| Build                  | `npm run build`          |
| Full verification      | `npm run verify`         |
| E2E tests              | `npm run test:e2e`       |
| E2E with UI            | `npm run test:e2e:ui`    |
| E2E debug mode         | `npm run test:e2e:debug` |

## Next Steps

1. ✅ **Practice TDD on utilities** - Start with pure functions in `src/shared/utils/`
2. ⏭️ **Add tests to existing code** - Gradually cover critical paths
3. ⏭️ **Write tests first for new features** - Make TDD the default for new code
4. ⏭️ **Review test coverage** - Use `npm run test:coverage` to identify gaps
5. ⏭️ **Add E2E tests** - Cover critical user journeys with Playwright

## Related Documentation

- `.opencode/knowledge/testing-strategy.md` - When and what to test
- `.opencode/skills/testing-setup.md` - Vitest and Playwright configuration
- `.opencode/skills/testing-examples.md` - Practical testing patterns
- `.opencode/skills/playwright-e2e.md` - E2E testing with Playwright
- `AGENTS.md` - Repository-wide TDD and verification standards
