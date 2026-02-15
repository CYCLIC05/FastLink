import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabase
        .from('posts')
        .select('id, title, category, created_at, image_url')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (category) {
        query = query.eq('category', category);
    }

    const { data: posts, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map image_url to image to match frontend expectation
    const formattedPosts = posts?.map(post => ({
        ...post,
        image: post.image_url
    }));

    return NextResponse.json({ posts: formattedPosts });
}
