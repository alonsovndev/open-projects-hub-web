# Best Practices Audit and Future Improvements

## High-level View

This audit evaluates the current codebase as a reference implementation for future SPAs. The goal is not to criticize an early-stage application for being incomplete, but to identify what is already strong, what is still immature, and what should be prioritized before this repository is used as a broader boilerplate.

## What the Project Already Does Well

### 1. Clear feature boundaries

- Feature-specific routes, components, hooks, models, and state are colocated.
- This reduces accidental coupling and makes ownership obvious.

### 2. Thin pages

- Route entry points under `src/pages/` focus on composition instead of business logic.
- This makes navigation code easy to scan and supports gradual feature growth.

### 3. Centralized route protection

- `GuardResolver` prevents repeated auth checks across the app.
- This is a solid baseline pattern for a growing SPA.

### 4. Typed API and session flow

- RTK Query endpoint injection plus response normalization is a maintainable choice.
- The code is already structured in a way that can grow without turning components into networking layers.

### 5. Sensible UI split

- Ant Design is used where it adds value for forms, layout, cards, and feedback.
- SCSS Modules keep branding and local layout concerns close to their components.

## Current Risks and Gaps

### Build reliability

- `npm run build` currently fails because `src/pages/home/index.tsx` references a missing stylesheet file.
- As a reference project, a broken build lowers confidence for anyone trying to use the repository as a starting point.

### Testing maturity

- The repo now has a real testing stack: Vitest for unit/component tests, Playwright for e2e flows, and shared test helpers under `src/test/`.
- The main gap has shifted from "no tests exist" to "coverage is still too shallow around auth, guards, and dashboard behavior."

### Formatting consistency

- `npm run format:check` currently reports multiple pre-existing issues in `src/`.
- The docs added here do not depend on those files, but the repo would benefit from bringing source formatting back to green.

### Inconsistent naming

- The repo contains both `src/pages/Home/` and `src/pages/home/`.
- Mixed casing creates avoidable confusion and can lead to import or build issues on case-sensitive systems.

### Placeholder product depth

- The dashboard and parts of the viewer flow are intentionally partial or demo-oriented.
- That is acceptable for a reference app, but the documentation should be honest that some modules are architectural examples more than production-complete features.

## Baseline Recommendation

As a reference application today, this project is a **good architectural starter with a credible quality foundation, but not yet a complete boilerplate**. It is best suited for:

- demonstrating folder organization
- illustrating routing and guard patterns
- showing a clean auth feature structure
- teaching how to separate app infrastructure from feature code

It is not yet ideal as a drop-in production starter until the build issue is fixed and the most critical application flows have deeper automated coverage.

## Future Improvements

### Short-term

1. Restore build health by fixing missing stylesheet imports and casing inconsistencies.
2. Expand the current suite with auth, guard, and dashboard integration coverage.
3. Make format checks pass consistently so CI can enforce style.

### Mid-term

1. Add a 404 route and document error-state behavior.
2. Formalize session persistence and sign-out cleanup.
3. Replace placeholder dashboard content with feature-owned modules backed by real data.
4. Start enforcing coverage thresholds once the current critical-path suite exists.

### Long-term

1. Extract reusable app shell patterns into a formal boilerplate template.
2. Add a dedicated application CI workflow that publishes coverage and Playwright reports.
3. Provide sample feature-generation conventions for scaling to many domains.
4. Add visual regression coverage for branded screens once the UI stabilizes.

## Best Practices for Testing

### Project philosophy

- Prefer **behavior-oriented tests** over implementation-detail tests.
- Mock at the **API, router, or store boundary** instead of mocking every local helper.
- Use pure-model tests for business rules and integration tests for user journeys.
- Treat coverage as a way to reveal risk concentration, not as a vanity metric.

### What this means in practice

- Home should prove navigation intent.
- Login should prove validation, mutation handling, and redirect behavior.
- Dashboard should prove guard enforcement and post-login actions.
- Viewer should keep pure validation logic in test-friendly model files.

## How to Use This Audit

### For junior engineers

- Treat the current structure as a model for where new code belongs.
- Treat the identified gaps as reminders of what “production-ready” still requires.

### For senior engineers

- Use the strong patterns here as the base contract.
- Prioritize build stability, test maturity, and naming consistency before wider adoption.

## Learning Resources

- [Google Engineering Practices documentation](https://google.github.io/eng-practices/)
- [Martin Fowler on technical debt](https://martinfowler.com/bliki/TechnicalDebt.html)
- [Testing Library guiding principles](https://testing-library.com/docs/guiding-principles/)
- [Twelve-Factor App config principle](https://12factor.net/config)
- [Playwright best practices](https://playwright.dev/docs/best-practices)
