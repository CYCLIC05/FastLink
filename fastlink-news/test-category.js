import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jwtokpywiapytqexnvjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dG9rcHl3aWFweXRxZXhudmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTQyMzMsImV4cCI6MjA4NDU3MDIzM30.WdARthobXCMeQ_RPmfaFacqZI2h99EvvbIg5X6E2zAk';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('query Entertainment');
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('category', 'Entertainment')
        .order('created_at', { ascending: false });
    console.log('error', error);
    console.log('error keys', error ? Object.keys(error) : undefined);
    console.log('data count', data?.length);
}

run();
