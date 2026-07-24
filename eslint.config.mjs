import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Sobrescribe la configuración de archivos ignorados por defecto en eslint-config-next.
  globalIgnores([
    // Patrones de archivos y carpetas ignorados por defecto:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
