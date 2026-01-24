import { fetchNewsByCategory } from "@/lib/data";
import CategoryFeed from "@/components/CategoryFeed";

export default async function NewsIndexPage() {
    const news = await fetchNewsByCategory('The Nation');
    return <CategoryFeed title="The Nation" news={news} />;
}
