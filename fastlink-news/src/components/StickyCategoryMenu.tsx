'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    NewspaperIcon,
    BriefcaseIcon,
    HeartIcon,
    GlobeAltIcon,
    ComputerDesktopIcon,
    TrophyIcon
} from '@heroicons/react/24/outline'; // Adjust icons as needed

const categories = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'The Nation', path: '/The Nation', icon: NewspaperIcon },
    { name: 'Business', path: '/Business', icon: BriefcaseIcon },
    { name: 'Health', path: '/Health', icon: HeartIcon },
    { name: 'International', path: '/International', icon: GlobeAltIcon },
    { name: 'Technology', path: '/Technology', icon: ComputerDesktopIcon },
    { name: 'Sport', path: '/Sport', icon: TrophyIcon },
];

export default function StickyCategoryMenu() {
    const pathname = usePathname();

    // Only show on large screens
    return (
        <div className="hidden lg:flex flex-col gap-2 fixed left-0 top-1/2 transform -translate-y-1/2 z-40 bg-white p-2 text-gray-700 shadow-xl rounded-r-xl border border-l-0 border-gray-100">
            {categories.map((cat) => {
                const isActive = pathname === cat.path || (cat.path !== '/' && pathname.includes(cat.path));
                return (
                    <Link
                        key={cat.name}
                        href={cat.path}
                        className={`p-3 rounded-lg transition-all duration-300 group relative flex items-center justify-center ${isActive ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100'}`}
                        title={cat.name}
                    >
                        <cat.icon className="w-6 h-6" />

                        {/* Tooltip Label */}
                        <span className={`absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none`}>
                            {cat.name}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
