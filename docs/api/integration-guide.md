# API Integration Guide

This document outlines the RTK Query APIs created for frontend-backend integration.

## Status

**Current State:** RTK Query infrastructure is ready, but backend endpoints are not yet implemented.  
**Action Required:** Backend team needs to implement these REST endpoints.

## Base Configuration

- **Base URL:** Configured in `src/config/env.ts` via `VITE_API_BASE_URL`
- **Authentication:** Bearer token in `Authorization` header
- **Content-Type:** `application/json`

## Projects API

**File:** `src/features/projects/api/projects-api.ts`

### Endpoints

#### GET /projects

Get paginated list of projects.

**Query Params:**

- `page` (number, default: 1)
- `limit` (number, default: 10)

**Response:**

```json
{
  "projects": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "status": "active" | "completed" | "on-hold" | "planning",
      "priority": "high" | "medium" | "low",
      "client": "string",
      "description": "string",
      "storiesCount": "number",
      "completedStories": "number",
      "teamMembers": "number",
      "dueDate": "ISO 8601 string",
      "lastUpdated": "ISO 8601 string"
    }
  ],
  "total": "number"
}
```

#### GET /projects/:id

Get single project by ID.

**Response:** Single `ProjectSummary` object

#### GET /dashboard/stats

Get dashboard statistics.

**Response:**

```json
{
  "stats": {
    "totalProjects": "number",
    "activeProjects": "number",
    "completedStories": "number",
    "totalStories": "number"
  }
}
```

#### POST /projects

Create new project.

**Request Body:**

```json
{
  "name": "string",
  "code": "string",
  "client": "string",
  "description": "string",
  "priority": "high" | "medium" | "low",
  "dueDate": "ISO 8601 string"
}
```

**Response:**

```json
{
  "project": "ProjectSummary object",
  "message": "string"
}
```

#### PATCH /projects/:id

Update project.

**Request Body:** Partial `ProjectSummary` object

**Response:** Updated `ProjectSummary` object

#### DELETE /projects/:id

Delete project.

**Response:**

```json
{
  "message": "string"
}
```

---

## Stories API

**File:** `src/features/backlog/api/stories-api.ts`

### Endpoints

#### GET /stories

Get filtered stories list.

**Query Params:**

- `search` (string, optional)
- `projectId` (string, optional)
- `priority` (string, optional)
- `assignee` (string, optional)

**Response:**

```json
{
  "stories": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "acceptanceCriteria": ["string"],
      "status": "backlog" | "ready" | "in-progress" | "review" | "done",
      "priority": "high" | "medium" | "low",
      "storyPoints": "number (optional)",
      "assignee": "string (optional)",
      "projectId": "string",
      "projectName": "string",
      "createdAt": "ISO 8601 string",
      "updatedAt": "ISO 8601 string"
    }
  ],
  "total": "number"
}
```

#### GET /stories/backlog

Get stories grouped by status (for backlog board).

**Query Params:**

- `projectId` (string, optional)

**Response:** Same as GET /stories

#### GET /stories/:id

Get single story by ID.

**Response:** Single `Story` object

#### POST /stories

Create new story.

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "acceptanceCriteria": ["string"],
  "priority": "high" | "medium" | "low",
  "projectId": "string",
  "storyPoints": "number (optional)",
  "assignee": "string (optional)"
}
```

**Response:** Created `Story` object

#### PATCH /stories/:id

Update story.

**Request Body:** Partial `Story` object

**Response:** Updated `Story` object

#### PATCH /stories/:id/move

Move story to different status (optimistic update for drag-and-drop).

**Request Body:**

```json
{
  "status": "backlog" | "ready" | "in-progress" | "review" | "done"
}
```

**Response:** Updated `Story` object

#### DELETE /stories/:id

Delete story.

**Response:**

```json
{
  "message": "string"
}
```

#### POST /stories/export

Export stories as CSV or Excel.

**Query Params:**

- `projectId` (string, optional)
- `format` ("csv" | "excel")

**Response:** Binary file (Blob)

---

## Settings/User API

**File:** `src/features/settings/api/settings-rtk-api.ts`

### Endpoints

#### GET /user/profile

Get user profile.

**Response:**

```json
{
  "email": "string",
  "displayName": "string",
  "role": "admin" | "viewer",
  "avatar": "string (optional)",
  "createdAt": "ISO 8601 string"
}
```

#### PATCH /user/profile

Update user profile.

**Request Body:**

```json
{
  "displayName": "string (optional)",
  "avatar": "string (optional)"
}
```

**Response:** Updated profile object

#### POST /user/password

Change user password.

**Request Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**

```json
{
  "message": "string"
}
```

#### GET /user/preferences

Get user preferences.

**Response:**

```json
{
  "theme": "light" | "dark" | "auto",
  "notifications": {
    "email": "boolean",
    "push": "boolean"
  },
  "language": "string"
}
```

#### PATCH /user/preferences

Update user preferences.

**Request Body:** Partial preferences object

**Response:** Updated preferences object

#### POST /user/avatar

Upload avatar image.

**Request Body:** FormData with image file

**Response:**

```json
{
  "avatarUrl": "string"
}
```

---

## Error Handling

All endpoints should return consistent error responses:

**Format:**

```json
{
  "message": "Human-readable error message"
}
```

**Status Codes:**

- `400` Bad Request - Invalid input
- `401` Unauthorized - Missing or invalid token
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource doesn't exist
- `409` Conflict - Duplicate resource
- `422` Unprocessable Entity - Validation failed
- `500` Internal Server Error - Server error

The frontend automatically handles these via `baseQuery` in `src/app/api/base-api.ts`.

---

## Authentication

All requests (except auth endpoints) include:

```
Authorization: Bearer <token>
```

Token is retrieved from localStorage key defined in `src/resources/config/auth.ts`.

**TODO (Phase 2 Security):** Move JWT to httpOnly cookies instead of localStorage.

---

## Cache Invalidation

RTK Query automatically manages cache invalidation using tags:

- **Projects**: Invalidates `Projects` list and `DashboardStats`
- **Stories**: Invalidates `Stories` list, `Backlog`, and `DashboardStats`
- **Settings**: Invalidates `UserProfile` and `UserPreferences`

Backend doesn't need to handle cache headers - RTK Query manages this client-side.

---

## Optimistic Updates

The following mutations use optimistic updates for better UX:

- **Move Story** (`PATCH /stories/:id/move`): Updates UI immediately, rolls back on error

Backend should respond quickly (<200ms) for best experience.

---

## Migration Path

### Phase 1: API Infrastructure ✅ COMPLETE

- Created RTK Query endpoints
- Updated hooks to use queries/mutations
- Added proper TypeScript types

### Phase 2: Backend Implementation (CURRENT)

Backend team needs to implement endpoints as documented above.

### Phase 3: Remove Mock Data

Once backend is ready:

1. Remove mock data files (`src/features/*/api/*-data.ts`)
2. Remove fallback logic in hooks
3. Test error scenarios
4. Add loading skeletons where needed

### Phase 4: Testing

1. Integration tests with real API
2. Error scenario testing
3. Loading state testing
4. Optimistic update testing

---

## Development Mode

**With Backend:**
Set `VITE_API_BASE_URL=http://localhost:8000/api` in `.env`

**Without Backend (Mock):**

- RTK Query queries will fail
- Add MSW (Mock Service Worker) handlers
- Or keep mock data functions as fallback

---

## Questions?

Contact frontend team for clarification on:

- Response shape/structure
- Required fields vs optional
- Validation rules
- Performance requirements
