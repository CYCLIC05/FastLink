import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { id, password } = await request.json();

        // 1. Verify Password
        if (password !== 'fastlinknews.ng') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Initialize Service Role Client (Bypasses RLS)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseServiceKey) {
            console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // 3. Get file paths before deleting record
        const { data: article, error: fetchError } = await supabase
            .from('posts')
            .select('image_url, media_url')
            .eq('id', id)
            .single();

        if (fetchError) {
            return NextResponse.json({ error: fetchError.message }, { status: 400 });
        }

        // 4. Delete Files
        if (article?.image_url) {
            const imagePath = article.image_url.split('/').pop();
            if (imagePath) await supabase.storage.from('article-images').remove([imagePath]);
        }

        if (article?.media_url) {
            const mediaPath = article.media_url.split('/').pop();
            if (mediaPath) await supabase.storage.from('article-media').remove([mediaPath]);
        }

        // 5. Delete Record
        const { error: deleteError } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
