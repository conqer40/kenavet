import { defineConfig, globalIgnores } from 'eslint/config';
import next from 'eslint-config-next/core-web-vitals';
import ts from 'eslint-config-next/typescript';
export default defineConfig([...next, ...ts, globalIgnores(['.next/**', 'android/**', '.next-package/**', 'node_modules/next-incomplete/**']), {rules:{'react-hooks/set-state-in-effect':'off','@typescript-eslint/no-explicit-any':'off','@next/next/no-assign-module-variable':'off'}}]);
