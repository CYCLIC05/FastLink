const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwtokpywiapytqexnvjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dG9rcHl3aWFweXRxZXhudmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTQyMzMsImV4cCI6MjA4NDU3MDIzM30.WdARthobXCMeQ_RPmfaFacqZI2h99EvvbIg5X6E2zAk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNation() {
    console.log('--- Checking "The Nation" Posts ---');

    // 1. Get all posts to check categories
    const { data: allPosts, error: catError } = await supabase
        .from('posts')
        .select('category, status');

    if (catError) {
        console.error('Error fetching categories:', catError.message);
        return;
    }

    if (!allPosts || allPosts.length === 0) {
        console.log('No posts found in database at all.');
        return;
    }

    const uniqueCats = [...new Set(allPosts.map(p => p.category))];
    console.log('All Categories found in DB:', uniqueCats);

    // Check specific counts
    const nationCount = allPosts.filter(p => p.category === 'The Nation').length;
    const nationPublished = allPosts.filter(p => p.category === 'The Nation' && p.status === 'published').length;

    console.log(`Total "The Nation" posts: ${nationCount}`);
    console.log(`Published "The Nation" posts: ${nationPublished}`);

    // FETCH DETAILS
    const { data: nationPosts, error } = await supabase
        .from('posts')
        .select('id, title, status, created_at, category')
        .eq('category', 'The Nation')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching The Nation details:', error);
        return;
    }

    console.log(`\nDetailed List for "The Nation":`);
    nationPosts.forEach(p => {
        console.log(`[${p.status}] ${p.created_at} - ${p.title} (Cat: "${p.category}")`);
    });
}

checkNation();
