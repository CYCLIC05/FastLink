"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple client-side check as requested
        if (password === 'fastlinknews.ng') {
            // Set a simple flag in localStorage
            localStorage.setItem('admin_auth', 'true');
            router.push('/admin/dashboard');
        } else {
            setError('Invalid Password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">ADMIN ACCESS</h1>
                    <p className="text-gray-500 text-sm mt-2">FastLink News Africa</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            required
                            placeholder="Enter Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm font-bold text-center bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                    >
                        Login
                    </button>

                    <div className="text-center">
                        <a href="/" className="text-xs text-gray-400 hover:text-gray-600">Return to Home</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
