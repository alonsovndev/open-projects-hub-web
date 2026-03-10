# Redux Logic

## Description

This skill defines how Redux Toolkit should be used in this project without conflicting with the preferred RTK Query workflow.

## Core Rules

1. Use RTK Query for async server state by default.
2. Use `createSlice` for client-side UI or app state only.
3. Do not default to `createAsyncThunk` for standard data fetching.
4. Keep Redux logic inside the relevant feature or store layer.

## Appropriate Uses for `createSlice`

Use slices for:

- UI preferences
- temporary wizard state
- auth/session state when not handled elsewhere
- cross-page client state

## Appropriate Uses for RTK Query

Use RTK Query for:

- fetching feature data
- caching server responses
- loading and error state management
- invalidation and refetch flows

## Project Preference

When backend APIs are not ready:

1. Create `src/features/<feature>/api/mockData.ts`
2. Use `createApi` with `fakeBaseQuery()`
3. Simulate latency in the mock layer
4. Consume the generated hook directly in the feature component

## Avoid

1. `createAsyncThunk` for routine fetching flows
2. Fetching everything in a page and passing it downward
3. Mixing UI-only config with backend mock data
