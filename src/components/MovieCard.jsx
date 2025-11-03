import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const API_KEY = "41e2bba9";
const DETAILS_URL = (id) => `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}&plot=full`;

function MovieCard({ movie, isFavorite = false, isAdding = false, onAddFavorite, onRemoveFavorite }) {
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!showModal) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow || "";
    };
  }, [showModal]);

  const openDetails = async () => {
    setShowModal(true);
    if (details) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(DETAILS_URL(movie.imdbID));
      const data = await res.json();
      if (data && data.Response === "True") {
        setDetails(data);
      } else {
        setError(data?.Error || "Details not available");
      }
    } catch (err) {
      setError("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayClick = () => {
    navigate(`/movie/${movie.imdbID}`);
  };

  return (
    <div className="relative bg-linear-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700/50 shadow-xl rounded-2xl p-5 text-center transform hover:-translate-y-3 hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 ease-out overflow-hidden group">
      
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-600/0 via-pink-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-pink-600/5 group-hover:to-purple-600/10 transition-all duration-500 pointer-events-none"></div>
      
      <div className="overflow-hidden rounded-xl shadow-lg relative z-10 border border-slate-700/50 group-hover:border-purple-500/50 transition-all duration-500">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
          alt={movie.Title}
          className="w-full h-64 object-cover rounded-lg group-hover:scale-110 transition-transform duration-700"
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-t from-black/80 via-black/50 to-transparent pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayClick();
            }}
            className="pointer-events-auto bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white text-xl font-bold rounded-full w-16 h-16 shadow-2xl transition-all duration-300 transform hover:scale-125 flex items-center justify-center"
            aria-label={`Play ${movie.Title}`}
          >
            ▶
          </button>
        </div>
      </div>

      <h2 className="font-extrabold mt-5 text-lg bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent truncate tracking-wide relative z-10">
        {movie.Title}
      </h2>
      <p className="text-sm text-gray-400 mt-1 relative z-10 font-medium">{movie.Year}</p>

      <div className="mt-5 flex justify-center gap-3 relative z-10">
        <button
          onClick={openDetails}
          className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
          aria-haspopup="dialog"
        >
          View Details
        </button>

        <button 
          onClick={() => {
            if (isFavorite) {
              if (typeof onRemoveFavorite === "function") onRemoveFavorite(movie.imdbID);
            } else {
              if (typeof onAddFavorite === "function") onAddFavorite(movie);
            }
          }}
          disabled={isAdding}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
            isFavorite
              ? "bg-linear-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 hover:shadow-amber-500/50"
              : "bg-linear-to-r from-pink-500 to-purple-500 text-white hover:from-pink-400 hover:to-purple-400 hover:shadow-pink-500/50"
          } ${isAdding ? "opacity-60 cursor-wait" : ""}`}
          aria-pressed={isFavorite}
        >
          {isAdding ? (
            <span className="flex items-center gap-2">
              <svg 
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>{isFavorite ? "Updating" : "Adding..."}</span>
            </span>
          ) : (
            isFavorite ? "Remove from favorites" : "Add to Favorites"
          )}
        </button>
      </div>

      {/* Details Modal */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in">
            <div
              className="absolute inset-0 bg-black/80"
              onClick={() => setShowModal(false)}
            />
            <div className="relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 overflow-auto max-h-[85vh] border border-purple-500/30 animate-slide-up">
              <div className="p-6 border-b border-purple-500/30 flex items-start justify-between bg-linear-to-r from-purple-600/20 to-pink-600/20">
                <div>
                  <h3 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {movie.Title}{" "}
                    <span className="text-base text-gray-400">({movie.Year})</span>
                  </h3>
                  <p className="text-sm text-gray-400 capitalize mt-1 font-medium">{movie.Type}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white text-2xl font-semibold hover:bg-white/10 w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex justify-center">
                  <img
                    src={
                      movie.Poster !== "N/A"
                        ? movie.Poster
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={movie.Title}
                    className="w-60 rounded-xl shadow-2xl border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-2 space-y-4 text-sm leading-relaxed">
                  {loading && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <span>Loading details…</span>
                    </div>
                  )}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                      <p className="text-red-400">{error}</p>
                    </div>
                  )}

                  {details && (
                    <>
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                        <span className="font-semibold text-purple-400">Plot:</span>{" "}
                        <span className="text-gray-300">{details.Plot}</span>
                      </div>
                      <p>
                        <span className="font-semibold text-purple-400">Genre:</span>{" "}
                        <span className="text-gray-300">{details.Genre}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-purple-400">Director:</span>{" "}
                        <span className="text-gray-300">{details.Director}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-purple-400">Actors:</span>{" "}
                        <span className="text-gray-300">{details.Actors}</span>
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <p>
                          <span className="font-semibold text-purple-400">Released:</span>{" "}
                          <span className="text-gray-300">{details.Released}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-purple-400">Runtime:</span>{" "}
                          <span className="text-gray-300">{details.Runtime}</span>
                        </p>
                      </div>
                      <p>
                        <span className="font-semibold text-purple-400">Language:</span>{" "}
                        <span className="text-gray-300">{details.Language}</span>
                      </p>
                      <p>
                        <span className="font-semibold text-purple-400">Awards:</span>{" "}
                        <span className="text-gray-300">{details.Awards}</span>
                      </p>
                      <div className="bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/30">
                        <span className="font-semibold text-purple-400">IMDB Rating:</span>{" "}
                        <span className="text-xl font-bold text-white">{details.imdbRating}</span>
                        <span className="text-gray-400"> / 10</span>
                      </div>
                      {details.BoxOffice && (
                        <p>
                          <span className="font-semibold text-purple-400">
                            Box Office:
                          </span>{" "}
                          <span className="text-gray-300">{details.BoxOffice}</span>
                        </p>
                      )}
                      {details.Ratings?.length > 0 && (
                        <div className="pt-2">
                          <p className="font-semibold text-purple-400 mb-2">Ratings:</p>
                          <div className="space-y-2">
                            {details.Ratings.map((r) => (
                              <div key={r.Source} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex justify-between items-center">
                                <span className="text-gray-300">{r.Source}</span>
                                <span className="font-semibold text-white">{r.Value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-purple-500/30 flex justify-end gap-3 bg-slate-800/50">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-lg bg-linear-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}


export default MovieCard;
