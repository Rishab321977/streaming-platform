import { MediaCard } from "./_components/media/MediaCard";
import { fetchTrending } from "./_lib/api";

export default async function Home() {
  // This executes entirely on the server
  const trendingData = await fetchTrending();

  return (
    <section className="p-8" aria-labelledby="trending-heading">
      <header className="mb-6">
        <h2 id="trending-heading" className="text-3xl font-bold tracking-tight">
          Trending Now
        </h2>
      </header>

      <div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        role="feed"
        aria-busy="false"
      >
        {trendingData.map((movie: any, index: number) => (
          <MediaCard
            key={movie._id}
            media={movie}
            // Mark the first few images as priority so Next.js preloads them for Core Web Vitals
            isPriority={index < 6}
          />
        ))}
      </div>
    </section>
  );
}