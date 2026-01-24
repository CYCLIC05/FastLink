import { fetchNewsById } from "@/lib/data";
import { notFound } from "next/navigation";
import ShareButton from "@/components/ShareButton";

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
        <article className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl">
                {/* Header */}
                <header className="mb-8 md:mb-12">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <span className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-sm tracking-widest">
                                {article.category}
                            </span>
                            <span className="text-gray-400 text-sm font-medium">
                                {article.date} | By <span className="text-gray-900 font-bold">{article.author}</span>
                            </span>
                        </div>
                        <ShareButton title={article.title} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                        {article.title}
                    </h1>

                    <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </header>

                {/* Content */}
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed mx-auto whitespace-pre-wrap">
                    {article.content}
                </div>
            </div>
        </article>
    );
}
