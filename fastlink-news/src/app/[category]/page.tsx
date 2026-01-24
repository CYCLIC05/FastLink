import { fetchNewsByCategory } from "@/lib/data";
import CategoryFeed from "@/components/CategoryFeed";
import { notFound } from "next/navigation";

// Map URL slugs to Database Categories
const categoryMap: { [key: string]: string } = {
    'business': 'Business',
    'lifestyle': 'Lifestyle',
    'entertainment': 'Entertainment',
    'sports': 'Sport',
    'climate': 'Climate',
    'health': 'Health',
    'international': 'International',
    'news': 'The Nation'
};

interface PageProps {
    params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { category } = await params;

    const dbCategory = categoryMap[category.toLowerCase()];

    if (!dbCategory) {
        notFound();
    }

    const news = await fetchNewsByCategory(dbCategory);

    return <CategoryFeed title={dbCategory} news={news} />;
}
