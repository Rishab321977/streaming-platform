import Image from "next/image"
import { notFound } from "next/navigation"

import { fetchMediaById } from "../../_lib/api"
import { AddToListButton } from "@/app/_components/media/AddToListButton"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params
  const movie = await fetchMediaById(id)

  if (!movie) notFound()

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdropPath}`
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.posterPath}`

  return (
    <article className="relative min-h-screen">
      <div className="absolute inset-0 h-[70vh] w-full -z-10">
        <Image
          src={backdropUrl}
          alt={`${movie.title} backdrop`}
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-8 pt-[20vh] flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 w-64 md:w-80 rounded-lg overflow-hidden shadow-2xl relative aspect-[2/3]">
          <Image
            src={posterUrl}
            alt={`${movie.title} poster`}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-end pb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <time dateTime={movie.releaseDate}>
              {new Date(movie.releaseDate).getFullYear()}
            </time>
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex gap-2">
                <span>•</span>
                {movie.genres.join(", ")}
              </div>
            )}
          </div>

          <p className="text-lg leading-relaxed max-w-2xl">{movie.overview}</p>

          <div className="mt-8">
            {/* We will add the "Add to My List" interactive button here in the next step */}
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary/90 transition">
              Play Trailer
            </button>
            <AddToListButton mediaId={movie._id} />
          </div>
        </div>
      </div>
    </article>
  )
}
