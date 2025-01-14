import { createClient } from '@supabase/supabase-js';

import type { Database } from './types';

const SUPABASE_URL = "https://pqzhnpgwhcuxaduvxans.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxemhucGd3aGN1eGFkdXZ4YW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNTM5MjYsImV4cCI6MjA1MTgyOTkyNn0.uqk5bXd-TqBcHKGMFlBDRpu2ox0e5GwaC1bNFHklaM4";

const options = {

auth: {

flowType: 'pkce',
autoRefreshToken: true,
detectSessionInUrl: true,
persistSession: true,
storage: window.localStorage,
site_url: 'https://preview--micaai.lovable.app'
}

};

export const supabase = createClient<Database>(

SUPABASE_URL,

SUPABASE_PUBLISHABLE_KEY,

options

);