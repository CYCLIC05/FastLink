"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Article {
    id: string;
    title: string;
    author: string;
    category: string;
    status: 'published' | 'draft' | 'rejected';
    created_at: string;
    is_trending: boolean;
}

export default function AdminDashboard() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    // const router = useRouter(); // Need to import useRouter

    useEffect(() => {
        // Simple auth check
        const isAuth = localStorage.getItem('admin_auth');
        if (!isAuth) {
            window.location.href = '/admin'; // Force redirect using window location for simplicity
        }
    }, []);

    const fetchArticles = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error:', error);
        else setArticles(data || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('posts')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setArticles(articles.map(a => a.id === id ? { ...a, status: newStatus as any } : a));
        }
    };

    const deleteArticle = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;

        // Prompt for password again for extra security since this is a destructive action
        // and we aren't using real auth sessions
        const password = prompt("Please confirm admin password to delete:");
        if (!password) return;

        try {
            const response = await fetch('/api/admin/delete-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete');
            }

            // Update UI
            setArticles(articles.filter(a => a.id !== id));
            alert("Article deleted successfully");

        } catch (err: any) {
            console.error("Error deleting article:", err);
            alert(`Failed to delete article: ${err.message}`);
        }
    };

    const filteredArticles = articles.filter(a => filter === 'all' || a.status === filter);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Manage article submissions</p>
                </div>
                <div className="space-x-2">
                    {['all', 'draft', 'published', 'rejected'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-md font-bold uppercase text-xs tracking-wider transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading articles...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <th className="p-4 border-b">Article</th>
                                <th className="p-4 border-b">Author</th>
                                <th className="p-4 border-b">Category</th>
                                <th className="p-4 border-b">Status</th>
                                <th className="p-4 border-b text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredArticles.map(article => (
                                <tr key={article.id} className="hover:bg-gray-50 transition-colors border-b last:border-0">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{article.title}</div>
                                        {article.is_trending && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold uppercase">Trending</span>}
                                        <div className="text-xs text-gray-400 mt-1">{new Date(article.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-gray-600">{article.author}</td>
                                    <td className="p-4">
                                        <span className="text-xs font-bold uppercase px-2 py-1 bg-gray-100 rounded text-gray-500">{article.category}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded inline-block w-24 text-center ${article.status === 'published' ? 'bg-green-100 text-green-700' :
                                            article.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {article.status !== 'published' && (
                                            <button
                                                onClick={() => updateStatus(article.id, 'published')}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold uppercase hover:bg-green-700 transition-colors"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {article.status !== 'rejected' && (
                                            <button
                                                onClick={() => updateStatus(article.id, 'rejected')}
                                                className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-bold uppercase hover:bg-gray-700 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteArticle(article.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredArticles.length === 0 && (
                        <div className="p-12 text-center text-gray-400">No articles found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
