import MovieCard from "./MovieCard";
import { useState, useEffect } from "react";
import "./MovieList.css";

function MovieList({ movies, favorites = [], onAddFavorite, onRemoveFavorite, addingFavorites = [] }) {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    setShouldAnimate(true);
    return () => setShouldAnimate(false);
  }, [movies]);

  if (movies.length === 0) {
    return <p className="text-center text-gray-400 mt-6">No movies found.</p>;
  }


  // pass handlers through to App for centralized toasts

  const isFavorite = (movie) => favorites.some((f) => f.imdbID === movie.imdbID);

  return (
    <div className="relative">

      <div className="movie-grid">
        {movies.map((movie, index) => (
          <div 
            key={movie.imdbID}
            className={shouldAnimate ? `movie-card-animated delay-${index % 20}` : ""}
          >
            <MovieCard
              movie={movie}
              isFavorite={isFavorite(movie)}
              isAdding={addingFavorites.includes(movie.imdbID)}
              onAddFavorite={onAddFavorite}
              onRemoveFavorite={onRemoveFavorite}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
export default MovieList;
