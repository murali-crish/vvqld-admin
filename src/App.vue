<script setup>
import ProfileSearch from './components/ProfileSearch.vue'
import EventCreator from './components/EventCreator.vue'
</script>

<template>
  <header class="p-4 bg-gray-100 border-b">
    <div class="max-w-7xl mx-auto flex items-center gap-4">
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="40" height="40" />
      <h1 class="text-2xl font-bold text-gray-800">BSK Admin Dashboard</h1>
    </div>
  </header>

  <main class="p-8">
    <div class="max-w-7xl mx-auto">
      <ProfileSearch />
      <EventCreator />
    </div>
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #f9fafb;
}
</style>
