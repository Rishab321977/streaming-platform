"use client";

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchCatalog } from '../_lib/api';
import { MediaCard } from '../_components/media/MediaCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExplorePage() {
  const { ref, inView } = useInView({ rootMargin: '200px' });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['catalog'],
    queryFn: fetchCatalog,
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Automatically fetch the next page when the sentinel element comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
        console.log("first")
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === 'pending') return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-6">Explore All Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          // The aspect-[2/3] ensures the skeleton perfectly matches the future poster
          <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />
        ))}
      </div>
    </section>
  );
  if (status === 'error') return <div className="p-8 text-red-500">Error loading data.</div>;

  return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-6">Explore All Movies</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map((movie: any) => (
              <MediaCard key={movie._id} media={movie} />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Sentinel element for the Intersection Observer */}
      <div ref={ref} className="h-20 w-full flex items-center justify-center mt-8">
        {isFetchingNextPage && <span className="text-muted-foreground">Loading more...</span>}
      </div>
    </section>
  );
}