import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length === 0) {
        return NextResponse.json({ results: [] });
    }

    try {
        // Search across title, content, and author fields
        // Using ilike for case-insensitive partial matching
        const searchTerm = `%${query.trim()}%`;

        const { data: posts, error } = await supabase
            .from('posts')
            .select('id, title, category, image_url, created_at, author, content')
            .eq('status', 'published')
            .or(`title.ilike.${searchTerm},content.ilike.${searchTerm},author.ilike.${searchTerm}`)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Search error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Format results
        const results = posts?.map(post => ({
            id: post.id,
            title: post.title,
            category: post.category,
            image_url: post.image_url,
            created_at: post.created_at,
            author: post.author,
        })) || [];

        return NextResponse.json({
            results,
            query,
            count: results.length
        });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
