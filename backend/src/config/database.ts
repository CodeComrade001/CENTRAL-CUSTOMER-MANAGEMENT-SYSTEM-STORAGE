import { createClient, SupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const URL = process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
/**
 * @description  Creates a connection between the backend and the supabase 
 */

export default async function CreateSupabaseConnection(): Promise<SupabaseClient | undefined> {
  try {
    if (typeof URL === 'string' && typeof KEY === 'string' && URL && KEY) {
      const supabase = createClient(URL, KEY)
      return supabase
    } else {
      throw new Error('Missing or invalid Supabase environment variables')
    }
  } catch (err) {
    console.error('Turbo Log ~ CreateSupabaseConnection ~ err:', err)
  }
}

/**
 * @description Ensures that a  valid conection is created before export.
 */
export async function getSafeSupabase(): Promise<SupabaseClient> {
  const client = await CreateSupabaseConnection()
  if (!client) {
    throw new Error("Failed to create Supabase client: missing URL or KEY")
  }
  return client
}
