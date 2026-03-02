import { supabase } from './supabase';

export interface NewsItem {
    id: string;
    title: string;
    category: string;
    image: string;
    author: string;
    date: string;
    excerpt?: string;
    content?: string;
    isFeatured?: boolean;
    views: number;
    tags: string[];
}

// Helper to format date
const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const fetchLatestNews = async (): Promise<NewsItem[]> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error in fetchLatestNews', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            return [];
        }

        if (!data) return [];

        return data.map((post: any) => ({
            id: post.id,
            title: post.title,
            category: post.category,
            image: post.image_url || 'https://placehold.co/800x600/eee/999?text=No+Image',
            author: post.author,
            date: formatDate(post.created_at),
            content: post.content,
            excerpt: post.content ? (post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content) : '',
            isFeatured: false,
            views: post.views || 0,
            tags: post.tags || []
        }));
    } catch (err: any) {
        console.error('Unexpected error in fetchLatestNews:', err?.message ?? err);
        return [];
    }
};

export const fetchNewsById = async (id: string): Promise<NewsItem | null> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching news by id', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            return null;
        }

        if (!data) return null;

        return {
            id: data.id,
            title: data.title,
            category: data.category,
            image: data.image_url || 'https://placehold.co/800x600/eee/999?text=No+Image',
            author: data.author,
            date: formatDate(data.created_at),
            content: data.content,
            isFeatured: false,
            excerpt: data.content
                ? (data.content.length > 150 ? data.content.substring(0, 150) + '...' : data.content)
                : '',
            views: data.views || 0,
            tags: data.tags || []
        };
    } catch (err: any) {
        console.error('Unexpected error fetching news by id:', err?.message ?? err);
        return null;
    }
};

export const fetchFeaturedNews = async (): Promise<NewsItem[]> => {
    try {
        // For now, just take the latest 5 as featured, or maybe filtering by a 'The Nation' category
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) {
            console.error('Error fetching featured news', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            return [];
        }

        if (!data) return [];

        return data.map((post: any) => ({
            id: post.id,
            title: post.title,
            category: post.category,
            image: post.image_url || 'https://placehold.co/800x600/eee/999?text=No+Image',
            author: post.author,
            date: formatDate(post.created_at),
            isFeatured: true,
            views: post.views || 0,
            tags: post.tags || []
        }));
    } catch (err: any) {
        console.error('Unexpected error fetching featured news:', err?.message ?? err);
        return [];
    }
};

export const fetchTrendingNews = async (): Promise<NewsItem[]> => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('is_trending', true)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) return [];

    return data.map((post: any) => ({
        id: post.id,
        title: post.title,
        category: post.category,
        image: post.image_url || 'https://placehold.co/800x600/eee/999?text=No+Image',
        author: post.author,
        date: formatDate(post.created_at),
        content: post.content,
        excerpt: '',
        isFeatured: true,
        views: post.views || 0,
        tags: post.tags || []
    }));
};

export const fetchNewsByCategory = async (category: string): Promise<NewsItem[]> => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) {
            // log as many details as possible; PostgrestError often has
            // non-enumerable fields that disappear when serialised.
            console.error(`Error fetching category ${category}`, {
                message: error?.message,
                code: error?.code,
                details: error?.details,
                hint: error?.hint,
                props: Object.getOwnPropertyNames(error),
            });
            console.error('raw error object:', error);
            try {
                console.error('descriptors:', Object.getOwnPropertyDescriptors(error));
            } catch {}
            return [];
        }

        if (!data) return [];

        return data.map((post: any) => ({
            id: post.id,
            title: post.title,
            category: post.category,
            image: post.image_url || 'https://placehold.co/800x600/eee/999?text=No+Image',
            author: post.author,
            date: formatDate(post.created_at),
            content: post.content,
            excerpt: post.content ? (post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content) : '',
            isFeatured: post.is_trending,
            views: post.views || 0,
            tags: post.tags || []
        }));
    } catch (err: any) {
        console.error(`Unexpected error fetching category ${category}:`, err?.message ?? err);
        return [];
    }
};

