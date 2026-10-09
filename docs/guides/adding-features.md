# Adding Features

Step-by-step workflow for creating new features in Open Projects Hub Web.

## Overview

This guide walks through the complete process of adding a new feature from scratch. Follow this workflow for consistent, maintainable feature development.

## Prerequisites

- Read **[Getting Started](../getting-started.md)**
- Understand **[Folder Structure](../architecture/folder-structure.md)**
- Review **[Conventions](../development/conventions.md)**

## Step-by-Step Workflow

### Step 1: Plan Your Feature

**Before writing code**, answer these questions:

1. **What is the feature's purpose?**
   - Example: "Allow users to view and filter project list"

2. **What routes does it need?**
   - Example: `/projects`, `/projects/:id`

3. **Is it public or authenticated?**
   - Public → Use `PublicLayout` + `["public"]` guard
   - Authenticated → Use `AdminLayout` + `["auth"]` guard
   - Admin-only → Add `{ role: "admin" }` guard

4. **What API endpoints does it need?**
   - Example: `GET /api/projects`, `GET /api/projects/:id`

5. **Does it need client state?**
   - Session/UI state → Redux slice
   - Server data → RTK Query

### Step 2: Create Feature Structure

```bash
# Create feature folders
mkdir -p src/features/projects/{components,hooks,api,state,types,tests}

# Create key files
touch src/features/projects/routes.tsx
touch src/features/projects/index.ts
touch src/features/projects/types/index.ts
```

### Step 3: Define Types

```typescript
// src/features/projects/types/index.ts
export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "archived";
  createdAt: number;
}

export interface ProjectFilters {
  status?: string;
  search?: string;
}

export interface ProjectListResponse {
  projects: Project[];
  total: number;
}
```

### Step 4: Create API Integration

```typescript
// src/features/projects/api/projects-api.ts
import { baseApi } from "@/app/api/base-api";
import type { Project, ProjectListResponse, ProjectFilters } from "../types";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectListResponse, ProjectFilters>({
      query: (filters) => ({
        url: "/projects",
        params: filters,
      }),
    }),

    getProject: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
    }),

    createProject: builder.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "/projects",
        method: "POST",
        body: project,
      }),
    }),
  }),
});

export const { useGetProjectsQuery, useGetProjectQuery, useCreateProjectMutation } = projectsApi;
```

### Step 5: Create Components

```bash
# Create component structure
mkdir -p src/features/projects/components/project-list
touch src/features/projects/components/project-list/ProjectList.tsx
touch src/features/projects/components/project-list/project-list.module.scss
touch src/features/projects/components/project-list/index.ts
```

```typescript
// src/features/projects/components/project-list/ProjectList.tsx
import type { FC } from "react";
import { Card, Tag, Spin, Alert } from "antd";
import { useGetProjectsQuery } from "../../api/projects-api";
import styles from "./project-list.module.scss";

export const ProjectList: FC = () => {
  const { data, isLoading, error } = useGetProjectsQuery({});

  if (isLoading) return <Spin size="large" />;
  if (error) return <Alert message="Failed to load projects" type="error" />;

  return (
    <div className={styles.container}>
      {data?.projects.map((project) => (
        <Card key={project.id} title={project.name} className={styles.card}>
          <p>{project.description}</p>
          <Tag color={project.status === "active" ? "green" : "default"}>
            {project.status}
          </Tag>
        </Card>
      ))}
    </div>
  );
};
```

```scss
// src/features/projects/components/project-list/project-list.module.scss
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 24px;
}

.card {
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
}
```

```typescript
// src/features/projects/components/project-list/index.ts
export { ProjectList } from "./ProjectList";
```

### Step 6: Create Hooks (Optional)

If business logic becomes complex, extract to hooks:

```typescript
// src/features/projects/hooks/use-project-filters.ts
import { useState } from "react";
import type { ProjectFilters } from "../types";

export const useProjectFilters = () => {
  const [filters, setFilters] = useState<ProjectFilters>({});

  const setStatus = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    filters,
    setStatus,
    setSearch,
    clearFilters,
  };
};
```

### Step 7: Define Routes

```typescript
// src/features/projects/routes.tsx
import type { AppRoute } from "@/app/routing/types";
import { AdminLayout } from "@/app/layouts";
import { ProjectsPage } from "@/pages/projects";

export const projectsRoutes: AppRoute[] = [
  {
    path: "/projects",
    element: (
      <AdminLayout>
        <ProjectsPage />
      </AdminLayout>
    ),
    guards: ["auth"],
  },
];
```

### Step 8: Create Public API

```typescript
// src/features/projects/index.ts
export { projectsRoutes } from "./routes";
export { ProjectList } from "./components/project-list";
export {
  projectsApi,
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
} from "./api/projects-api";
export type { Project, ProjectFilters, ProjectListResponse } from "./types";
```

### Step 9: Register Routes

```typescript
// src/app/routing/routes.tsx
import type { AppRoute } from "./types";
import { homeRoutes } from "@/features/home";
import { authRoutes } from "@/features/auth";
import { projectsRoutes } from "@/features/projects"; // ✅ Add import

export const appRoutes: AppRoute[] = [
  ...homeRoutes,
  ...authRoutes,
  ...projectsRoutes, // ✅ Add routes
];
```

### Step 10: Create Page

```bash
# Create page structure
mkdir -p src/pages/projects
touch src/pages/projects/index.tsx
touch src/pages/projects/projects.module.scss
```

```typescript
// src/pages/projects/index.tsx
import type { FC } from "react";
import { ProjectList } from "@/features/projects";
import styles from "./projects.module.scss";

export const ProjectsPage: FC = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Projects</h1>
      <ProjectList />
    </div>
  );
};
```

```scss
// src/pages/projects/projects.module.scss
.pageContainer {
  padding: 24px;
}

.title {
  margin-bottom: 24px;
  font-size: 32px;
  font-weight: bold;
}
```

### Step 11: Add Tests

```typescript
// src/features/projects/tests/projects-api.test.ts
import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGetProjectsQuery } from "../api/projects-api";
import { wrapper } from "@/test/utils/render-with-providers";

describe("useGetProjectsQuery", () => {
  it("should fetch projects successfully", async () => {
    const { result } = renderHook(() => useGetProjectsQuery({}), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.projects).toBeDefined();
  });
});
```

```typescript
// src/features/projects/components/project-list/ProjectList.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils/render-with-providers";
import { ProjectList } from "./ProjectList";

describe("ProjectList", () => {
  it("should render project cards", async () => {
    render(<ProjectList />);

    expect(await screen.findByText("Project 1")).toBeInTheDocument();
  });

  it("should display loading state", () => {
    render(<ProjectList />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
```

### Step 12: Add Navigation (Optional)

If the feature needs to be linked from elsewhere:

```typescript
// In AppHeader or Navigation component
import { Link } from "react-router-dom";

<Menu>
  <Menu.Item key="projects">
    <Link to="/projects">Projects</Link>
  </Menu.Item>
</Menu>
```

### Step 13: Verify and Test

```bash
# Type check
npm run type-check

# Run tests
npm run test:run

# Build
npm run build

# Start dev server and test manually
npm run dev
```

## Common Feature Patterns

### Pattern 1: List + Detail

```text
/projects          → List view
/projects/:id      → Detail view
```

```typescript
export const projectsRoutes: AppRoute[] = [
  {
    path: "/projects",
    element: <AdminLayout><ProjectsListPage /></AdminLayout>,
    guards: ["auth"],
  },
  {
    path: "/projects/:id",
    element: <AdminLayout><ProjectDetailPage /></AdminLayout>,
    guards: ["auth"],
  },
];
```

### Pattern 2: Create/Edit Flow

```typescript
// Mutation
const [createProject] = useCreateProjectMutation();

const handleSubmit = async (values: ProjectFormValues) => {
  try {
    await createProject(values).unwrap();
    message.success("Project created");
    navigate("/projects");
  } catch (error) {
    message.error("Failed to create project");
  }
};
```

### Pattern 3: Filtering and Search

```typescript
const [filters, setFilters] = useState<ProjectFilters>({});
const { data } = useGetProjectsQuery(filters);

<Input.Search onSearch={(value) => setFilters({ search: value })} />
<Select onChange={(value) => setFilters({ status: value })} />
```

## Checklist

Before marking a feature complete:

- [ ] Feature structure created
- [ ] Types defined
- [ ] API integration implemented
- [ ] Components created with styles
- [ ] Routes defined and registered
- [ ] Page created
- [ ] Public API exported
- [ ] Tests added
- [ ] Manual testing complete
- [ ] Type check passes
- [ ] Build succeeds
- [ ] Documentation updated (if needed)

## Troubleshooting

### Route Not Found

- Check route is registered in `app/routing/routes.tsx`
- Verify path spelling
- Ensure feature exports routes in `index.ts`

### Type Errors

- Verify types are exported from feature public API
- Check Redux store includes feature reducer
- Ensure RTK Query types match API response

### API Not Working

- Check `baseApi` configuration in `app/api/base-api.ts`
- Verify endpoint URL is correct
- Check auth headers are included
- Test API endpoint separately (Postman, curl)

### Tests Failing

- Use `render-with-providers` for components with Redux/Router
- Mock API responses with MSW handlers
- Ensure test data matches types

## Related Documentation

- **[Folder Structure](../architecture/folder-structure.md)** - Where to place files
- **[Routing](../architecture/routing.md)** - Route patterns
- **[State Management](../architecture/state-management.md)** - Redux + RTK Query
- **[Conventions](../development/conventions.md)** - Naming and organization
- **[Testing](../development/testing.md)** - Testing strategy

## Summary

The feature workflow is:

1. **Plan** - Define purpose, routes, API, state needs
2. **Structure** - Create feature folders
3. **Types** - Define TypeScript interfaces
4. **API** - Create RTK Query endpoints
5. **Components** - Build UI with styles
6. **Hooks** - Extract complex logic (optional)
7. **Routes** - Define feature routes
8. **Public API** - Export feature interface
9. **Register** - Add to central route list
10. **Page** - Create route entry point
11. **Tests** - Add test coverage
12. **Navigation** - Link from other features (optional)
13. **Verify** - Test and validate

This workflow ensures features are:

- ✅ Self-contained
- ✅ Type-safe
- ✅ Testable
- ✅ Maintainable
- ✅ Consistent with project architecture
