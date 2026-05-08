# Coding Conventions

To maintain a high-quality, enterprise-grade codebase, we enforce the following standards:

## 1. TypeScript Strictness
- `any` is strictly prohibited. Define proper interfaces in `src/types/`.
- Enable `strict: true` in `tsconfig.json`.

## 2. Naming Conventions
- **Files & Folders:** `kebab-case` (e.g., `resource-card.tsx`, `use-search.ts`).
- **Components:** `PascalCase` (e.g., `ResourceCard`).
- **Variables/Functions:** `camelCase` (e.g., `fetchDriveFiles`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_PAGINATION_LIMIT`).

## 3. Avoid Hardcoding (No Magic Strings/Numbers)
- Store configuration values in `src/lib/constants.ts` or `.env`.

**Bad:**
```ts
if (role === 'admin' && status === 1) { ... }
```

**Good:**
```ts
import { USER_ROLES, STATUS_ACTIVE } from '@/lib/constants';
if (role === USER_ROLES.ADMIN && status === STATUS_ACTIVE) { ... }
```

## 4. API Response Standardization
All API routes must return a standardized JSON structure:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```
