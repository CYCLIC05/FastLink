'use client';

import { useState, useEffect } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface Comment {
    id: string;
    user_name: string;
    content: string;
    created_at: string;
}

export default function CommentSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        content: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments?postId=${postId}`);
            const data = await res.json();
            if (data.comments) {
                setComments(data.comments);
            }
        } catch (err) {
            console.error('Failed to fetch comments', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    postId,
                    userName: formData.userName,
                    userEmail: formData.userEmail,
                    content: formData.content
                })
            });

            if (!res.ok) throw new Error('Failed to submit comment');

            const data = await res.json();

            // Add new comment to list
            setComments([data.comment, ...comments]);

            // Reset form
            setFormData({ userName: '', userEmail: '', content: '' });
            setSuccess('Comment posted successfully!');

        } catch (err) {
            setError('Failed to post comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 rounded-xl p-6 md:p-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Discussion ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Leave a Reply</h4>

                {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded text-sm">{error}</div>}
                {success && <div className="mb-4 text-green-600 bg-green-50 p-3 rounded text-sm">{success}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                        <input
                            type="text"
                            id="name"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email * <span className="text-gray-400 font-normal">(will not be published)</span></label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            value={formData.userEmail}
                            onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-1">Comment *</label>
                    <textarea
                        id="comment"
                        required
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Posting...' : 'Post Comment'}
                </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 italic">No comments yet. Be the first to share your thoughts!</div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                            <div className="flex-shrink-0">
                                <UserCircleIcon className="w-10 h-10 text-gray-300" />
                            </div>
                            <div className="flex-grow">
                                <div className="bg-white p-4 rounded-lg rounded-tl-none shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <h5 className="font-bold text-gray-900">{comment.user_name}</h5>
                                        <span className="text-xs text-gray-400">
                                            {new Date(comment.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
