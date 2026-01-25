import { createClient } from '@supabase/supabase-js';

// Use env vars or fallback to the values found in seed-data.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwtokpywiapytqexnvjx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dG9rcHl3aWFweXRxZXhudmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTQyMzMsImV4cCI6MjA4NDU3MDIzM30.WdARthobXCMeQ_RPmfaFacqZI2h99EvvbIg5X6E2zAk';

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase Setup Error: Missing env variables.', {
        url: !!supabaseUrl,
        key: !!supabaseKey
    });
}

export const supabase = createClient(supabaseUrl, supabaseKey);
