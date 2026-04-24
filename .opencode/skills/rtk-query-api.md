# RTK Query API Integration

## Description

This skill focuses on integrating REST APIs using Redux Toolkit’s RTK Query to handle data fetching/management.

### Capabilities

1. **API Endpoint Management & Mocking**:
   - Define endpoints in feature `api/` folders using `createApi` and `fakeBaseQuery()` initially to decouple from the backend.
   - Use typed mock-data files from `src/resources/mock-data/` and `simulateNetworkDelay` helpers while keeping sample data separate from UI components.
   - Transition to `fetchBaseQuery` (configured in `src/app/api/base-api.ts`) when real endpoints are ready.

2. **Component-Level Fetching**:
   - Favor granular component-level data fetching. Export auto-generated hooks (e.g., `useGetClinicServicesQuery`) from feature API files and call them directly inside the relevant feature component.
   - Avoid prop-drilling large data objects from page containers down to children.

3. **Caching & Revalidation**:
   - Manage tag-based caching using `providesTags` and `invalidatesTags`.
   - Optimize network requests for better performance.

4. **Loading & Error Handling**:
   - Always extract and handle `isLoading` and `isError` flags returned by the hook inside the UI.
   - Implement query/error retry when necessary.

**Example Structure**:
```
src/features/viewer/
  api/viewer-api.ts                    (RTK Query API definition)
  components/RequirementsViewer.tsx    (uses useGetClinicServicesQuery)
src/resources/
  mock-data/clinic-services.ts         (typed mock data)
src/app/
  api/base-api.ts                      (shared fetchBaseQuery config)
```

---

This skill ensures seamless API integration and follows the repository’s API logic guidelines in `AGENTS.md`.
