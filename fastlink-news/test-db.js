// Quick test to check Supabase database connection and schema
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwtokpywiapytqexnvjx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dG9rcHl3aWFweXRxZXhudmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTQyMzMsImV4cCI6MjA4NDU3MDIzM30.WdARthobXCMeQ_RPmfaFacqZI2h99EvvbIg5X6E2zAk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
    console.log('🔍 Testing Supabase connection...\n');

    // Test 1: Check if we can connect
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .limit(1);

    if (error) {
        console.error('❌ Database Error:', error.message);
        console.error('Error Code:', error.code);
        console.error('Error Details:', error.details);
        console.error('\n💡 This likely means the "category" or "content" columns don\'t exist yet.');
        console.error('   Run the ALTER TABLE commands in Supabase SQL Editor.\n');
        return;
    }

    console.log('✅ Database connection successful!');
    console.log('📊 Number of posts:', data?.length || 0);

    if (data && data.length > 0) {
        console.log('\n📝 Sample post structure:');
        const firstPost = data[0];
        console.log('Columns available:', Object.keys(firstPost).join(', '));
    } else {
        console.log('\n📝 No posts found in database. Table is empty.');
        console.log('   You can add sample data using the SQL commands provided.');
    }
}

testDatabase();
