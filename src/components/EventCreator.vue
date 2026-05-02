<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import Message from 'primevue/message'

const groups = ref([])
const selectedGroup = ref(null)
const startTime = ref(new Date())
const endTime = ref(new Date(new Date().getTime() + 45 * 60000))
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const fetchGroups = async () => {
  try {
    const { data, error: err } = await supabase
      .from('lookup_groups')
      .select('id, group_name')
      .order('id')

    if (err) throw err
    groups.value = data || []
  } catch (err) {
    console.error('Error fetching groups:', err)
    error.value = 'Failed to load groups'
  }
}

const createEvent = async () => {
  if (!selectedGroup.value) {
    error.value = 'Please select a group'
    return
  }

  loading.value = true
  error.value = null
  success.value = null

  try {
    const { data, error: err } = await supabase
      .from('events')
      .insert([
        {
          title: "Test Event",
          group_id: selectedGroup.value.id,
          category: 'Class',
          start_time: startTime.value.toISOString(),
          end_time: endTime.value.toISOString(),
        }
      ])

    if (err) throw err

    success.value = 'Event created successfully!'
    // Reset defaults
    startTime.value = new Date()
    endTime.value = new Date(new Date().getTime() + 45 * 60000)
    selectedGroup.value = null
  } catch (err) {
    console.error('Error creating event:', err)
    error.value = err.message || 'Failed to create event'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGroups()
})
</script>

<template>
  <div class="event-creator p-4 shadow rounded-lg bg-white">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Create New Event</h2>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="group" class="font-medium">Group</label>
        <Select
          v-model="selectedGroup"
          :options="groups"
          optionLabel="group_name"
          placeholder="Select a Group"
          class="w-full"
          id="group"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="start" class="font-medium">Start Time</label>
        <DatePicker
          v-model="startTime"
          showTime
          hourFormat="24"
          class="w-full"
          id="start"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="end" class="font-medium">End Time</label>
        <DatePicker
          v-model="endTime"
          showTime
          hourFormat="24"
          class="w-full"
          id="end"
        />
      </div>

      <Button
        label="Create Event"
        @click="createEvent"
        :loading="loading"
        class="mt-2"
      />

      <Message v-if="error" severity="error">{{ error }}</Message>
      <Message v-if="success" severity="success">{{ success }}</Message>
    </div>
  </div>
</template>

<style scoped>
.event-creator {
  max-width: 500px;
  margin: 0 auto;
}
</style>
