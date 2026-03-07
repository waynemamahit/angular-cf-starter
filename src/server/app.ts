import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

interface Bindings {
  MY_VARIABLE: string;
};

const app = new Hono<{ Bindings: Bindings }>();

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

export default app;
