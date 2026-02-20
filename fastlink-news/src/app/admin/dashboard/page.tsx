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

interface Comment {
    id: string;
    post_id: string;
    user_name: string;
    content: string;
    created_at: string;
    post_title?: string;
}

export default function AdminDashboard() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [activeTab, setActiveTab] = useState<'articles' | 'comments'>('articles');

    useEffect(() => {
        const isAuth = localStorage.getItem('admin_auth');
        if (!isAuth) {
            window.location.href = '/admin';
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

    const fetchComments = async () => {
        setCommentsLoading(true);
        const { data: commentsData, error } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching comments:', error);
            setCommentsLoading(false);
            return;
        }

        // Fetch post titles for each comment
        const postIds = [...new Set((commentsData || []).map((c: Comment) => c.post_id))];
        if (postIds.length > 0) {
            const { data: postsData } = await supabase
                .from('posts')
                .select('id, title')
                .in('id', postIds);

            const postMap: Record<string, string> = {};
            (postsData || []).forEach((p: { id: string; title: string }) => {
                postMap[p.id] = p.title;
            });

            setComments((commentsData || []).map((c: Comment) => ({
                ...c,
                post_title: postMap[c.post_id] || 'Unknown Article'
            })));
        } else {
            setComments(commentsData || []);
        }

        setCommentsLoading(false);
    };

    useEffect(() => {
        fetchArticles();
        fetchComments();
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

        try {
            const response = await fetch('/api/admin/delete-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete');
            }

            setArticles(articles.filter(a => a.id !== id));
            alert("Article deleted successfully");

        } catch (err: any) {
            console.error("Error deleting article:", err);
            alert(`Failed to delete article: ${err.message}`);
        }
    };

    const deleteComment = async (id: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const response = await fetch('/api/comments', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete comment');
            }

            setComments(comments.filter(c => c.id !== id));
        } catch (err: any) {
            console.error("Error deleting comment:", err);
            alert(`Failed to delete comment: ${err.message}`);
        }
    };

    const filteredArticles = articles.filter(a => filter === 'all' || a.status === filter);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Manage article submissions and comments</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('articles')}
                    className={`px-5 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'articles' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Articles
                    <span className="ml-2 bg-white/20 text-current px-2 py-0.5 rounded text-xs">
                        {articles.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('comments')}
                    className={`px-5 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'comments' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Comments
                    <span className="ml-2 bg-white/20 text-current px-2 py-0.5 rounded text-xs">
                        {comments.length}
                    </span>
                </button>
            </div>

            {/* Articles Tab */}
            {activeTab === 'articles' && (
                <>
                    <div className="flex gap-2 mb-4">
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
                </>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && (
                <>
                    {commentsLoading ? (
                        <div className="text-center py-20 text-gray-500">Loading comments...</div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                        <th className="p-4 border-b">Comment</th>
                                        <th className="p-4 border-b">From</th>
                                        <th className="p-4 border-b">Article</th>
                                        <th className="p-4 border-b">Date</th>
                                        <th className="p-4 border-b text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comments.map(comment => (
                                        <tr key={comment.id} className="hover:bg-gray-50 transition-colors border-b last:border-0">
                                            <td className="p-4 max-w-xs">
                                                <p className="text-sm text-gray-700 line-clamp-2">{comment.content}</p>
                                            </td>
                                            <td className="p-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                                                {comment.user_name}
                                            </td>
                                            <td className="p-4 text-sm text-gray-500 max-w-[180px]">
                                                <span className="line-clamp-1">{comment.post_title}</span>
                                            </td>
                                            <td className="p-4 text-xs text-gray-400 whitespace-nowrap">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => deleteComment(comment.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase hover:bg-red-700 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {comments.length === 0 && (
                                <div className="p-12 text-center text-gray-400">No comments found.</div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
