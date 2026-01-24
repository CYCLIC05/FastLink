// Script to seed sample data into Supabase database
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jwtokpywiapytqexnvjx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3dG9rcHl3aWFweXRxZXhudmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTQyMzMsImV4cCI6MjA4NDU3MDIzM30.WdARthobXCMeQ_RPmfaFacqZI2h99EvvbIg5X6E2zAk';

const supabase = createClient(supabaseUrl, supabaseKey);

const samplePosts = [
    {
        title: 'Breaking News: Technology Innovation Summit 2026',
        category: 'Technology',
        content: 'Leaders in technology gather to discuss the future of AI, blockchain, and emerging technologies that will shape our world. The summit brings together innovators, investors, and policymakers.',
        image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        author: 'John Doe',
        status: 'published',
        is_trending: true
    },
    {
        title: 'African Business: New Investment Opportunities',
        category: 'Business',
        content: 'African markets continue to expand with unprecedented growth in fintech, agriculture, and renewable energy sectors. Investors are increasingly looking to Africa as the next frontier.',
        image_url: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800',
        author: 'Jane Smith',
        status: 'published',
        is_trending: false
    },
    {
        title: 'Healthcare Revolution: AI in Medical Diagnosis',
        category: 'Health',
        content: 'Artificial intelligence is transforming healthcare delivery with breakthrough diagnostic tools and personalized treatment plans. Hospitals are adopting AI to improve patient outcomes.',
        image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        author: 'Dr. Michael Chen',
        status: 'published',
        is_trending: true
    },
    {
        title: 'World Cup 2026: Qualifiers Heat Up',
        category: 'Sport',
        content: 'National teams compete in thrilling qualifier matches as the race to the World Cup intensifies across all continents. Fans eagerly await the final roster announcements.',
        image_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
        author: 'Sarah Johnson',
        status: 'published',
        is_trending: false
    },
    {
        title: 'Climate Action: Global Leaders Unite',
        category: 'International',
        content: 'Countries commit to ambitious climate targets at historic summit, pledging to reduce emissions and invest in green technology. The agreement marks a turning point in global cooperation.',
        image_url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
        author: 'Emily Martinez',
        status: 'published',
        is_trending: true
    },
    {
        title: 'Education Technology Transforms Learning',
        category: 'Technology',
        content: 'Digital platforms and AI-powered tools are revolutionizing how students learn and teachers educate in the modern classroom. Schools worldwide are adopting new ed-tech solutions.',
        image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
        author: 'David Brown',
        status: 'published',
        is_trending: false
    },
    {
        title: 'Stock Markets Reach New Heights',
        category: 'Business',
        content: 'Global markets surge to record highs driven by strong corporate earnings and optimistic economic forecasts. Analysts predict continued growth throughout the year.',
        image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        author: 'Lisa Anderson',
        status: 'published',
        is_trending: false
    },
    {
        title: 'Mental Health Awareness Campaign Launched',
        category: 'Health',
        content: 'New initiative aims to reduce stigma and improve access to mental health services across communities nationwide. The campaign includes free counseling and educational programs.',
        image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        author: 'Dr. James Wilson',
        status: 'published',
        is_trending: true
    },
    {
        title: 'Olympic Athletes Prepare for Paris 2024',
        category: 'Sport',
        content: 'Top athletes from around the world train intensively for the upcoming Olympic Games in Paris. Training camps are in full swing as competitors fine-tune their skills.',
        image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        author: 'Mark Thompson',
        status: 'published',
        is_trending: false
    },
    {
        title: 'United Nations Addresses Global Challenges',
        category: 'International',
        content: 'World leaders gather at UN headquarters to tackle pressing issues including poverty, inequality, and sustainable development. New resolutions aim to create lasting change.',
        image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        author: 'Anna Rodriguez',
        status: 'published',
        is_trending: false
    },
    {
        title: 'Lifestyle Tips: Healthy Living in 2026',
        category: 'Lifestyle',
        content: 'Experts share practical advice for maintaining a balanced lifestyle in the modern world. From nutrition to exercise, discover simple habits for better health.',
        image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
        author: 'Michelle Lee',
        status: 'published',
        is_trending: false
    }
];

async function seedDatabase() {
    console.log('🌱 Starting database seeding...\n');

    // First check existing posts
    const { data: existing, error: checkError } = await supabase
        .from('posts')
        .select('id, title, status, category')
        .eq('status', 'published');

    if (checkError) {
        console.error('❌ Error checking existing posts:', checkError.message);
        return;
    }

    console.log(`📊 Currently ${existing?.length || 0} published posts in database\n`);

    if (existing && existing.length > 0) {
        console.log('Existing posts:');
        existing.forEach((post, idx) => {
            console.log(`  ${idx + 1}. [${post.category}] ${post.title.substring(0, 50)}...`);
        });
        console.log('');
    }

    // Insert sample posts
    console.log('💾 Inserting sample posts...\n');

    const { data, error } = await supabase
        .from('posts')
        .insert(samplePosts)
        .select();

    if (error) {
        console.error('❌ Error inserting posts:', error.message);
        console.error('Details:', error);
        return;
    }

    console.log(`✅ Successfully added ${data?.length || 0} new posts!\n`);

    // Verify final count
    const { data: final } = await supabase
        .from('posts')
        .select('id')
        .eq('status', 'published');

    console.log(`🎉 Total published posts now: ${final?.length || 0}`);
    console.log('\n✨ Database seeding complete! Your blog should now display content.');
}

seedDatabase();
