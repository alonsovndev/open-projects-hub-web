/**
 * Mock Service Worker handlers for API mocking
 * Add handlers here when you need to mock API responses in tests
 */

import type { RequestHandler } from "msw";

// Example:
// import { http, HttpResponse } from 'msw';
//
// export const handlers = [
//   http.get('/api/user', () => {
//     return HttpResponse.json({ id: '1', name: 'Test User' });
//   }),
// ];

export const handlers: RequestHandler[] = [];
