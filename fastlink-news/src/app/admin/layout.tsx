import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-800">
                    <span className="font-black text-xl tracking-tight">FASTLINK <span className="text-primary">ADMIN</span></span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/dashboard" className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors font-medium">
                        Dashboard (All Posts)
                    </Link>
                    <Link href="/admin/writers" className="block px-4 py-2 rounded hover:bg-gray-800 transition-colors font-medium text-gray-400">
                        Writers (Coming Soon)
                    </Link>
                    <Link href="/" className="block px-4 py-2 mt-auto border-t border-gray-800 pt-4 text-sm text-gray-400 hover:text-white transition-colors">
                        ← View Site
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
