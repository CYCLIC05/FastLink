import Link from 'next/link';
import { NewsItem } from '@/lib/data';

interface HeroSectionProps {
    featuredNews: NewsItem[];
}

export default function HeroSection({ featuredNews }: HeroSectionProps) {
    const mainStory = featuredNews[0];
    const subStories = featuredNews.slice(1, 5);

    if (!mainStory) return null;

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[550px]">
                {/* Main Hero Card */}
                <div className="lg:col-span-8 relative group overflow-hidden rounded-2xl shadow-xl h-[400px] lg:h-full">
                    <Link href={`/news/${mainStory.id}`} className="block h-full w-full">
                        <img
                            src={mainStory.image}
                            alt={mainStory.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 md:p-10 flex flex-col justify-end">
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-extrabold text-white uppercase bg-red-600 rounded-sm w-fit tracking-wider">
                                {mainStory.category}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight drop-shadow-lg">
                                {mainStory.title}
                            </h2>
                            <p className="text-gray-200 text-sm font-semibold flex items-center gap-2">
                                <span className="text-red-500">●</span> {mainStory.author} <span className="text-gray-400">|</span> {mainStory.date}
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Sub Stories Grid */}
                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-4 gap-4 h-auto lg:h-full">
                    {subStories.map((story) => (
                        <div key={story.id} className="relative group overflow-hidden rounded-xl shadow-md h-48 lg:h-auto border border-gray-100/10">
                            <Link href={`/news/${story.id}`} className="block h-full w-full">
                                <img
                                    src={story.image}
                                    alt={story.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-4 flex flex-col justify-end">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider bg-black/50 px-1 rounded">
                                            {story.category}
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-red-400 transition-colors">
                                        {story.title}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
