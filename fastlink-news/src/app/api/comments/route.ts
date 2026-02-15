import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get('postId');

    if (!postId) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('is_approved', true) // Only fetch approved comments
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { postId, userName, userEmail, content } = body;

        if (!postId || !userName || !content) {
            return NextResponse.json({ error: 'Missing defined fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    post_id: postId,
                    user_name: userName,
                    user_email: userEmail,
                    content: content,
                    is_approved: true // Auto-approve for now, change to false if moderation is needed
                }
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ comment: data });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
