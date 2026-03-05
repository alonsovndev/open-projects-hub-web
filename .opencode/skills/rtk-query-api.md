# RTK Query API Integration

## Description

This skill focuses on integrating REST APIs using Redux Toolkit’s RTK Query to handle data fetching/management.

### Capabilities

1. **API Endpoint Management & Mocking**:
   - Define endpoints using `createApi` and `fakeBaseQuery()` initially to decouple from the backend.
   - Use `mockData.ts` files and `simulateNetworkDelay` functions within `src/features/<feature>/api/` to simulate backend responses.
   - Transition to `fetchBaseQuery` when real endpoints are ready.

2. **Component-Level Fetching**:
   - Favor granular component-level data fetching. Export auto-generated hooks (e.g., `useGetWhatWeDoQuery`) and call them directly inside the relevant feature component.
   - Avoid prop-drilling large data objects from page containers down to children.

3. **Caching & Revalidation**:
   - Manage tag-based caching using `providesTags` and `invalidatesTags`.
   - Optimize network requests for better performance.

4. **Loading & Error Handling**:
   - Always extract and handle `isLoading` and `isError` flags returned by the hook inside the UI.
   - Implement query/error retry when necessary.

---

This skill ensures seamless API integration and follows the repository’s API logic guidelines in `AGENTS.md`.
