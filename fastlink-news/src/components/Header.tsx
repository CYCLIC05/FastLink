"use client";

import { useState } from 'react';
import Link from 'next/link';
import BreakingNewsTicker from './BreakingNewsTicker';
import SearchBar from './SearchBar';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'HOME', path: '/' },
        { name: 'THE NATION', path: '/news' },
        { name: 'BUSINESS', path: '/business' },
        { name: 'LIFESTYLE', path: '/lifestyle' },
        { name: 'ENTERTAINMENT', path: '/entertainment' },
        { name: 'SPORT', path: '/sports' },
        { name: 'CLIMATE', path: '/climate' },
        { name: 'HEALTH', path: '/health' },
        { name: 'INTERNATIONAL', path: '/international' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
            <div className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <div className="container mx-auto flex justify-between px-4 py-2">
                    <div className="date-display">
                        {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex gap-4 items-center">
                        <span className="cursor-pointer hover:text-primary transition-colors">Follow Us</span>
                        <SearchBar />
                    </div>
                </div>
            </div>

            <div className="container mx-auto flex items-center justify-between px-4 py-5 md:py-6">
                <div className="logo relative group">
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl md:text-3xl font-black tracking-tighter text-primary">FASTLINK</span>
                        <span className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900">NEWSAFRICA</span>
                        <span className="animate-pulse text-3xl font-black text-primary ml-0.5">_</span>
                    </Link>
                </div>

                <button
                    className="md:hidden text-2xl p-2 text-gray-700 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    )}
                </button>
            </div>

            <nav className={`${isMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden md:max-h-none md:opacity-100 md:py-0'} transition-all duration-300 ease-in-out md:block border-t border-gray-100`}>
                <div className="container mx-auto">
                    <ul className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-8 gap-4 px-4 font-bold text-sm tracking-wide text-gray-600">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.path}
                                    className="block py-2 md:py-4 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary relative group"
                                >
                                    {item.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full md:block hidden"></span>
                                </Link>
                            </li>
                        ))}
                        <li className="md:hidden pt-4 border-t border-gray-100">

                        </li>
                    </ul>
                </div>
            </nav>

            <BreakingNewsTicker />

        </header>
    );
}
