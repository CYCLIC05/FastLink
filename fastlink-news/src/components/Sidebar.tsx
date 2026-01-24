import Link from 'next/link';
import { fetchTrendingNews } from '@/lib/data';

export default async function Sidebar() {
    const topStories = await fetchTrendingNews();

    return (
        <aside className="space-y-8 sticky top-24">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-bold mb-6 border-l-4 border-red-500 pl-3 uppercase tracking-wider text-gray-800">
                    Trending Now
                </h3>
                <ol className="space-y-6">
                    {topStories.map((story: any, index: number) => (
                        <li key={story.id} className="group">
                            <Link href={`/news/${story.id}`} className="flex gap-4 items-start">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 font-bold rounded-full group-hover:bg-primary group-hover:text-white transition-all duration-300 text-sm border border-gray-100">
                                    {index + 1}
                                </span>
                                <div>
                                    <span className="text-[10px] text-primary font-bold uppercase mb-1 block opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1">
                                        {story.category}
                                    </span>
                                    <span className="font-semibold text-gray-700 leading-snug group-hover:text-primary transition-colors text-sm block">
                                        {story.title}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Ad Placeholder Removed */}
        </aside>
    );
}
