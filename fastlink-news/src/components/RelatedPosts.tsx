'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface NewsItem {
    id: string;
    title: string;
    image: string;
    category: string;
    created_at: string;
}

export default function RelatedPosts({ category, currentPostId }: { category: string, currentPostId: string }) {
    const [relatedPosts, setRelatedPosts] = useState<NewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                // We'll mock the fetch by filtering client side for now since we don't have a dedicated "related" endpoint
                // ideally this should be a server action or specific API.
                // For now, let's fetch category posts.
                // Note: In a real app, pass this data from server component. 
                // However, user asked for "slideshow", so client component is appropriate for interaction.
                // We will use a simple client-side fetch helper logic if possible, or just the existing data structure?
                // `fetchNewsByCategory` is server-side.
                // Let's create a small client-side fetcher or just fetch all logic in API?
                // Actually, let's make a new API route for related posts to be clean.
                // For now, I'll simulate it or better yet, I should have created an API for this.
                // Let's create a simple API route for posts by category first?
                // Or I can just fetch all and filter (bad performance).
                // Let's assume we have an endpoint or just fetch from a new route.
                // I'll create `src/app/api/posts/route.ts` that can filter by category.

                const res = await fetch(`/api/posts?category=${encodeURIComponent(category)}&limit=6`);
                const data = await res.json();

                if (data.posts) {
                    // Filter out current post
                    const filtered = data.posts.filter((p: any) => p.id !== currentPostId);
                    setRelatedPosts(filtered);
                }
            } catch (err) {
                console.error("Failed to fetch related posts", err);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchRelated();
        }
    }, [category, currentPostId]);

    const nextSlide = () => {
        if (relatedPosts.length <= 3) return; // No need to slide if few posts
        setCurrentIndex((prev) => (prev + 1) % (relatedPosts.length - 2));
    };

    const prevSlide = () => {
        if (relatedPosts.length <= 3) return;
        setCurrentIndex((prev) => (prev - 1 + (relatedPosts.length - 2)) % (relatedPosts.length - 2));
    };

    if (loading || relatedPosts.length === 0) return null;

    return (
        <div className="mt-12 border-t border-gray-100 pt-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 border-l-4 border-primary pl-3">
                    Related Articles
                </h3>
                {relatedPosts.length > 3 && (
                    <div className="flex gap-2">
                        <button onClick={prevSlide} className="p-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <button onClick={nextSlide} className="p-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            <div className="overflow-hidden relative">
                <div
                    className="flex gap-6 transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }} // Simple logic for 3 items view
                >
                    {relatedPosts.map((post) => (
                        <div key={post.id} className="w-full md:w-1/3 flex-shrink-0">
                            <Link href={`/news/${post.id}`} className="group block">
                                <div className="aspect-video rounded-xl overflow-hidden mb-3 relative bg-gray-100">
                                    <img
                                        src={post.image || 'https://placehold.co/600x400/eee/999?text=News'}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h4 className="font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h4>
                                <span className="text-xs text-gray-500 mt-1 block">
                                    {new Date(post.created_at).toLocaleDateString()}
                                </span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
