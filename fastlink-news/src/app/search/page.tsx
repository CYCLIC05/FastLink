'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchResult {
    id: string;
    title: string;
    category: string;
    image_url: string;
    created_at: string;
    author: string;
}

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (query.trim()) {
            fetchResults();
        } else {
            setLoading(false);
        }
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=50`);
            const data = await res.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Search Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <MagnifyingGlassIcon className="w-6 h-6 text-primary" />
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900">
                            Search Results
                        </h1>
                    </div>
                    {query && (
                        <p className="text-gray-600">
                            {loading ? (
                                'Searching...'
                            ) : (
                                <>
                                    Found <span className="font-bold text-primary">{results.length}</span> {results.length === 1 ? 'result' : 'results'} for &quot;<span className="font-bold">{query}</span>&quot;
                                </>
                            )}
                        </p>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                    </div>
                )}

                {/* No Results */}
                {!loading && query.trim().length > 0 && results.length === 0 && (
                    <div className="text-center py-20">
                        <MagnifyingGlassIcon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            No results found
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your search terms or browse our categories
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Back to Homepage
                        </Link>
                    </div>
                )}

                {/* No Query */}
                {!loading && !query.trim() && (
                    <div className="text-center py-20">
                        <MagnifyingGlassIcon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Enter a search term
                        </h2>
                        <p className="text-gray-600">
                            Use the search bar in the header to find articles
                        </p>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && results.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((result) => (
                            <Link
                                key={result.id}
                                href={`/news/${result.id}`}
                                className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                            >
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    <img
                                        src={result.image_url}
                                        alt={result.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold uppercase px-3 py-1 rounded-sm">
                                        {result.category}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                        <span>{new Date(result.created_at).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{result.author}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-3 group-hover:text-primary transition-colors">
                                        {result.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
