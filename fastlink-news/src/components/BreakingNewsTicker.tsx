"use client";

import { useState, useEffect } from 'react';
import { fetchLatestNews, NewsItem } from '@/lib/data';

export default function BreakingNewsTicker() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Fetch news on mount
        const loadNews = async () => {
            const data = await fetchLatestNews();
            setNewsItems(data);
        };
        loadNews();
    }, []);

    useEffect(() => {
        if (newsItems.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [newsItems.length]);

    if (!newsItems || newsItems.length === 0) return null;

    const currentNews = newsItems[currentIndex];

    return (
        <div className="bg-primary-darker/90 backdrop-blur border-b border-primary/20 text-white overflow-hidden shadow-sm">
            <div className="container mx-auto flex items-center h-10 px-4">
                <div className="flex-shrink-0 bg-red-600 text-[10px] font-bold uppercase px-3 py-1 mr-4 rounded-sm animate-pulse tracking-wide shadow-sm">
                    Breaking
                </div>
                <div className="flex-1 overflow-hidden relative h-full flex items-center">
                    <div
                        key={currentNews.id} // Key forces re-render for animation
                        className="animate-fade-in-slide-up flex items-center gap-3 text-sm font-medium w-full"
                    >
                        <span className="text-primary-light font-bold uppercase text-[10px] tracking-wider hidden md:inline-block bg-white/10 px-2 py-0.5 rounded">
                            {currentNews.category}
                        </span>
                        <span className="truncate hover:text-red-200 transition-colors cursor-pointer">{currentNews.title}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
