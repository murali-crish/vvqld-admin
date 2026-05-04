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

    if (err) {
      console.error('Error fetching groups:', err)
      error.value = 'Failed to load groups'
      return
    }

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
    const { error: err } = await supabase
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

    if (err) {
      console.error('Error creating event:', err)
      error.value = err.message || 'Failed to create event'
      return
    }

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
  <section class="event-creator">
    <div class="event-creator__card">
      <div class="event-creator__header">
        <h2>Create New Event</h2>
        <p>Set up a test or operational event for a specific group.</p>
      </div>

      <div class="event-creator__form">
        <div class="event-creator__field">
          <label for="group">Group</label>
        <Select
          v-model="selectedGroup"
          :options="groups"
          optionLabel="group_name"
          placeholder="Select a Group"
          class="event-creator__input"
          id="group"
        />
      </div>

        <div class="event-creator__field">
          <label for="start">Start Time</label>
        <DatePicker
          v-model="startTime"
          showTime
          hourFormat="24"
          class="event-creator__input"
          id="start"
        />
      </div>

        <div class="event-creator__field">
          <label for="end">End Time</label>
        <DatePicker
          v-model="endTime"
          showTime
          hourFormat="24"
          class="event-creator__input"
          id="end"
        />
      </div>

        <Button
          label="Create Event"
          @click="createEvent"
          :loading="loading"
          class="event-creator__button"
        />

        <Message v-if="error" severity="error">{{ error }}</Message>
        <Message v-if="success" severity="success">{{ success }}</Message>
      </div>
    </div>
  </section>
</template>

<style scoped>
.event-creator {
  width: 100%;
}

.event-creator__card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 44rem;
  padding: 1.5rem;
  border: 1px solid #dbe2ef;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.event-creator__header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 800;
}

.event-creator__header p {
  margin: 0.4rem 0 0;
  color: #475569;
}

.event-creator__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-creator__field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.event-creator__field label {
  color: #334155;
  font-weight: 700;
}

:deep(.event-creator__input) {
  width: 100%;
}

.event-creator__button {
  align-self: flex-start;
}
</style>
