<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import HeaderSearch from './components/HeaderSearch.vue'

const route = useRoute()

const pageTitle = computed(() => {
  if (route.name === 'events') {
    return 'Event Management'
  }

  return 'Profile Management'
})
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <img alt="Vue logo" class="sidebar__logo" src="./assets/logo.svg" />
        <div>
          <p class="sidebar__eyebrow">Vidyaa Vihaar</p>
          <span class="sidebar__title">BSK Admin</span>
        </div>
      </div>

      <nav class="sidebar__nav">
        <RouterLink
          to="/profiles"
          class="sidebar__link"
        >
          <i class="pi pi-users"></i>
          Profiles
        </RouterLink>

        <RouterLink
          to="/events"
          class="sidebar__link"
        >
          <i class="pi pi-calendar"></i>
          Events
        </RouterLink>
      </nav>
    </aside>

    <div class="main-shell">
      <header class="app-header">
        <div class="app-banner">
          <p class="app-banner__eyebrow">Command Center</p>
          <div class="app-banner__content">
            <div>
              <h1 class="app-banner__title">{{ pageTitle }}</h1>
              <p class="app-banner__subtitle">
                Switch between profile lookup and event operations from the same admin workspace.
              </p>
            </div>

            <div class="app-banner__status">
              <span class="status-dot"></span>
              Live Status
            </div>
          </div>
        </div>

        <div class="app-toolbar">
          <div class="app-toolbar__copy">
            <h2>{{ route.name === 'events' ? 'EventCreator' : 'Profile of person' }}</h2>
            <p>Use the menu on the left to change views. The header stays available across pages.</p>
          </div>

          <div class="app-toolbar__search">
            <HeaderSearch />
          </div>
        </div>
      </header>

      <main class="app-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;
  background: #eef3fb;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1rem;
  background: linear-gradient(180deg, #0f172a 0%, #172554 100%);
  color: #e2e8f0;
  box-shadow: 6px 0 24px rgba(15, 23, 42, 0.18);
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
}

.sidebar__logo {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.35rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
}

.sidebar__eyebrow {
  margin: 0;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #93c5fd;
}

.sidebar__title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.95rem 1rem;
  border-radius: 14px;
  color: #dbeafe;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.sidebar__link:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  transform: translateX(2px);
}

.sidebar__link.router-link-active {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.35);
}

.main-shell {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 1.5rem 1rem;
  background: rgba(238, 243, 251, 0.96);
  backdrop-filter: blur(12px);
}

.app-banner {
  width: 100%;
  padding: 1.5rem 1.75rem;
  border-radius: 24px;
  background: linear-gradient(135deg, #1d4ed8 0%, #4f46e5 55%, #7c3aed 100%);
  color: #ffffff;
  box-shadow: 0 18px 40px rgba(79, 70, 229, 0.22);
}

.app-banner__eyebrow {
  margin: 0 0 0.75rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(224, 231, 255, 0.92);
}

.app-banner__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.app-banner__title {
  margin: 0;
  font-size: clamp(1.8rem, 2vw, 2.4rem);
  font-weight: 800;
}

.app-banner__subtitle {
  margin: 0.45rem 0 0;
  max-width: 52rem;
  color: rgba(224, 231, 255, 0.92);
}

.app-banner__status {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-weight: 700;
  white-space: nowrap;
}

.status-dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 6px rgba(74, 222, 128, 0.18);
}

.app-toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.app-toolbar__copy h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.25rem;
  font-weight: 700;
}

.app-toolbar__copy p {
  margin: 0.35rem 0 0;
  color: #475569;
}

.app-toolbar__search {
  flex: 0 1 24rem;
  width: min(100%, 24rem);
}

.app-content {
  min-width: 0;
  padding: 0 1.5rem 1.5rem;
}

@media (max-width: 960px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    gap: 1rem;
    padding-bottom: 1rem;
  }

  .sidebar__nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .app-banner__content,
  .app-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .app-toolbar__search {
    width: 100%;
    max-width: 100%;
  }
}
</style>
