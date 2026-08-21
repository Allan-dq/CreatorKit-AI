import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
const root=path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({resolve:{alias:{"@":root}},test:{environment:"jsdom",setupFiles:["./tests/setup.ts"],include:["tests/**/*.test.{ts,tsx}"],coverage:{provider:"v8",reporter:["text","json-summary"],include:["packages/**/*.ts","packages/**/*.tsx"]}}});
