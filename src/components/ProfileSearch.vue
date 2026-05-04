<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../supabase'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'

const route = useRoute()
const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)
const profiles = ref([])

const searchProfiles = async (queryParam = null) => {
  const query = typeof queryParam === 'string' ? queryParam : searchQuery.value.trim()

  if (!query) {
    profiles.value = []
    error.value = 'Please enter a name, email, or phone number to search.'
    return
  }

  loading.value = true
  error.value = null
  profiles.value = []

  // If not passed explicitly, sync back to input
  if (!queryParam) {
    searchQuery.value = query
  }

  try {
    let supabaseQuery = supabase.from('profiles').select('*').limit(50)

    // Check if it's likely a UUID (from the header search redirect)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(query)) {
       supabaseQuery = supabaseQuery.eq('id', query)
    } else {
       supabaseQuery = supabaseQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    }

    const { data, error: err } = await supabaseQuery

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

// Watch for changes in the URL query parameter 'q'
// This handles cases where a user selects a profile from the global header search
watch(() => route.query.q, (newQ) => {
  if (newQ) {
    // Clear local input when driven by global search ID
    searchQuery.value = ''
    searchProfiles(newQ)
  }
})

onMounted(() => {
  if (route.query.q) {
    searchProfiles(route.query.q)
  }
})

</script>

<template>
  <section class="profile-search">
    <div class="profile-search__card">
      <div class="profile-search__intro">
        <div>
          <h2>Search profiles</h2>
          <p>Find a person by name, email, phone number, or by selecting a result from the header phone search.</p>
        </div>
      </div>

      <div class="profile-search__controls">
        <InputText
          v-model="searchQuery"
          placeholder="Search by name, email or phone..."
          class="profile-search__input"
          @keyup.enter="searchProfiles()"
        />
        <Button
          label="Search"
          icon="pi pi-search"
          @click="searchProfiles()"
          :loading="loading"
          class="profile-search__button"
        />
      </div>

      <Message v-if="error" severity="error" :closable="false">{{ error }}</Message>

      <div v-if="profiles.length > 0" class="profile-search__results">
        <h3>Results ({{ profiles.length }})</h3>

        <div v-for="profile in profiles" :key="profile.id" class="profile-card">
          <div class="profile-card__grid">
            <div>
              <p class="profile-card__label">Name</p>
              <p class="profile-card__value profile-card__value--strong">{{ profile.full_name }}</p>
            </div>
            <div>
              <p class="profile-card__label">Role</p>
              <p class="profile-card__value">{{ profile.role || 'N/A' }}</p>
            </div>
            <div>
              <p class="profile-card__label">Email</p>
              <p class="profile-card__value">{{ profile.email || 'N/A' }}</p>
            </div>
            <div>
              <p class="profile-card__label">Phone</p>
              <p class="profile-card__value">{{ profile.phone || 'N/A' }}</p>
            </div>
            <div class="profile-card__span-2">
              <p class="profile-card__label">ID</p>
              <p class="profile-card__mono">{{ profile.id }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading && !error" class="profile-search__empty-state">
        Search for a profile to see the person details here.
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-search {
  width: 100%;
}

.profile-search__card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 68rem;
  padding: 1.5rem;
  border: 1px solid #dbe2ef;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
}

.profile-search__intro h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 800;
}

.profile-search__intro p {
  margin: 0.4rem 0 0;
  color: #475569;
}

.profile-search__controls {
  display: flex;
  gap: 0.85rem;
  align-items: center;
}

:deep(.profile-search__input) {
  flex: 1;
}

.profile-search__button {
  flex-shrink: 0;
}

.profile-search__results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-search__results h3 {
  margin: 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  color: #0f172a;
  font-size: 1.1rem;
  font-weight: 700;
}

.profile-card {
  padding: 1.2rem;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.profile-card__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 1.25rem;
}

.profile-card__label {
  margin: 0 0 0.2rem;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.profile-card__value,
.profile-card__mono {
  margin: 0;
  color: #0f172a;
}

.profile-card__value--strong {
  font-size: 1.05rem;
  font-weight: 700;
}

.profile-card__span-2 {
  grid-column: 1 / -1;
}

.profile-card__mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.92rem;
  word-break: break-all;
}

.profile-search__empty-state {
  padding: 1rem 1.1rem;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  color: #64748b;
  background: #f8fafc;
}

@media (max-width: 720px) {
  .profile-search__controls {
    flex-direction: column;
    align-items: stretch;
  }

  .profile-card__grid {
    grid-template-columns: 1fr;
  }
}
</style>