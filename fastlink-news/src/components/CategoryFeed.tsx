import Link from 'next/link';
import { NewsItem } from '@/lib/data';

interface CategoryFeedProps {
    title: string;
    news: NewsItem[];
}

export default function CategoryFeed({ title, news }: CategoryFeedProps) {
    if (!news || news.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-black uppercase text-gray-900 mb-4">{title}</h1>
                <div className="bg-gray-50 rounded-xl p-12 border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No articles have been uploaded to this section yet.</p>
                    <p className="text-sm text-gray-400 mt-2">Check back soon!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-2 h-8 bg-primary rounded-sm"></div>
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">{title}</h1>
                <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map(item => (
                    <article key={item.id} className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                        <Link href={`/news/${item.id}`} className="block relative h-56 overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase rounded text-primary tracking-wider">
                                {item.category}
                            </div>
                        </Link>
                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-3">
                                <span>{item.date}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>{item.author}</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors">
                                <Link href={`/news/${item.id}`}>
                                    {item.title}
                                </Link>
                            </h2>
                            <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                                {item.excerpt || "Click to read the full story."}
                            </p>
                            <Link href={`/news/${item.id}`} className="text-primary text-sm font-bold uppercase tracking-wide hover:underline mt-auto">
                                Read More
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
