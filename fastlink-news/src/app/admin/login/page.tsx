"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../admin.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'admin@fastlink.com' && password === 'admin123') {
            router.push('/admin');
        } else {
            setError('Invalid credentials (Try: admin@fastlink.com / admin123)');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ textAlign: 'center', color: 'var(--primary-red)', marginBottom: '10px' }}>FASTLINK <span style={{ color: 'var(--primary-green)' }}>LOGIN</span></h1>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Sign in to manage your articles</p>

                {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Sign In</button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                    <a href="/" style={{ textDecoration: 'underline' }}>Back to Homepage</a>
                </div>
            </div>
        </div>
    );
}
