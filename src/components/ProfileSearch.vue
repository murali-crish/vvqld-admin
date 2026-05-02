<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'

const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)
const profiles = ref([])

const searchProfiles = async () => {
  if (!searchQuery.value.trim()) {
    error.value = 'Please enter a name, email, or phone number to search.'
    return
  }

  loading.value = true
  error.value = null
  profiles.value = []

  const query = searchQuery.value.trim()

  try {
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(50)

    if (err) throw err

    if (data && data.length > 0) {
      profiles.value = data
    } else {
      error.value = 'No profiles found matching your search.'
    }
  } catch (err) {
    console.error('Error searching profiles:', err)
    error.value = err.message || 'Failed to search profiles.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="profile-search w-full">
    <!-- Banner -->
    <div class="w-full bg-blue-100 rounded-lg p-8 mb-8 text-center" style="background-image: url('https://placehold.co/1200x200'); background-size: cover; background-position: center;">
      <h2 class="text-3xl font-bold text-white bg-black bg-opacity-50 inline-block p-4 rounded">Search Profiles</h2>
    </div>

    <div class="max-w-4xl mx-auto flex flex-col gap-6 p-4 shadow-lg rounded-xl bg-white">
      <div class="flex gap-4 items-center">
        <InputText
          v-model="searchQuery"
          placeholder="Search by name, email or phone..."
          class="flex-1 text-lg p-3"
          @keyup.enter="searchProfiles"
        />
        <Button
          label="Search"
          icon="pi pi-search"
          @click="searchProfiles"
          :loading="loading"
          size="large"
        />
      </div>

      <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

      <div v-if="profiles.length > 0" class="flex flex-col gap-4">
        <h3 class="text-xl font-semibold border-b pb-2">Results ({{ profiles.length }})</h3>

        <div v-for="profile in profiles" :key="profile.id" class="p-4 border rounded-lg hover:shadow-md transition-shadow">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Name</p>
              <p class="font-medium text-lg">{{ profile.first_name }} {{ profile.last_name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Role</p>
              <p class="font-medium">{{ profile.role || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="font-medium">{{ profile.email || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Phone</p>
              <p class="font-medium">{{ profile.phone || 'N/A' }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm text-gray-500">ID</p>
              <p class="font-mono text-sm break-all">{{ profile.id }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
