'use client';

import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function HomepageFeedback() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate submission or create an API for general feedback
        // For now, we'll just simulate a success after a delay
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setMessage('');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <section className="bg-gray-900 text-white rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">We Value Your Feedback</h2>
                <p className="text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
                    Have a story tip, a question, or just want to say hello? Drop us a message below and we'll get back to you.
                </p>

                {status === 'success' ? (
                    <div className="bg-green-500/20 text-green-200 border border-green-500/30 p-4 rounded-xl backdrop-blur-sm animate-fade-in">
                        <p className="font-bold flex items-center justify-center gap-2">
                            Message sent successfully! Thank you.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="email"
                                placeholder="Your Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all backdrop-blur-sm"
                            />
                            <div className="relative">
                                {/* Only one input/button needed really if it's just "Leave a reply" like a newsletter, 
                                    but requirement said "reply can be made", implying a form */}
                            </div>
                        </div>
                        <textarea
                            placeholder="Your Message..."
                            required
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all backdrop-blur-sm resize-none"
                        ></textarea>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2 group"
                        >
                            {status === 'submitting' ? 'Sending...' : (
                                <>
                                    Send Message
                                    <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
