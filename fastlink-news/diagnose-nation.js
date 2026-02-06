// Diagnostic script to check The Nation articles and category matching
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwtokpywiapytqexnvjx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dG9rcHl3aWFweXRxZXhudmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTQyMzMsImV4cCI6MjA4NDU3MDIzM30.WdARthobXCMeQ_RPmfaFacqZI2h99EvvbIg5X6E2zAk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseNationSection() {
    console.log('🔍 Diagnosing "The Nation" Section Issue\n');

    // Fetch all published posts
    const { data: allPosts, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('❌ Error fetching posts:', error.message);
        return;
    }

    console.log(`📊 Total published posts: ${allPosts.length}\n`);

    // Check for The Nation posts
    const nationPosts = allPosts.filter(p => p.category === 'The Nation');
    const nationPostsTrimmed = allPosts.filter(p => p.category.trim() === 'The Nation');

    console.log('🔍 Category Matching Tests:');
    console.log(`   - Exact match "The Nation": ${nationPosts.length} posts`);
    console.log(`   - Trimmed match "The Nation": ${nationPostsTrimmed.length} posts\n`);

    // Show all unique categories
    const uniqueCategories = [...new Set(allPosts.map(p => p.category))];
    console.log('📋 All unique categories in database:');
    uniqueCategories.forEach(cat => {
        const count = allPosts.filter(p => p.category === cat).length;
        console.log(`   - "${cat}" (length: ${cat.length}, count: ${count})`);
    });

    // Check for whitespace issues
    console.log('\n🔍 Checking for whitespace issues:');
    const categoriesWithWhitespace = uniqueCategories.filter(cat => cat !== cat.trim());
    if (categoriesWithWhitespace.length > 0) {
        console.log('⚠️  Found categories with leading/trailing whitespace:');
        categoriesWithWhitespace.forEach(cat => {
            console.log(`   - "${cat}" (should be "${cat.trim()}")`);
        });
    } else {
        console.log('✅ No whitespace issues found');
    }

    // Show The Nation posts details
    if (nationPosts.length > 0) {
        console.log('\n📰 "The Nation" Posts:');
        nationPosts.forEach((post, idx) => {
            console.log(`   ${idx + 1}. "${post.title}"`);
            console.log(`      - Category: "${post.category}"`);
            console.log(`      - Status: ${post.status}`);
            console.log(`      - Created: ${post.created_at}`);
            console.log(`      - Has Image: ${post.image_url ? 'Yes' : 'No'}`);
        });
    } else {
        console.log('\n❌ No "The Nation" posts found!');
        console.log('   This is the issue - the homepage cannot display articles that don\'t exist.');
    }

    // Test the exact filter used in homepage
    console.log('\n🧪 Testing Homepage Filter Logic:');
    const homepageFilter = allPosts.filter(n => n.category.trim() === 'The Nation');
    console.log(`   - Posts that would appear on homepage: ${homepageFilter.length}`);

    if (homepageFilter.length > 0) {
        console.log('   ✅ Articles should be visible on homepage');
    } else {
        console.log('   ❌ No articles would appear on homepage with current filter');
    }
}

diagnoseNationSection();
