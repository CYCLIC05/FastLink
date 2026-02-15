import { fetchNewsById } from "@/lib/data";
import { notFound } from "next/navigation";
import ShareButton from "@/components/ShareButton";
import ViewCounter from "@/components/ViewCounter";
import CommentSection from "@/components/CommentSection";
import RelatedPosts from "@/components/RelatedPosts";
import Sidebar from "@/components/Sidebar";
import PrintButton from "@/components/PrintButton";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
    const { id } = await params;
    const article = await fetchNewsById(id);

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content Column */}
                    <main className="lg:col-span-8">
                        <article className="max-w-none">
                            <header className="mb-8 md:mb-12">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-sm tracking-widest">
                                            {article.category}
                                        </span>
                                        <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                                            {article.date} <span className="w-1 h-1 bg-gray-300 rounded-full"></span> By <span className="text-gray-900 font-bold">{article.author}</span>
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <PrintButton />
                                        <ShareButton title={article.title} />
                                    </div>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                                    {article.title}
                                </h1>

                                <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                                    <ViewCounter postId={article.id} initialViews={article.views} />
                                    {/* Additional metadata tags can go here */}
                                    {article.tags && article.tags.length > 0 && (
                                        <div className="flex gap-2">
                                            {article.tags.map(tag => (
                                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-lg mb-10">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </header>

                            {/* Content */}
                            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed whitespace-pre-wrap mb-16">
                                {article.content}
                            </div>

                            {/* Footer of Article */}
                            <div className="border-t border-b border-gray-100 py-8 mb-12 flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="font-bold text-gray-900">
                                    Share this article:
                                </div>
                                <ShareButton title={article.title} />
                            </div>

                            {/* Related Posts Slideshow */}
                            <div className="no-print">
                                <RelatedPosts category={article.category} currentPostId={article.id} />
                            </div>

                            {/* Comments */}
                            <div className="no-print">
                                <CommentSection postId={article.id} />
                            </div>
                        </article>
                    </main>

                    {/* Sidebar Column */}
                    <aside className="lg:col-span-4 space-y-8">
                        <Sidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
}
