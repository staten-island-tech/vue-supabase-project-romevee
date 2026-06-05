import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://afrofrndlppknobgekhh.supabase.co'

const supabaseKey = 'sb_publishable_IlhV2YSg_N2tCXJ-Vspa7g_wpDoP5l0'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)