import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  // Prettier
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // Tailwind CSS
  // (Removed) Tailwind CSS plugin is incompatible with Tailwind v4

  // Ignore Next.js build artifacts
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
