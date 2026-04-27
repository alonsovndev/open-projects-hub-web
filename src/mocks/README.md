# Mock API Setup (MSW)

## Overview

Mock Service Worker (MSW) intercepts API requests during development and testing.

## Mock Users

### Available Accounts

| Email          | Password  | Role  |
| -------------- | --------- | ----- |
| admin@test.com | Admin123! | admin |
| user@test.com  | User123!  | user  |

## Development

MSW automatically starts in development mode (`npm run dev`).

Check browser console for `[MSW] Mocking enabled` message.

## Testing

MSW runs automatically in:

- Unit tests (Vitest)
- E2E tests (Playwright)

## Adding Handlers

Add new handlers in `src/mocks/handlers/`:

```ts
// src/mocks/handlers/projects.ts
import { http, HttpResponse } from "msw";

export const projectHandlers = [
  http.get("/api/projects", () => {
    return HttpResponse.json([{ id: 1, name: "Project A" }]);
  }),
];
```

Register in `src/mocks/handlers.ts`:

```ts
import { projectHandlers } from "./handlers/projects";

export const handlers = [...authHandlers, ...projectHandlers];
```

## Disabling Mocks

Set `MODE=production` or remove MSW initialization from `src/main.tsx`.
