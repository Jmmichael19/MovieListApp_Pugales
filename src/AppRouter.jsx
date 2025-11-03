// src/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import App from "./App";
import MovieDetailsPage from "./components/MovieDetailsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/watch/:imdbID" element={<MovieDetailsPage />} />
      <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
    </Routes>
  );
}
