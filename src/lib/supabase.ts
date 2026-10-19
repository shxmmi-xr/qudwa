import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ttttnhfpmyjasivanedt.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_QLP5XUCgUVb2FodlendPDw_xWW_3XCy';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;
