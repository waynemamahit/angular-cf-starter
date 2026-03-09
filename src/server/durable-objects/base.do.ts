import type { DurableObject } from "cloudflare:workers";

// Dynamic import with fallback for non-Cloudflare environments (e.g., Angular build route extraction in Node.js)
export const { DurableObject: DurableObjectBase } = await import(
  "cloudflare:workers"
).catch(() => ({ DurableObject: class { } as unknown as typeof DurableObject }));