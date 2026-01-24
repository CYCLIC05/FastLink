import { fetchFeaturedNews, fetchLatestNews } from "@/lib/data";
import HeroSection from "@/components/HeroSection";
import Sidebar from "@/components/Sidebar";

export default async function Home() {
  const featured = await fetchFeaturedNews();
  const latest = await fetchLatestNews();

  return (
    <div className="min-h-screen pb-16 bg-gray-50/30">
      <HeroSection featuredNews={featured} />

      <div className="container mx-auto px-4 mt-8 lg:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <main className="lg:col-span-8 flex flex-col gap-16">
          {/* Main Feed */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-6 bg-red-600 rounded-sm"></div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Latest News</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            <div className="flex flex-col gap-10">
              {latest.slice(0, 6).map(news => (
                <article key={news.id} className="group flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-64 h-56 md:h-44 flex-shrink-0 overflow-hidden rounded-xl bg-gray-200 shadow-sm relative">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl"></div>
                  </div>
                  <div className="flex-1 py-1">
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-sm text-white mb-2 tracking-wide ${news.category === 'Business' ? 'bg-teal-600' :
                      news.category === 'Sport' ? 'bg-orange-600' :
                        news.category === 'Lifestyle' ? 'bg-pink-600' :
                          'bg-red-600'
                      }`}>
                      {news.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-primary transition-colors cursor-pointer">
                      {news.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 leading-relaxed hidden sm:block">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                    </p>
                    <p className="text-xs font-semibold text-gray-400 flex items-center gap-2">
                      {news.author} <span className="w-1 h-1 bg-gray-300 rounded-full"></span> {news.date}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Business Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-6 bg-teal-600 rounded-sm"></div>
              <h2 className="text-2xl font-black text-teal-700 uppercase tracking-tight">Business</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {latest.filter(n => n.category === 'Business').slice(0, 4).map(news => (
                <article key={news.id} className="group cursor-pointer flex flex-col h-full">
                  <div className="overflow-hidden rounded-xl shadow-sm mb-4 h-52 relative">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl"></div>
                  </div>
                  <h4 className="font-bold text-lg leading-snug group-hover:text-teal-600 transition-colors mb-2 flex-grow">{news.title}</h4>
                  <p className="text-xs text-gray-400">{news.date}</p>
                </article>
              ))}
            </div>
          </section>
          {/* Health Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-6 bg-blue-600 rounded-sm"></div>
              <h2 className="text-2xl font-black text-blue-700 uppercase tracking-tight">Health</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {latest.filter(n => n.category === 'Health').slice(0, 2).map(news => (
                <article key={news.id} className="group cursor-pointer flex flex-col h-full">
                  <div className="overflow-hidden rounded-xl shadow-sm mb-4 h-48 relative">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-xl"></div>
                  </div>
                  <h4 className="font-bold text-lg leading-snug group-hover:text-blue-600 transition-colors mb-2">{news.title}</h4>
                </article>
              ))}
            </div>
          </section>

          {/* International Section */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1.5 h-6 bg-purple-600 rounded-sm"></div>
              <h2 className="text-2xl font-black text-purple-700 uppercase tracking-tight">International</h2>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="flex flex-col gap-6">
              {latest.filter(n => n.category === 'International').slice(0, 3).map(news => (
                <article key={news.id} className="group cursor-pointer flex gap-4 items-center">
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 relative">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-md leading-snug group-hover:text-purple-600 transition-colors">{news.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{news.date}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <div className="lg:col-span-4 space-y-8">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
