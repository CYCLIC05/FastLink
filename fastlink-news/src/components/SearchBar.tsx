'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchResult {
    id: string;
    title: string;
    category: string;
    image_url: string;
    created_at: string;
}

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Keyboard shortcut (Ctrl+K / Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search with debounce
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
                const data = await res.json();
                setResults(data.results || []);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleResultClick = (id: string) => {
        router.push(`/news/${id}`);
        setIsOpen(false);
        setQuery('');
        setResults([]);
    };

    const handleViewAll = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
            setQuery('');
            setResults([]);
        }
    };

    return (
        <>
            {/* Search Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="hover:text-primary transition-colors group relative"
                aria-label="Search"
            >
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span className="hidden md:inline-block absolute -bottom-6 right-0 text-[10px] text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    Ctrl+K
                </span>
            </button>

            {/* Search Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-20 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search articles, authors, topics..."
                                className="flex-1 outline-none text-lg text-gray-900 placeholder-gray-400"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && query.trim()) {
                                        handleViewAll();
                                    }
                                }}
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="Close"
                            >
                                <XMarkIcon className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Search Results */}
                        <div className="flex-1 overflow-y-auto">
                            {loading && (
                                <div className="p-8 text-center text-gray-500">
                                    <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                                    <p className="mt-2 text-sm">Searching...</p>
                                </div>
                            )}

                            {!loading && query.trim().length > 0 && results.length === 0 && (
                                <div className="p-8 text-center text-gray-500">
                                    <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-sm">No results found for &quot;{query}&quot;</p>
                                </div>
                            )}

                            {!loading && results.length > 0 && (
                                <div className="py-2">
                                    {results.map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => handleResultClick(result.id)}
                                            className="w-full flex gap-4 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                                        >
                                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={result.image_url}
                                                    alt={result.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold text-primary uppercase">
                                                        {result.category}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(result.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-gray-900 line-clamp-2 text-sm md:text-base">
                                                    {result.title}
                                                </h4>
                                            </div>
                                        </button>
                                    ))}

                                    {results.length > 0 && (
                                        <button
                                            onClick={handleViewAll}
                                            className="w-full p-4 text-center text-primary font-bold hover:bg-primary/5 transition-colors text-sm"
                                        >
                                            View all results →
                                        </button>
                                    )}
                                </div>
                            )}

                            {!loading && query.trim().length === 0 && (
                                <div className="p-8 text-center text-gray-400">
                                    <p className="text-sm">Start typing to search articles...</p>
                                    <div className="mt-4 text-xs space-y-1">
                                        <p>💡 Press <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl+K</kbd> to open search</p>
                                        <p>💡 Press <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to close</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
