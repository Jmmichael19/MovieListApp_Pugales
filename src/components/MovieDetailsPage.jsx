import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OMDB_API_KEY = "41e2bba9";
const YOUTUBE_API_KEY = "AIzaSyC3mhE2yk-kQVSMhC-HHQ_UPxkGYhW_AeI";

// ✅ FIX: use HTTPS instead of HTTP (works on Netlify)
const DETAILS_URL = (id) => `https://www.omdbapi.com/?i=${id}&apikey=${OMDB_API_KEY}&plot=full`;

const YOUTUBE_SEARCH_URL = (query) =>
  `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}+official+trailer&type=video&key=${YOUTUBE_API_KEY}`;

function MovieDetailsPage() {
  const params = useParams();
  const movieId = params.movieId || params.imdbID;
  const isWatch = Boolean(params.imdbID);
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  // Fetch movie details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(DETAILS_URL(movieId));
        const data = await res.json();
        if (data && data.Response === "True") {
          setDetails(data);
        } else {
          setError(data?.Error || "Movie details not available");
        }
      } catch {
        setError("Failed to fetch movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [movieId]);

  // Auto-fetch trailer when details are loaded
  useEffect(() => {
    if (!details) return;

    const fetchTrailer = async () => {
      setLoadingTrailer(true);
      try {
        const query = `${details.Title} ${details.Year}`;
        const response = await fetch(YOUTUBE_SEARCH_URL(encodeURIComponent(query)));
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const videoId = data.items[0].id.videoId;
          setTrailerUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`);
        }
      } catch (err) {
        console.warn('No trailer found:', err);
      } finally {
        setLoadingTrailer(false);
      }
    };

    fetchTrailer();
  }, [details]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 font-semibold"
        aria-label="Back to movies list"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Movies</span>
      </button>

      {/* Loading / Error */}
      {loading ? (
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-300 font-medium">Loading movie details...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 max-w-md">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-red-400 text-center font-semibold">{error}</p>
          </div>
        </div>
      ) : details ? (
     
        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Auto-playing trailer at the top */}
          {trailerUrl ? (
            <div className="mb-10 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 bg-slate-900">
              <iframe
                src={trailerUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={`${details.Title} Trailer`}
              />
            </div>
          ) : (
            <div className="mb-10 w-full aspect-video bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-gray-400 border border-slate-700/50 shadow-xl">
              {loadingTrailer ? (
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span className="font-medium">Loading trailer...</span>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="font-medium">Trailer not available<br />
                   For alternative way, click the Watch Movie/Trailer button below.</p>
                </div>
              )}
            </div>
          )}

          {/* Movie Card */}
          <div className="bg-linear-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
            <div className="relative h-96 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/60 to-transparent z-10"></div>
              <img
                src={
                  details.Poster !== "N/A"
                    ? details.Poster
                    : "https://via.placeholder.com/1200x400?text=No+Backdrop+Available"
                }
                alt={details.Title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h1 className="text-5xl font-extrabold bg-linear-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-3 leading-tight">
                  {details.Title}{" "}
                  <span className="text-2xl text-gray-400">({details.Year})</span>
                </h1>
                <p className="text-gray-300 text-lg font-medium">{details.Genre}</p>
                <div className="flex gap-4 mt-6">
                  {/* Watch Movie Button */}
                  <button
                    onClick={() => {
                      const link =
                        details.Website && details.Website !== "N/A"
                          ? details.Website
                          : `https://www.imdb.com/title/${movieId}/`;
                      window.open(link, "_blank");
                    }}
                    className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Watch Movie/Trailer
                  </button>
                </div>
              </div>
            </div>

            {/* Movie Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <img
                    src={
                      details.Poster !== "N/A"
                        ? details.Poster
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={details.Title}
                    className="w-full rounded-xl shadow-2xl border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
                  />
                  <div className="mt-6 space-y-3 text-gray-300 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="flex justify-between">
                      <span className="text-purple-400 font-semibold">Released:</span> 
                      <span className="text-white font-medium">{details.Released}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-purple-400 font-semibold">Runtime:</span> 
                      <span className="text-white font-medium">{details.Runtime}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-purple-400 font-semibold">Rated:</span> 
                      <span className="text-white font-medium">{details.Rated}</span>
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-8 text-gray-300">
                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                    <h2 className="text-2xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Plot
                    </h2>
                    <p className="leading-relaxed text-gray-300">{details.Plot}</p>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                    <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Cast & Crew
                    </h2>
                    <div className="space-y-2">
                      <p><span className="text-purple-400 font-semibold">Director:</span> <span className="text-white">{details.Director}</span></p>
                      <p><span className="text-purple-400 font-semibold">Writers:</span> <span className="text-white">{details.Writer}</span></p>
                      <p><span className="text-purple-400 font-semibold">Actors:</span> <span className="text-white">{details.Actors}</span></p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      Ratings
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-linear-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-5 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
                        <p className="text-purple-400 text-3xl font-extrabold">{details.imdbRating}</p>
                        <p className="text-gray-400 font-medium mt-1">IMDb Rating</p>
                      </div>
                      {details.Ratings?.map((rating) => (
                        <div key={rating.Source} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
                          <p className="text-pink-400 text-3xl font-extrabold">{rating.Value}</p>
                          <p className="text-gray-400 font-medium mt-1">{rating.Source}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {details.Awards !== "N/A" && (
                    <div className="bg-linear-to-r from-amber-600/10 to-yellow-600/10 border border-amber-500/30 rounded-xl p-6">
                      <h2 className="text-2xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Awards
                      </h2>
                      <p className="text-gray-300 font-medium">{details.Awards}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MovieDetailsPage;
