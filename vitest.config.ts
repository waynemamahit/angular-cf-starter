// Learn more about Vitest configuration options at https://vitest.dev/config/
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      instances: [{ browser: 'chromium' }]
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "coverage/",
        "dist/",
        "e2e/",
      ],
    },
    globals: true,
    environment: "jsdom",
  },
});
