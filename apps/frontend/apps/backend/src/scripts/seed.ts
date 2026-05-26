import mongoose from "mongoose"
import dotenv from "dotenv"
import Media from "../models/Media"
import { connectDB } from "../config/db"

dotenv.config()

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
  },
}

const seedDatabase = async () => {
  await connectDB();

  try {
    console.log('Fetching trending movies from TMDB...');
    let insertedCount = 0;

    for (let page = 1; page <= 5; page++) {
      const response = await fetch(`${TMDB_BASE_URL}/trending/movie/day?language=en-US&page=${page}`, OPTIONS);
      const data = await response.json();
      const movies = data.results;

      for (const movie of movies) {
        await Media.findOneAndUpdate(
          { tmdbId: movie.id },
          {
            tmdbId: movie.id,
            type: 'movie',
            title: movie.title || movie.name,
            overview: movie.overview,
            releaseDate: movie.release_date ? new Date(movie.release_date) : null,
            posterPath: movie.poster_path,
            backdropPath: movie.backdrop_path,
            popularity: movie.popularity,
          },
          { upsert: true, new: true }
        );
        insertedCount++;
      }
      console.log(`Processed page ${page}...`);
    }

    console.log(`✅ Successfully seeded ${insertedCount} movies into MongoDB.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase()
