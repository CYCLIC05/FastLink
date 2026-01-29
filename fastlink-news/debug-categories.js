const { createClient } = require('@supabase/supabase-js');

// Keys from seed-data.js
const supabaseUrl = 'https://jwtokpywiapytqexnvjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dG9rcHl3aWFweXRxZXhudmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTQyMzMsImV4cCI6MjA4NDU3MDIzM30.WdARthobXCMeQ_RPmfaFacqZI2h99EvvbIg5X6E2zAk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Fetching posts...');
    const { data, error } = await supabase
        .from('posts')
        .select('id, title, category, status');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Total posts:', data.length);
    const categories = [...new Set(data.map(p => p.category))];
    console.log('Unique Categories found in DB:', categories);

    // Check distribution
    const counts = {};
    data.forEach(p => {
        counts[p.category] = (counts[p.category] || 0) + 1;
    });
    console.log('Counts per category:', counts);

    console.log('Sample data (first 10):');
    data.slice(0, 10).forEach(p => console.log(`[${p.status}] "${p.category}" - ${p.title}`));
}

check();
