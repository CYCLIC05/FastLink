'use client';

import { useEffect, useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

export default function ViewCounter({ postId, initialViews = 0 }: { postId: string, initialViews?: number }) {
    const [views, setViews] = useState(initialViews);
    const [hasViewed, setHasViewed] = useState(false);

    useEffect(() => {
        // Prevent double counting in strict mode or re-renders
        if (hasViewed) return;

        const incrementView = async () => {
            try {
                const res = await fetch('/api/views', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: postId }),
                });

                if (res.ok) {
                    // Optimistically update or re-fetch if needed. 
                    // For now, we assume +1
                    setViews(prev => prev + 1);
                    setHasViewed(true);
                }
            } catch (error) {
                console.error('Failed to increment view count:', error);
            }
        };

        incrementView();
    }, [postId, hasViewed]);

    return (
        <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
            <EyeIcon className="w-4 h-4" />
            <span>{views.toLocaleString()} views</span>
        </div>
    );
}
