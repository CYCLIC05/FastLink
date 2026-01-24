"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function EditorPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'The Nation',
        content: '',
        image: '',
        author: 'Admin User' // Ideally from auth context
    });

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        let { error: uploadError } = await supabase.storage
            .from('article-images')
            .upload(filePath, file);

        if (uploadError) {
            alert('Error uploading image');
            return null;
        }

        const { data } = supabase.storage.from('article-images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('posts')
                .insert([
                    {
                        title: formData.title,
                        category: formData.category,
                        content: formData.content,
                        image_url: formData.image,
                        author: formData.author,
                        status: 'published'
                    },
                ]);

            if (error) throw error;

            alert('Article published successfully!');
            router.push('/admin');
        } catch (error) {
            alert('Error creating post');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 className="admin-brand" style={{ border: 'none', marginBottom: '20px' }}>Create New Article</h1>

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>

                <div className="form-group">
                    <label className="form-label">Article Title</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter a catchy headline"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            className="form-select"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>The Nation</option>
                            <option>Business</option>
                            <option>Policy Radar</option>
                            <option>Lifestyle</option>
                            <option>Sport</option>
                            <option>Climate</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image URL (or Upload)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Paste URL (Upload coming next)"
                            value={formData.image}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Content</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Write your story here..."
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                        required
                    ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => router.back()} style={{ padding: '12px 24px', background: 'none', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Publishing...' : 'Publish Article'}
                    </button>
                </div>

            </form>
        </div>
    );
}
