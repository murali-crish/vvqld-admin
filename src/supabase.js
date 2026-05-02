import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing. Please check your .env file.')
}

// By removing the placeholder fallback, the client will throw an immediate
// error if config is missing, rather than waiting for a network timeout.
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
