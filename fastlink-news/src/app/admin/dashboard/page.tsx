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
                post_title: postMap[c.post_id] || 'Unknown Article',
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
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to delete');
            setArticles(articles.filter(a => a.id !== id));
            alert('Article deleted successfully');
        } catch (err: any) {
            alert(`Failed to delete article: ${err.message}`);
        }
    };

    const deleteComment = async (id: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        try {
            const response = await fetch('/api/comments', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to delete comment');
            setComments(comments.filter(c => c.id !== id));
        } catch (err: any) {
            alert(`Failed to delete comment: ${err.message}`);
        }
    };

    const filteredArticles = articles.filter(a => filter === 'all' || a.status === filter);

    const statusColor = (status: string) => {
        if (status === 'published') return 'bg-green-100 text-green-700';
        if (status === 'rejected') return 'bg-red-100 text-red-700';
        return 'bg-yellow-100 text-yellow-700';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-6 md:py-8">
                {/* Header */}
                <div className="mb-6 md:mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage article submissions and comments</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`flex-shrink-0 px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'articles' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        Articles
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${activeTab === 'articles' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            {articles.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`flex-shrink-0 px-4 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'comments' ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        Comments
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs ${activeTab === 'comments' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                            {comments.length}
                        </span>
                    </button>
                </div>

                {/* ── ARTICLES TAB ── */}
                {activeTab === 'articles' && (
                    <>
                        {/* Filter buttons */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            {['all', 'draft', 'published', 'rejected'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-md font-bold uppercase text-xs tracking-wider transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {isLoading ? (
                            <div className="text-center py-20 text-gray-400 text-sm">Loading articles…</div>
                        ) : filteredArticles.length === 0 ? (
                            <div className="text-center py-20 text-gray-400 text-sm">No articles found.</div>
                        ) : (
                            <>
                                {/* ── MOBILE cards (hidden on md+) ── */}
                                <div className="flex flex-col gap-4 md:hidden">
                                    {filteredArticles.map(article => (
                                        <div key={article.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="font-bold text-gray-900 text-sm leading-snug flex-1">{article.title}</h3>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded flex-shrink-0 ${statusColor(article.status)}`}>
                                                    {article.status}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-400 mb-1">{article.author} · {new Date(article.created_at).toLocaleDateString()}</div>
                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-100 rounded text-gray-500">{article.category}</span>
                                            {article.is_trending && (
                                                <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold uppercase">Trending</span>
                                            )}
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {article.status !== 'published' && (
                                                    <button onClick={() => updateStatus(article.id, 'published')}
                                                        className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-green-700 transition-colors">
                                                        Approve
                                                    </button>
                                                )}
                                                {article.status !== 'rejected' && (
                                                    <button onClick={() => updateStatus(article.id, 'rejected')}
                                                        className="bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-gray-700 transition-colors">
                                                        Reject
                                                    </button>
                                                )}
                                                <button onClick={() => deleteArticle(article.id)}
                                                    className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-red-700 transition-colors">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* ── DESKTOP table (hidden below md) ── */}
                                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[640px]">
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
                                                        <td className="p-4 max-w-xs">
                                                            <div className="font-bold text-gray-900 line-clamp-2">{article.title}</div>
                                                            {article.is_trending && (
                                                                <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold uppercase">Trending</span>
                                                            )}
                                                            <div className="text-xs text-gray-400 mt-1">{new Date(article.created_at).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="p-4 text-sm font-medium text-gray-600 whitespace-nowrap">{article.author}</td>
                                                        <td className="p-4">
                                                            <span className="text-xs font-bold uppercase px-2 py-1 bg-gray-100 rounded text-gray-500">{article.category}</span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`text-xs font-bold uppercase px-2 py-1 rounded inline-block w-24 text-center ${statusColor(article.status)}`}>
                                                                {article.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-right space-x-2 whitespace-nowrap">
                                                            {article.status !== 'published' && (
                                                                <button onClick={() => updateStatus(article.id, 'published')}
                                                                    className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold uppercase hover:bg-green-700 transition-colors">
                                                                    Approve
                                                                </button>
                                                            )}
                                                            {article.status !== 'rejected' && (
                                                                <button onClick={() => updateStatus(article.id, 'rejected')}
                                                                    className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-bold uppercase hover:bg-gray-700 transition-colors">
                                                                    Reject
                                                                </button>
                                                            )}
                                                            <button onClick={() => deleteArticle(article.id)}
                                                                className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase hover:bg-red-700 transition-colors">
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* ── COMMENTS TAB ── */}
                {activeTab === 'comments' && (
                    <>
                        {commentsLoading ? (
                            <div className="text-center py-20 text-gray-400 text-sm">Loading comments…</div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-20 text-gray-400 text-sm">No comments found.</div>
                        ) : (
                            <>
                                {/* ── MOBILE cards ── */}
                                <div className="flex flex-col gap-4 md:hidden">
                                    {comments.map(comment => (
                                        <div key={comment.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <span className="font-bold text-gray-900 text-xs">{comment.user_name}</span>
                                                <span className="text-[10px] text-gray-400 flex-shrink-0">{new Date(comment.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-2 line-clamp-3">{comment.content}</p>
                                            <p className="text-[10px] text-gray-400 mb-3 line-clamp-1">
                                                <span className="font-semibold text-gray-500">Article: </span>{comment.post_title}
                                            </p>
                                            <button onClick={() => deleteComment(comment.id)}
                                                className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-red-700 transition-colors">
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* ── DESKTOP table ── */}
                                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[600px]">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                                    <th className="p-4 border-b">Comment</th>
                                                    <th className="p-4 border-b whitespace-nowrap">From</th>
                                                    <th className="p-4 border-b">Article</th>
                                                    <th className="p-4 border-b whitespace-nowrap">Date</th>
                                                    <th className="p-4 border-b text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {comments.map(comment => (
                                                    <tr key={comment.id} className="hover:bg-gray-50 transition-colors border-b last:border-0">
                                                        <td className="p-4 max-w-xs">
                                                            <p className="text-sm text-gray-700 line-clamp-2">{comment.content}</p>
                                                        </td>
                                                        <td className="p-4 text-sm font-medium text-gray-600 whitespace-nowrap">{comment.user_name}</td>
                                                        <td className="p-4 text-sm text-gray-500 max-w-[200px]">
                                                            <span className="line-clamp-1">{comment.post_title}</span>
                                                        </td>
                                                        <td className="p-4 text-xs text-gray-400 whitespace-nowrap">
                                                            {new Date(comment.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button onClick={() => deleteComment(comment.id)}
                                                                className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase hover:bg-red-700 transition-colors">
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
