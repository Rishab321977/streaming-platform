import Image from "next/image"
import Link from "next/link"

interface MediaCardProps {
  media: {
    _id: string
    title: string
    posterPath: string
    popularity: number
  }
  isPriority?: boolean // Used to trigger LCP optimization
}

export function MediaCard({ media, isPriority = false }: MediaCardProps) {
  const imageUrl = `https://image.tmdb.org/t/p/w500${media.posterPath}`

  return (
    <article
      className="relative rounded-lg overflow-hidden group cursor-pointer focus-within:ring-2 focus-within:ring-primary outline-none"
      aria-label={`View details for ${media.title}`}
      tabIndex={0}
    >
      <div className="aspect-[2/3] w-full relative bg-muted">
      <Link href={`/movie/${media._id}`} className="absolute inset-0 z-10" aria-hidden="true">
        <Image
          src={imageUrl}
          alt={`Poster for ${media.title}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={isPriority}
        />
      </Link>
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-end p-4"
        aria-hidden="true"
      >
        <h3 className="text-white font-semibold truncate">{media.title}</h3>
      </div>
    </article>
  )
}
