# BSK Admin Dashboard – Project Context
## 1. Role & Scope
   * **Purpose:** Centralized "Command Center" for school administrators and lead teachers. 
   * **Stack:** Vue 3 (Vite), Pinia (State), PrimeVue (UI Components), Supabase JS Client. 
   * **Primary Goal:** Eliminate manual SQL/Dashboard intervention for event management, attendance auditing, and system configuration.

## 2. Core Modules & Logic
### Event Management (Current Priority)
   * **Test Event Creator:** Ability to instantly generate `events` with `is_test: true` for the 3:15 PM Scripture/Language transition testing. 
   * **Schedule Generator:** Logic to parse `event_templates` and bulk-insert `events` for a specific Term/Date range. 
   * **Festival Override:** Functionality to swap a "Language" group event for a "Festival" event while maintaining the same `group_id` for attendance tracking.

### Attendance Intelligence
* **The "Roll" View:** A real-time monitoring dashboard showing "Expected" vs. "Present" students. 
* **Inheritance Visualization:** Must distinguish between Verified Presence (Solid Green) and Inherited Presence (Light Green) from back-to-back classes. 
* **Override Tools:** Ability for Admin to manually toggle attendance status or "Clear" test data for re-scanning.

### Membership & Relations
* **The Family Map:** UI to link `profiles` via `profile_relations` (Parent-Child) and assign them to `lookup_groups`. 
* **Role Management:** Admin-only permission to flip `role` tags (TEACHER, PARENT) and `is_active` status.

## 3. Backend Integration (Supabase)
   * **Client:** Uses `supabase-js`. No custom API layer. 
   * **Security:** Authenticated via Supabase Auth. Permissions are enforced via PostgreSQL RLS based on the `profiles.role` column. 
   * **Environment:** Points to the `UAT` project during dev and `PROD` for the May 3rd release.

## 4. UI/UX Standards
   * **Performance:** Focus on high-density data tables (PrimeVue `DataTable`) with global filtering. 
   * **Responsiveness:** Must be usable on a laptop at the school hall (admin desk). 
   * **State:** Pinia stores for `auth`, `activeEvents`, and `lookups` to minimize redundant API calls.

## 5. Development Constraints
   * **No Direct Schema Changes:** The Dashboard only performs DML (Data Manipulation). All DDL (Table changes) must be done via Supabase CLI migrations in the backend repo. 
   * **Cleanup:** Include a "Developer Mode" toggle to wipe all data where `is_test = true`.