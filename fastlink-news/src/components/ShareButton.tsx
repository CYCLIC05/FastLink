"use client";

import { useState } from 'react';

interface ShareButtonProps {
    title: string;
    url?: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
    const [showCopied, setShowCopied] = useState(false);

    const handleShare = async () => {
        const shareUrl = url || window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out this article: ${title}`,
                    url: shareUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback to copy clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                setShowCopied(true);
                // Also show an alert as a fallback if the tooltip isn't noticed
                // alert('Link copied to clipboard!'); 
                setTimeout(() => setShowCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                alert('Could not copy link. Manually copy the URL from the browser bar.');
            }
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm uppercase tracking-wider"
                aria-label="Share article"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
            </button>
            {showCopied && (
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                    Link Copied!
                </span>
            )}
        </div>
    );
}
