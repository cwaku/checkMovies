"use client";

/**
 * Student Name: Krish Choudhary
 * Date: August 11, 2026
 * Program Description: Main Next.js homepage displaying full movies collection with Supabase CRUD functionality.
 * Inputs: User inputs from Add movie form and live database data from Supabase.
 * Processing: Handles Create, Read, Update, and Delete operations for movies with real-time feedback.
 * Output: Responsive single-page application view with live database connectivity.
 */

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard from "@/components/MovieCard";
import { supabase } from "@/lib/supabaseClient";
import type { Movie } from "@/types/movie";
import {
  IoFilmOutline,
  IoAddOutline,
  IoSyncOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
} from "react-icons/io5";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState<number | "">("");
  const [actors, setActors] = useState("");

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setError(null);
    setTimeout(() => setSuccess(null), 4000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setSuccess(null);
    setTimeout(() => setError(null), 6000);
  };

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from("movies")
        .select("*")
        .order("id", { ascending: false });

      if (fetchErr) throw new Error(fetchErr.message);
      setMovies(data || []);
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "Failed to load movies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  async function handleCreateMovie(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return showError("Movie title is required.");
    if (!releaseYear || Number(releaseYear) < 1880 || Number(releaseYear) > 2100) {
      return showError("Please provide a valid release year (e.g. 2024).");
    }

    try {
      setSubmitting(true);
      setError(null);

      const parsedActors = actors.split(",").map((a) => a.trim()).filter(Boolean);
      const payload = {
        title: title.trim(),
        release_year: Number(releaseYear),
        actors: parsedActors,
      };

      const { data, error: insertErr } = await supabase
        .from("movies")
        .insert([payload])
        .select();

      if (insertErr) throw new Error(insertErr.message);

      showSuccess(`Movie "${title}" added successfully!`);
      setTitle("");
      setReleaseYear("");
      setActors("");

      if (data && data.length > 0) {
        setMovies((prev) => [data[0], ...prev]);
      } else {
        await fetchMovies();
      }
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "Failed to add movie");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateMovie(
    id: number | string,
    updatedData: { title: string; release_year: number; actors: string[] }
  ) {
    try {
      setError(null);
      const { error: updateErr } = await supabase
        .from("movies")
        .update(updatedData)
        .eq("id", id);

      if (updateErr) throw new Error(updateErr.message);

      showSuccess("Movie updated successfully!");
      setMovies((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update movie";
      showError(msg);
      throw err;
    }
  }

  async function handleDeleteMovie(id: number | string, movieTitle: string) {
    if (!window.confirm(`Are you sure you want to delete "${movieTitle}"?`)) return;

    try {
      setError(null);
      const { error: deleteErr } = await supabase
        .from("movies")
        .delete()
        .eq("id", id);

      if (deleteErr) throw new Error(deleteErr.message);

      showSuccess(`Movie "${movieTitle}" deleted successfully.`);
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "Failed to delete movie");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-gray-100 font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
              <IoFilmOutline className="text-red-500 text-3xl" />
              <span>IMR Movie Database</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Browse, add, edit, and manage movies in the Internet Movies Rental Company real-time inventory.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-right self-start sm:self-auto">
            <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">
              Total Movies
            </span>
            <span className="text-2xl font-black text-red-400">{movies.length}</span>
          </div>
        </section>

        {error && (
          <div className="flex items-center gap-3 bg-red-950/80 border border-red-800 text-red-200 px-4 py-3 rounded-xl text-sm shadow-md">
            <IoAlertCircleOutline className="text-xl text-red-400 shrink-0" />
            <p className="flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              type="button"
              className="text-red-400 hover:text-red-200 cursor-pointer"
            >
              <IoCloseOutline className="text-lg" />
            </button>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 px-4 py-3 rounded-xl text-sm shadow-md">
            <IoCheckmarkCircleOutline className="text-xl text-emerald-400 shrink-0" />
            <p className="flex-1">{success}</p>
            <button
              onClick={() => setSuccess(null)}
              type="button"
              className="text-emerald-400 hover:text-emerald-200 cursor-pointer"
            >
              <IoCloseOutline className="text-lg" />
            </button>
          </div>
        )}

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <IoAddOutline className="text-red-400 text-xl" />
            <span>Add New Movie to Catalog</span>
          </h2>

          <form onSubmit={handleCreateMovie} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Movie Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Inception"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Release Year <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={releaseYear}
                  onChange={(e) => setReleaseYear(e.target.value ? Number(e.target.value) : "")}
                  placeholder="e.g. 2010"
                  min="1880"
                  max="2100"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Actors List (comma-separated)
                </label>
                <input
                  type="text"
                  value={actors}
                  onChange={(e) => setActors(e.target.value)}
                  placeholder="e.g. Leonardo DiCaprio, Joseph Gordon-Levitt"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-lg hover:shadow-red-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <IoSyncOutline className="animate-spin text-base" />
                    <span>Adding…</span>
                  </>
                ) : (
                  <>
                    <IoAddOutline className="text-base" />
                    <span>Add Movie</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Movie Catalog</h2>

          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-gray-400">
              <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-medium">Loading movies from database…</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-gray-400">
              <IoFilmOutline className="text-5xl text-slate-600 mb-3 mx-auto" />
              <h3 className="text-base font-semibold text-slate-200">No movies in database</h3>
              <p className="text-xs text-slate-500 mt-1">Use the form above to add your first movie.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onUpdate={handleUpdateMovie}
                  onDelete={handleDeleteMovie}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}