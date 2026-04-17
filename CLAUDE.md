# vvqld-admin (BSK Admin Dashboard)

## Project Overview
Centralized admin dashboard for school administrators and lead teachers. Eliminates manual SQL/Dashboard work for event management, attendance auditing, and system configuration.

## Stack
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build:** Vite
- **State:** Pinia
- **UI:** PrimeVue 4 with Aura theme (`@primeuix/themes/aura`)
- **Icons:** PrimeIcons
- **Backend:** Supabase JS client (no custom API layer)

## Commands
```sh
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
```

## Path Aliases
- `@` → `./src`

## Architecture
- `src/main.js` — app entry, registers Pinia + PrimeVue
- `src/App.vue` — root component
- `src/supabase.js` — Supabase client
- `src/components/` — Vue components
- Pinia stores for `auth`, `activeEvents`, and `lookups` — **planned, not yet created**

## Implemented Components
- `src/components/EventCreator.vue` — only non-scaffold component currently in place

## Planned Modules (not yet implemented)
- **Event Management:** test event creation, schedule generation, festival overrides
- **Attendance Intelligence:** real-time roll view, presence inheritance, admin overrides
- **Membership & Relations:** family map (profile_relations), role management

## Backend / Supabase Rules
- **DML only** — no DDL. All schema changes go through Supabase CLI migrations in the backend repo.
- Auth via Supabase Auth; permissions enforced via PostgreSQL RLS on `profiles.role`.
- Environment is controlled via `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: `.env` targets UAT, `.env.production` targets PROD.
- `is_test: true` marks test data; Developer Mode toggle wipes all test data. **Never invoke the wipe operation without explicit user confirmation — it is irreversible within the session.**

## UI Standards
- Use PrimeVue `DataTable` with global filtering for high-density data views.
- Target usability on a laptop (admin desk); not mobile-first.
- Minimize redundant API calls via Pinia stores.
