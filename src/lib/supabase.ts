import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iugjwbeqrtjytadtfmne.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Xf37NuwcWfVESaTBY_uPqw_NTducTnQ';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

