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
}

// Helper to format date
const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const fetchLatestNews = async (): Promise<NewsItem[]> => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error in fetchLatestNews:', error);
        // Sometimes the error is a network error not strictly a PostgrestError
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
        isFeatured: false
    }));
};

export const fetchNewsById = async (id: string): Promise<NewsItem | null> => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching news by id:', error);
        return null;
    }

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
            : ''
    };
};

export const fetchFeaturedNews = async (): Promise<NewsItem[]> => {
    // For now, just take the latest 5 as featured, or maybe filtering by a 'The Nation' category
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) return [];

    return data.map((post: any) => ({
        id: post.id,
        title: post.title,
        category: post.category,
        image: post.image_url || 'https://placehold.co/800x600/eee/999?text=No+Image',
        author: post.author,
        date: formatDate(post.created_at),
        isFeatured: true
    }));
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
        isFeatured: true
    }));
};

export const fetchNewsByCategory = async (category: string): Promise<NewsItem[]> => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .eq('category', category)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(`Error fetching category ${category}:`, error);
        return [];
    }

    return data.map((post: any) => ({
        id: post.id,
        title: post.title,
        category: post.category,
        image: post.image_url || 'https://placehold.co/800x600/eee/999?text=No+Image',
        author: post.author,
        date: formatDate(post.created_at),
        content: post.content,
        excerpt: post.content ? (post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content) : '',
        isFeatured: post.is_trending
    }));
};

