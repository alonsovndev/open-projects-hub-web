# Performance Review — 26-05-10

**Project:** Open Projects Hub Web
**Audit Date:** 10 May 2026
**Auditor:** Copilot Coding Agent

---

## Score: 8 / 10 (↑ from 6.5 in v1)

Bundle splitting has been implemented. Vendor chunks now load separately from
feature code, and all route components are lazy-loaded. The main performance
gap that remains is render-time optimisation: expensive list components are
not memoized.

---

## Bundle Strategy

### What Is Now in Place

`vite.config.mts` configures `build.rollupOptions.output.manualChunks`:

| Chunk Name     | Contents                                                   |
| -------------- | ---------------------------------------------------------- |
| `vendor-react` | `react`, `react-dom`, `react-router-dom`                   |
| `vendor-redux` | `@reduxjs/toolkit`, `react-redux`                          |
| `vendor-antd`  | `antd`, `@ant-design/icons`                                |
| `vendor-dnd`   | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |

Vendor chunks change rarely and can be cached by the browser across deploys.

### Lazy Routing

All nine feature route sets use `lazyWithRetry`:

```ts
// example from src/app/routing/routes.tsx
const UnauthorizedPage = lazyWithRetry(() => import("@/pages/unauthorized"));
```

`lazyWithRetry` adds one automatic page reload on chunk-load failure, which
handles stale-deployment scenarios where the previous chunk URL is no longer
valid.

`<Suspense fallback={<RouteLoading />}>` wraps the entire `<Routes>` tree,
providing a consistent loading indicator while route modules hydrate.

### Chunk Size Warning Limit

`chunkSizeWarningLimit: 500` (KB) is set. Ant Design's full component library
is the likely driver for the `vendor-antd` chunk exceeding this limit. The
build should be run with `build:analyze` to verify actual chunk sizes before
optimising further.

---

## Render Performance

### Memoization Audit

| Hook / API    | Occurrences | Files |
| ------------- | ----------- | ----- |
| `useMemo`     | ~15         | 8     |
| `useCallback` | ~8          | 5     |
| `React.memo`  | 3           | 3     |

Total: 26 instances across 181 source files — approximately 1 usage per 7
files. This is low for an app with large sortable lists and real-time state
updates.

#### Components That Should Be Memoized

| Component       | Reason                                                      |
| --------------- | ----------------------------------------------------------- |
| `ProjectsTable` | Re-renders on every store update; renders many rows         |
| `BacklogBoard`  | Hosts DnD sortable; re-renders during drag                  |
| `BacklogColumn` | Child of `BacklogBoard`; re-renders on every drag event     |
| `StoryCard`     | Rendered per story in column; high-frequency updates        |
| `StoryList`     | Renders N stories; unnecessary re-renders on filter changes |

---

## Network / API Performance

- RTK Query is used for all API calls. It provides automatic deduplication,
  caching, and background refetch.
- No observable N+1 query pattern found in the current code.
- No pagination has been implemented for `ProjectsTable` or `BacklogBoard`
  — this will matter as data volumes grow.

---

## Build Performance

- Vite 7 with `@vitejs/plugin-react` (Babel) is the build tool.
- `rollup-plugin-visualizer` is configured to output `dist/stats.html` —
  run `npm run build:analyze` to inspect actual chunk weights.
- `sass-embedded` is used, which is faster than the JavaScript Sass port.

---

## Issues

1. **No pagination** on project and backlog list views — full dataset is
   loaded into the component on mount.
2. **Ant Design imported in full** — consider using tree-shaking-friendly
   imports or Ant Design's modular CSS solution to reduce `vendor-antd` size.
3. **No image optimization** — no `vite-plugin-imagemin` or WebP conversion
   for public assets.
4. **No web vitals measurement** — no `@vercel/speed-insights` or
   `web-vitals` integration to track LCP, FID, CLS in production.
5. **`lazyWithRetry` uses `window.location.reload()`** — this approach can
   cause an infinite reload loop if the chunk genuinely doesn't exist at the
   new URL. Consider replacing with a user-visible prompt instead.

---

## Recommendations

1. **Wrap `ProjectsTable`, `BacklogBoard`, `BacklogColumn`, `StoryCard`,
   `StoryList`** with `React.memo`.
2. **Add `useMemo`** to derived data in `useProjectsOverview` and
   `useBacklog` hooks to avoid recalculating sorted/filtered lists on every
   render.
3. **Add server-side pagination** to the projects and backlog API endpoints;
   implement cursor- or offset-based pagination in RTK Query.
4. **Integrate `web-vitals`** — log LCP, CLS, and INP to the console in
   development and to an analytics endpoint in production.
5. **Run `npm run build:analyze`** after the next significant feature drop and
   set a bundle size budget in CI.
