import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import app from './server/app';
import { Counter } from './server/durable-objects/counter.do';

const angularApp = new AngularAppEngine();

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

export { Counter };

