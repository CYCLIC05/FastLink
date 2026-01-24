export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-2xl font-black tracking-tighter">
                        <span className="text-primary">FASTLINK</span>
                        <span className="text-gray-900">NEWSAFRICA</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-500 uppercase tracking-wide">
                        <a href="#" className="hover:text-primary transition-colors">Home</a>
                        <a href="#" className="hover:text-primary transition-colors">About Us</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="/submit" className="hover:text-primary transition-colors text-xs text-green-600">Submit Article</a>
                        <a href="/admin" className="hover:text-primary transition-colors text-xs text-red-500">Admin Login</a>
                    </div>
                    <div className="text-xs font-medium text-gray-400">
                        &copy; {new Date().getFullYear()} Fastlink News Africa. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
