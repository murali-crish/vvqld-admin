## Project Context
Build a centralized Admin "Command Center" for the **Vidyaa Vihaar (BSK)** system. This portal manages the **Universal Profile** ecosystem, student enrollments, and real-time attendance monitoring for the QR-based scanning app.

**Tech Stack:** Vue 3 (Composition API), Vite, PrimeVue, Supabase.

## 1. Core Data Directives
*   **Single Source of Truth:** All operations must target the `profiles` table. Use the `role` and `status` columns to differentiate between Students, Teachers, and Volunteers.
*   **Scan Integrity:** The `scan_log` table is append-only. Never allow the Admin UI to delete or edit a `scan_log` entry, except through the "Cleanup" utility (see Tools).
*   **Privacy:** Ensure **RLS (Row Level Security)** is respected. Admin actions should be performed via a service role or a high-privileged `admin` auth role.

## 2. Feature Specifications

### A. Profile Search & Management
*   **Search Engine:** Implement a global search across `first_name`, `last_name`, `email`, and `phone`. (Status: Basic Search implemented in `ProfileSearch.vue`).
*   **Universal Profile View:** A slide-over or modal showing the user's full history, assigned classes, and QR code status.

### B. Student Admissions
*   **Workflow:** UI to move profiles from `pending` or `prospect` status to `active_student`.
*   **Class Assignment:** Dropdown to link a student profile to a specific `group_id` (from `lookup_groups`) or `grade_level`.

### C. Class & Resource Allocation
*   **The Grid:** A view of all active classes/groups.
*   **Assigner:** UI to assign **Teachers** and **Volunteers** to specific groups or school wings.

### D. Real-Time Monitor (The "War Room")
*   **Live Stream:** A PrimeVue `DataTable` or `Timeline` component that listens to `INSERT` events on the `scan_log` table via Supabase Realtime.
*   **Visual Cues:** Flash green for successful scans, red for failures (e.g., "Already Scanned" or "Invalid Profile").

### E. Attendance Analytics
*   **Hierarchical Filters:** View attendance data filtered by:
    1.  **Date Range**
    2.  **Group** (e.g., Level 1, Level 2 via `lookup_groups`)
    3.  **Event Type** (from `events` table)
*   **Aggregation:** Display "Total Present vs. Total Enrolled" percentages for the selected group.

## 3. System Admin Tools
*   **Test Event Generator:**
    *   Create entries in the `events` table. (Status: `EventCreator.vue` implemented for manual entry).
    *   *Requirement:* Ensure test events are marked with an `is_test: true` flag.
    *   Ability to simulate bulk scans to verify dashboard load performance.
*   **Cleanup Utility:**
    *   A "Purge Test Data" button that executes a Supabase RPC to delete all `scan_log` and `event` entries where `is_test = true`.

## 4. UI/UX Guidelines (PrimeVue)
*   **Layout:** Sidebar navigation with a "Live Status" indicator in the top header.
*   **Components:**
    *   `DataTable` for all lists (enable `removableSort` and `filterDisplay="menu"`).
    *   `Toast` notifications for every database write action.
    *   `Skeleton` loaders for initial Supabase fetches.
*   **Theme:** Aura theme with Blue/Indigo palette.

## 5. Development Steps for Agent
1.  **Phase 1:** Setup Supabase Client and Auth (Status: Client configured in `supabase.js`).
2.  **Phase 2:** Profile Search and Event Management (Status: `ProfileSearch.vue` and `EventCreator.vue` functional).
3.  **Phase 3:** Create Dashboard Layout with Sidebar and integrate existing components into `App.vue`.
4.  **Phase 4:** Implement Real-time `scan_log` subscription for the "War Room".
5.  **Phase 5:** Build Class/Group Allocation logic and Analytics views.
6.  **Phase 6:** Refine Test/Cleanup tools (Add `is_test` support).
