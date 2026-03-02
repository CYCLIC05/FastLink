import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jwtokpywiapytqexnvjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dG9rcHl3aWFweXRxZXhudmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTQyMzMsImV4cCI6MjA4NDU3MDIzM30.WdARthobXCMeQ_RPmfaFacqZI2h99EvvbIg5X6E2zAk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Running supabase error object check');
    const { data, error } = await supabase.from('nonexistent').select('*');
    console.log('error object:', error);
    console.log('typeof error:', typeof error);
    console.log('error JSON:', JSON.stringify(error));
    console.log('error keys:', Object.keys(error || {}));
}

run();
