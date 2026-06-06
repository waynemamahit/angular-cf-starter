import { Hono } from 'hono';
import { rateLimiter } from "hono-rate-limiter";
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

// Rate Limiter middleware - protect against abuse
app.use(
  rateLimiter<{ Bindings: Env }>({
    binding: (c) => c.env.LONG_RATE_LIMITER,
    keyGenerator: (c) => c.req.header("cf-connecting-ip") ?? "",
  }),
);

// API routes example
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
