"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SubmitPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        author: '',
        category: 'The Nation',
        content: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [mediaFile, setMediaFile] = useState<File | null>(null);

    const categories = [
        'The Nation', 'Business', 'Lifestyle', 'Entertainment', 'Sport', 'Climate', 'Health', 'International'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('Uploading...');

        try {
            let imageUrl = '';
            let mediaUrl = '';

            // 1. Upload Image (Required)
            if (!imageFile) throw new Error("Image is required.");
            const imageExt = imageFile.name.split('.').pop();
            const imagePath = `${Date.now()}-image.${imageExt}`;
            const { error: imgError } = await supabase.storage.from('article-images').upload(imagePath, imageFile);
            if (imgError) throw imgError;
            const { data: imgData } = supabase.storage.from('article-images').getPublicUrl(imagePath);
            imageUrl = imgData.publicUrl;

            // 2. Upload Media (Optional)
            if (mediaFile) {
                const mediaExt = mediaFile.name.split('.').pop();

                const mediaPath = `${Date.now()}-media.${mediaExt}`;
                const { error: mediaError } = await supabase.storage.from('article-media').upload(mediaPath, mediaFile);
                if (mediaError) throw mediaError;
                const { data: mediaData } = supabase.storage.from('article-media').getPublicUrl(mediaPath);
                mediaUrl = mediaData.publicUrl;
            }

            // 3. Insert Post
            const { error: insertError } = await supabase.from('posts').insert({
                title: form.title,
                author: form.author,
                category: form.category,
                content: form.content,
                image_url: imageUrl,
                media_url: mediaUrl || null,
                status: 'draft' // Submissions are always drafts
            });
            if (insertError) throw insertError;

            setStatus('Success! Article submitted for review.');
            setForm({ title: '', author: '', category: 'The Nation', content: '' });
            setImageFile(null);
            setMediaFile(null);
            // setTimeout(() => router.push('/'), 1500);

        } catch (error: any) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-black mb-8 border-l-8 border-red-600 pl-4">Submit an Article</h1>
            <p className="mb-8 text-gray-600">Have a story to tell? Submit it below. All articles are reviewed by our editors before publication.</p>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Status Message */}
                {status && (
                    <div className={`p-4 rounded-md font-bold text-sm ${status.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {status}
                    </div>
                )}

                {/* Writer Name */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Writer Name</label>
                    <input
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        value={form.author}
                        onChange={e => setForm({ ...form, author: e.target.value })}
                    />
                </div>

                {/* Section / Category */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Section</label>
                    <select
                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-primary outline-none bg-white"
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Headline</label>
                    <input
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-primary outline-none"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
                    <textarea
                        required
                        rows={8}
                        className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-primary outline-none"
                        value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })}
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Article Image (Required)</label>
                    <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                </div>

                {/* Media Upload */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Video/Audio (Optional)</label>
                    <input
                        type="file"
                        accept="video/*,audio/*"
                        onChange={e => setMediaFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-4 rounded-md font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Submitting...' : 'Submit Article'}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-2">Articles require approval before appearing on the site.</p>
                </div>

            </form>
        </div>
    );
}
