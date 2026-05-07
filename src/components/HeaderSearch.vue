<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import InputText from 'primevue/inputtext'

const router = useRouter()
const searchQuery = ref('')
const loading = ref(false)
const results = ref([])
const showDropdown = ref(false)

const handleSearch = async () => {
  const query = searchQuery.value.trim()

  if (query.length < 2) {
    results.value = []
    showDropdown.value = false
    return
  }

  loading.value = true

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .ilike('search_term', `%${query}%`)
      .limit(5)

    if (error) {
      console.error('Search error:', error)
      results.value = []
      showDropdown.value = true
      return
    }

    results.value = data || []
    showDropdown.value = true
  } catch (err) {
    // Catch network or unexpected errors not captured by Supabase error object
    console.error('Unexpected search error:', err)
    results.value = []
    showDropdown.value = true
  } finally {
    loading.value = false
  }
}

const selectProfile = (profile) => {
  searchQuery.value = ''
  showDropdown.value = false
  router.push({ path: '/profiles', query: { q: profile.id } })
}

// Close dropdown when clicking outside (simple implementation)
const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}
</script>

<template>
  <div class="header-search">
    <label class="header-search__label" for="header-profile-search">Profile Search</label>

    <span class="header-search__input-wrap p-input-icon-left">
      <i class="pi pi-search header-search__icon" />
      <InputText
        id="header-profile-search"
        v-model="searchQuery"
        placeholder="Search profiles by phone"
        class="header-search__input"
        @input="handleSearch"
        @blur="handleBlur"
        @focus="handleSearch"
      />
    </span>
    <i v-if="loading" class="pi pi-spinner pi-spin header-search__spinner" />

    <div v-if="showDropdown && results.length > 0" class="header-search__dropdown">
      <ul class="header-search__results">
        <li
          v-for="profile in results"
          :key="profile.id"
          class="header-search__result"
          @mousedown="selectProfile(profile)"
        >
          <div class="header-search__name">{{ profile.full_name }}</div>
          <div class="header-search__meta">{{ profile.phone || 'No phone' }}</div>
        </li>
      </ul>
    </div>
    <div v-if="showDropdown && results.length === 0 && searchQuery.length >= 2" class="header-search__empty">
      No profiles found.
    </div>
  </div>
</template>

<style scoped>
.header-search {
  position: relative;
  width: 100%;
}

.header-search__label {
  display: block;
  margin-bottom: 0.45rem;
  color: #334155;
  font-size: 0.9rem;
  font-weight: 700;
}

.header-search__input-wrap {
  position: relative;
  display: block;
  width: 100%;
}

.header-search__icon {
  color: #64748b;
}

:deep(.header-search__input) {
  width: 100%;
  padding-left: 2.5rem;
}

.header-search__spinner {
  position: absolute;
  right: 0.9rem;
  top: 2.45rem;
  color: #94a3b8;
}

.header-search__dropdown,
.header-search__empty {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  z-index: 40;
  border: 1px solid #dbe2ef;
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
}

.header-search__results {
  margin: 0;
  padding: 0;
  list-style: none;
}

.header-search__result {
  padding: 0.85rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #e2e8f0;
}

.header-search__result:last-child {
  border-bottom: 0;
}

.header-search__result:hover {
  background: #f8fafc;
}

.header-search__name {
  color: #0f172a;
  font-weight: 700;
}

.header-search__meta {
  color: #64748b;
  font-size: 0.9rem;
}

.header-search__empty {
  padding: 0.85rem 1rem;
  color: #64748b;
}
</style>

