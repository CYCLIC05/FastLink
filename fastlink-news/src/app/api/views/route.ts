import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        const { error } = await supabase.rpc('increment_view_count', { post_id: id });

        // Fallback if RPC doesn't exist (using normal update)
        if (error) {
            // First get current view count
            const { data: post, error: fetchError } = await supabase
                .from('posts')
                .select('views')
                .eq('id', id)
                .single();

            if (fetchError) {
                return NextResponse.json({ error: fetchError.message }, { status: 500 });
            }

            const currentViews = post?.views || 0;

            const { error: updateError } = await supabase
                .from('posts')
                .update({ views: currentViews + 1 })
                .eq('id', id);

            if (updateError) {
                return NextResponse.json({ error: updateError.message }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
