import Link from 'next/link';
import { fetchTrendingNews } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'; // Need check if this works in Server Component or just use SVG

export default async function Sidebar() {
    const topStories = await fetchTrendingNews();

    // Fetch recent comments for sidebar
    const { data: recentComments } = await supabase
        .from('comments')
        .select('id, user_name, content, post_id, created_at')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(3);

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

            {/* Recent Comments Section */}
            {recentComments && recentComments.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-sm font-bold mb-6 border-l-4 border-blue-500 pl-3 uppercase tracking-wider text-gray-800">
                        Recent Comments
                    </h3>
                    <ul className="space-y-6">
                        {recentComments.map((comment) => (
                            <li key={comment.id} className="group">
                                <Link href={`/news/${comment.post_id}`} className="flex gap-3 items-start">
                                    <div className="bg-blue-50 text-blue-500 rounded-full p-1.5 flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-gray-900 text-xs">{comment.user_name}</span>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 group-hover:text-primary transition-colors">
                                            "{comment.content}"
                                        </p>
                                        <span className="text-[10px] text-primary mt-1 block font-medium opacity-0 group-hover:opacity-100 transition-opacity">Read more</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </aside>
    );
}
