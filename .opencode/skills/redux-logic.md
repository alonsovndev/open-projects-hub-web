# Redux Logic

## Description

This skill defines how Redux Toolkit should be used in this project without conflicting with the preferred RTK Query workflow.

## Core Rules

1. Use RTK Query for async server state by default.
2. Use `createSlice` for client-side UI or app state only.
3. Do not default to `createAsyncThunk` for standard data fetching.
4. Keep Redux logic inside the relevant feature's `state/` folder or in `src/app/store/`.

## Appropriate Uses for `createSlice`

Use slices for:

- UI preferences (e.g., theme, sidebar state)
- Temporary wizard or multi-step form state
- Auth/session state (e.g., `src/features/auth/state/auth-slice.ts`)
- Cross-page client state that is not server-driven

Place feature slices in `src/features/<feature>/state/` and register them in `src/app/store/store.ts`.

## Appropriate Uses for RTK Query

Use RTK Query for:

- fetching feature data
- caching server responses
- loading and error state management
- invalidation and refetch flows

## Project Preference

When backend APIs are not ready:

1. Create typed mock data files in `src/resources/mock-data/`
2. Define the API in the feature's `api/` folder using `createApi` with `fakeBaseQuery()`
3. Simulate latency in the mock layer
4. Consume the generated hook directly in the relevant feature component

Example structure:
```
src/features/viewer/
  api/viewer-api.ts          (RTK Query API with fakeBaseQuery)
src/resources/
  mock-data/
    clinic-services.ts       (typed mock data)
```

## Avoid

1. `createAsyncThunk` for routine fetching flows
2. Fetching everything in a page and passing it downward
3. Mixing UI-only config with backend mock data
