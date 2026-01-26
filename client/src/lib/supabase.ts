import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type AuthUser = {
  id: string;
  email?: string;
};

export type Profile = {
  id: string;
  user_id: string;
  is_influencer: boolean;
  stripe_customer_id?: string;
};
