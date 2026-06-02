# OptiFlow Frontend

Vite + React + TypeScript SPA.

## Setup

```bash
npm install
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Type-check + production build
npm run type-check # TypeScript only (no build)
```

## API Integration

The Vite dev server proxies `/api` requests to `http://localhost:8000` (configured in `vite.config.ts`).

Use the typed API client at `src/lib/api/client.ts` to make backend calls:

```typescript
import { api } from "@/lib/api/client";

const machines = await api.get<MachineResponse[]>(`/api/v1/orgs/${orgId}/machines`);
```

## Structure

- `src/App.tsx` — Routes and app shell (currently uses mock user data)
- `src/components/` — All UI components (currently using mock data from `src/types/index.ts`)
- `src/lib/api/` — API client and Zod schemas (skeleton, extend per slice)
- `src/lib/auth/` — JWT token helpers (implemented)
- `src/types/index.ts` — TypeScript interfaces and mock data (replace with API calls)
