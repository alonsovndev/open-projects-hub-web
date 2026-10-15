# Mock API Setup (MSW)

## Overview

Mock Service Worker (MSW) intercepts API requests in unit and integration tests (Vitest). The app itself always talks to the real API.

## Mock Users

### Available Accounts

| Email          | Password  | Role  |
| -------------- | --------- | ----- |
| admin@test.com | Admin123! | admin |
| user@test.com  | User123!  | user  |

## Testing

MSW runs in unit and integration tests (Vitest) through `src/mocks/server.ts`. Playwright E2E tests use a real, seeded API.

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
