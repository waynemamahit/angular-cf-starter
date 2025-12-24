import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';

type Bindings = {
  MY_VARIABLE: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const angularApp = new AngularAppEngine();

// Logger middleware - logs all requests
app.use('*', logger());

// Secure Headers middleware - adds security headers
app.use('*', secureHeaders());

// CORS middleware - configure allowed origins
app.use('*', cors());

// CSRF Protection middleware - protect against CSRF attacks
app.use('*', csrf());

// API routes example
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Angular SSR handler - handle all other routes
app.all('*', async (c) => {
  const req = c.req.raw;
  const res = await angularApp.handle(req);
  return res ?? new Response('Page not found.', { status: 404 });
});

/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(async (req) => {
  const url = new URL(req.url);

  if (url.pathname.startsWith('/api/')) {
    return app.fetch(req);
  }

  const res = await angularApp.handle(req);
  return res ?? new Response('Page not found.', { status: 404 });
});

export default {
  fetch: app.fetch,
};
