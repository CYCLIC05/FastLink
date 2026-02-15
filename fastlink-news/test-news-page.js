// Test the exact query used by the /news category page
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwtokpywiapytqexnvjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dG9rcHl3aWFweXRxZXhudmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTQyMzMsImV4cCI6MjA4NDU3MDIzM30.WdARthobXCMeQ_RPmfaFacqZI2h99EvvbIg5X6E2zAk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCategoryPageQuery() {
    console.log('🧪 Testing /news Category Page Query\n');

    // This is the exact query used by fetchNewsByCategory('The Nation')
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('category', 'The Nation')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Query Error:', error.message);
        console.error('   Code:', error.code);
        console.error('   Details:', error.details);
        return;
    }

    console.log(`✅ Query successful!`);
    console.log(`📊 Found ${data.length} articles for "The Nation"\n`);

    if (data.length > 0) {
        console.log('📰 Articles that should appear on /news page:');
        data.forEach((post, idx) => {
            console.log(`\n   ${idx + 1}. "${post.title}"`);
            console.log(`      - Category: ${post.category}`);
            console.log(`      - Status: ${post.status}`);
            console.log(`      - Image URL: ${post.image_url ? 'Yes' : 'No'}`);
            console.log(`      - Created: ${post.created_at}`);
        });

        console.log('\n✅ These articles SHOULD be visible on http://localhost:3000/news');
        console.log('   If they are not appearing, the issue is likely:');
        console.log('   1. Next.js cache - Delete .next folder and restart');
        console.log('   2. Browser cache - Hard refresh (Ctrl+Shift+R)');
    } else {
        console.log('❌ No articles found!');
        console.log('   This means the /news page will show "No articles" message');
    }
}

testCategoryPageQuery();
