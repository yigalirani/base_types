import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { defineConfig, globalIgnores } from "eslint/config";
console.log('import.meta.dirname',import.meta.dirname)
export default defineConfig(
  globalIgnores(["**/dist/", "**/types/",'**/node_modules/']),
  eslint.configs.recommended, //taking all rules from eslint, truning select ones off below
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
);