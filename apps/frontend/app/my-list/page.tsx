import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { fetchMySavedList } from "../_lib/api";
import { MediaCard } from "../_components/media/MediaCard";
import Link from "next/link";

export default async function MyListPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.accessToken) {
    // Failsafe redirect (though our Edge Middleware should catch this first)
    redirect('/');
  }

  const savedMovies = await fetchMySavedList(session.accessToken);

  return (
    <section className="p-8 max-w-7xl mx-auto min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My List</h1>
        <p className="text-muted-foreground mt-2">
          Movies and shows you've saved to watch later.
        </p>
      </header>

      {/* Empty State Handling */}
      {savedMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg border-muted p-8 text-center bg-muted/20">
          <h2 className="text-xl font-semibold mb-2">Your list is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Looks like you haven't saved anything yet. Browse our catalog to find your next favorite movie.
          </p>
          <Link
            href="/explore"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        /* Populated Grid */
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {savedMovies.map((movie: any) => (
            <MediaCard key={movie._id} media={movie} />
          ))}
        </div>
      )}
    </section>
  );
}