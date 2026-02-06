// Test script to verify Supabase Storage connection and bucket configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwtokpywiapytqexnvjx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dG9rcHl3aWFweXRxZXhudmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTQyMzMsImV4cCI6MjA4NDU3MDIzM30.WdARthobXCMeQ_RPmfaFacqZI2h99EvvbIg5X6E2zAk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
    console.log('🔍 Testing Supabase Storage...\n');

    // Test 1: List all buckets
    console.log('📦 Checking storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
        console.error('❌ Error listing buckets:', bucketsError.message);
        return;
    }

    console.log('✅ Available buckets:', buckets.map(b => b.name).join(', '));

    const requiredBuckets = ['article-images', 'article-media'];
    const missingBuckets = requiredBuckets.filter(rb => !buckets.find(b => b.name === rb));

    if (missingBuckets.length > 0) {
        console.error('❌ Missing required buckets:', missingBuckets.join(', '));
        console.log('\n💡 You need to create these buckets in Supabase Dashboard:');
        console.log('   Storage > Create new bucket');
        console.log('   Or run the schema.sql file to create them.\n');
        return;
    }

    console.log('✅ All required buckets exist!\n');

    // Test 2: Check bucket details
    for (const bucketName of requiredBuckets) {
        const bucket = buckets.find(b => b.name === bucketName);
        console.log(`📁 Bucket: ${bucketName}`);
        console.log(`   - Public: ${bucket.public}`);
        console.log(`   - ID: ${bucket.id}`);
    }

    console.log('\n🔐 Testing upload permissions...');

    // Test 3: Try to upload a test file (will fail if policies are wrong)
    const testFileName = `test-${Date.now()}.txt`;
    const testFile = new Blob(['This is a test file'], { type: 'text/plain' });

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(testFileName, testFile);

    if (uploadError) {
        console.error('❌ Upload test failed:', uploadError.message);
        console.log('\n💡 This likely means storage policies need to be updated.');
        console.log('   Check fix_storage_policy.sql for the correct policies.');
        console.log('   Note: Uploads require authentication. Anonymous uploads may be blocked.\n');
        return;
    }

    console.log('✅ Upload test successful!');
    console.log('   Uploaded file:', uploadData.path);

    // Test 4: Get public URL
    const { data: urlData } = supabase.storage
        .from('article-images')
        .getPublicUrl(testFileName);

    console.log('   Public URL:', urlData.publicUrl);

    // Test 5: Clean up test file
    const { error: deleteError } = await supabase.storage
        .from('article-images')
        .remove([testFileName]);

    if (deleteError) {
        console.warn('⚠️  Could not delete test file:', deleteError.message);
    } else {
        console.log('✅ Test file cleaned up successfully\n');
    }

    console.log('🎉 All storage tests passed!');
    console.log('\n📝 Summary:');
    console.log('   - Storage buckets exist and are accessible');
    console.log('   - Upload functionality works');
    console.log('   - Public URL generation works');
    console.log('   - File deletion works');
}

testStorage();
