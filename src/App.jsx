import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";
import MovieCard from "./components/MovieCard";
import Toast from "./components/Toast";

const API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=41e2bba9"

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("Avengers");

  const fetchMovies = async (term = searchTerm) => {
    try {
      const q = term || "";
      const response = await fetch(`${API_URL}&s=${encodeURIComponent(q)}`);
      const data = await response.json();
      setMovies(data.Search || []);
    } catch (err) {
      console.error("Failed to fetch movies", err);
      setMovies([]);
    }
  };

  // load favorites from localStorage
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [toasts, setToasts] = useState([]); // queued toasts
  const toastTimersRef = useRef({});
  const [addingFavorites, setAddingFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (_) {
        setFavorites([]);
      }
    }

    fetchMovies();
  }, []);
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie) => {
    setAddingFavorites((s) => (s.includes(movie.imdbID) ? s : [...s, movie.imdbID]));

    (async () => {
      try {
        const API_KEY = "41e2bba9";
        const res = await fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}&plot=full`);
        const data = await res.json();
        const toStore = data && data.Response === "True" ? data : movie;
        setFavorites((prev) => {
          if (prev.some((m) => m.imdbID === toStore.imdbID)) return prev;
          return [toStore, ...prev];
        });
  addToast(`${movie.Title} added to favorites`, "success");
      } catch (err) {
        setFavorites((prev) => {
          if (prev.some((m) => m.imdbID === movie.imdbID)) return prev;
          return [movie, ...prev];
        });
  addToast(`${movie.Title} added to favorites`, "success");
      } finally {
        setAddingFavorites((s) => s.filter((id) => id !== movie.imdbID));
      }
    })();
  };

  const removeFavorite = (imdbID) => {
    setFavorites((prev) => prev.filter((m) => m.imdbID !== imdbID));
        addToast(`Removed from favorites`, "info");
  };
      function addToast(message, type = "info", duration = 2500) {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
        setToasts((t) => [...t, { id, message, type, duration }]);
        const timer = setTimeout(() => {
          setToasts((t) => t.filter((x) => x.id !== id));
          delete toastTimersRef.current[id];
        }, duration + 300);
        toastTimersRef.current[id] = timer;
      }

      function removeToast(id) {
        setToasts((t) => t.filter((x) => x.id !== id));
        if (toastTimersRef.current[id]) {
          clearTimeout(toastTimersRef.current[id]);
          delete toastTimersRef.current[id];
        }
      }

  return (
  <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <Header />
      {toasts.length > 0 && (
        <div className="fixed left-1/2 top-6 z-50 transform -translate-x-1/2 pointer-events-none flex flex-col items-center gap-2">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <Toast id={t.id} message={t.message} type={t.type} duration={t.duration} onClose={removeToast} />
            </div>
          ))}
        </div>
      )}

  <main className="container mx-auto px-4 py-10 w-full max-w-6xl min-h-[60vh] flex flex-col items-center justify-center relative z-10">
        <section className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-linear-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-3">
            Discover Movies
          </h1>
          <p className="mt-2 text-lg text-gray-300 font-light">Search and explore your favorite films</p>
        </section>
        
        <div className="flex flex-col items-center w-full gap-6">
          <div className="w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={fetchMovies} />
            </div>
          </div>

          <div className="mt-2">
            <button
              onClick={() => setShowFavorites(true)}
              className="group relative inline-flex items-center gap-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/50 hover:shadow-2xl"
              aria-haspopup="dialog"
              aria-label={`Open favorites (${favorites.length})`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white group-hover:animate-pulse" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-7.829a4 4 0 010-5.656z" />
              </svg>
              <span className="whitespace-nowrap font-semibold">My Favorites</span>
              <span className="inline-flex items-center justify-center bg-white/30 backdrop-blur text-sm text-white font-bold px-3 py-1 rounded-full min-w-8">
                {favorites.length}
              </span>
            </button>
          </div>
        </div>

        {/* Movie list */}
        <section className="mt-12 w-full">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/10">
            <MovieList movies={movies} favorites={favorites} addingFavorites={addingFavorites} onAddFavorite={addFavorite} onRemoveFavorite={removeFavorite} />
          </div>
        </section>
      </main>

      <Footer />

      {showFavorites && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowFavorites(false)} />

          <div className="relative bg-linear-to-br from-slate-800 to-slate-900 text-gray-100 rounded-2xl shadow-2xl max-w-5xl w-full mx-4 overflow-hidden max-h-[85vh] border border-purple-500/30 animate-slide-up">
            <div className="p-6 border-b border-purple-500/30 flex items-center justify-between bg-linear-to-r from-purple-600 to-pink-600">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.657l-6.828-7.829a4 4 0 010-5.656z" />
                </svg>
                <h3 className="text-2xl font-bold text-white">Your Favorites</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (favorites.length === 0) return;
                    if (window.confirm("Clear all favorites? This cannot be undone.")) {
                      setFavorites([]);
                      addToast("Cleared all favorites", "info");
                    }
                  }}
                  className="text-white/90 hover:text-white hover:bg-white/20 text-sm font-medium bg-white/10 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Clear all
                </button>
                <button 
                  onClick={() => setShowFavorites(false)} 
                  className="text-white hover:text-gray-200 text-2xl hover:bg-white/20 w-10 h-10 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto max-h-[calc(85vh-180px)]">
              {favorites.length === 0 && (
                <div className="text-center py-16">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-600 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="text-lg text-gray-400">No favorites yet</p>
                  <p className="text-sm text-gray-500 mt-2">Add movies to favorites to see them here</p>
                </div>
              )}

              {favorites.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((m) => (
                    <div key={m.imdbID} className="bg-slate-800/50 backdrop-blur rounded-xl shadow-lg p-4 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-purple-500/20 hover:shadow-xl transform hover:-translate-y-1">
                      <MovieCard movie={m} isFavorite={true} onRemoveFavorite={removeFavorite} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-purple-500/30 flex justify-end gap-3 bg-slate-800/50">
              <button 
                onClick={() => setShowFavorites(false)} 
                className="px-6 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all duration-200 transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;