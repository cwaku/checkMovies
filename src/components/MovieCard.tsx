"use client";

/**
 * Student Name: Krish Choudhary
 * Date: August 11, 2026
 * Program Description: Individual presentation card component with self-contained inline editing and delete actions.
 * Inputs: Receives Movie object and update/delete async callbacks.
 * Processing: Handles local edit state, input validation, and rendering for view and inline edit modes.
 * Output: Renders responsive card UI component for a single movie entry.
 */

import React, { useState } from 'react';
import { Movie } from '@/types/movie';
import {
  IoCalendarOutline,
  IoPeopleOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
} from 'react-icons/io5';

interface MovieCardProps {
  movie: Movie;
  onUpdate: (
    id: number | string,
    data: { title: string; release_year: number; actors: string[] }
  ) => Promise<void>;
  onDelete: (id: number | string, title: string) => Promise<void>;
}

export default function MovieCard({ movie, onUpdate, onDelete }: MovieCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState<number | ''>('');
  const [actors, setActors] = useState('');
  const [saving, setSaving] = useState(false);

  const actorsList = Array.isArray(movie.actors)
    ? movie.actors
    : typeof movie.actors === 'string'
    ? movie.actors.replace(/^\{|\}$/g, '').split(',').map((a) => a.replace(/^"|"$/g, '').trim()).filter(Boolean)
    : [];

  const handleStartEdit = () => {
    setTitle(movie.title);
    setReleaseYear(movie.release_year);
    setActors(actorsList.join(', '));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return alert('Movie title cannot be empty.');
    if (!releaseYear || Number(releaseYear) < 1880 || Number(releaseYear) > 2100) {
      return alert('Please enter a valid release year (e.g. 2024).');
    }

    try {
      setSaving(true);
      const parsedActors = actors.split(',').map((a) => a.trim()).filter(Boolean);
      await onUpdate(movie.id, {
        title: title.trim(),
        release_year: Number(releaseYear),
        actors: parsedActors,
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border-2 border-red-500 transition-all flex flex-col justify-between p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Editing Movie #{movie.id}
            </span>
            <span className="text-xs text-slate-400">Inline Edit</span>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">Release Year</label>
            <input
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value ? Number(e.target.value) : '')}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">
              Actors (comma-separated)
            </label>
            <input
              type="text"
              value={actors}
              onChange={(e) => setActors(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-700">
            <button
              onClick={() => setIsEditing(false)}
              disabled={saving}
              type="button"
              className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-gray-300 text-xs px-3 py-1.5 rounded transition font-medium cursor-pointer"
            >
              <IoCloseOutline className="text-sm" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              type="button"
              className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-xs px-3 py-1.5 rounded transition font-medium cursor-pointer disabled:opacity-50"
            >
              <IoCheckmarkOutline className="text-sm" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 hover:border-red-500 transition-all flex flex-col justify-between p-5">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>

        <p className="text-sm text-red-400 font-semibold mb-3 flex items-center gap-1.5">
          <IoCalendarOutline />
          <span>Release Year: <span className="text-gray-200">{movie.release_year}</span></span>
        </p>

        <div className="mb-4">
          <h4 className="text-xs uppercase text-gray-400 font-semibold mb-1 flex items-center gap-1.5">
            <IoPeopleOutline />
            <span>Cast / Actors:</span>
          </h4>
          {actorsList.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              {actorsList.map((actor, idx) => (
                <li key={idx}>{actor}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No actors listed</p>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-700 flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-500 font-mono">ID: #{movie.id}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleStartEdit}
            type="button"
            className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-gray-200 text-xs px-3 py-1.5 rounded transition font-medium cursor-pointer"
            title="Edit Movie"
          >
            <IoCreateOutline className="text-sm" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(movie.id, movie.title)}
            type="button"
            className="flex items-center gap-1 bg-red-950/50 hover:bg-red-900/80 text-red-300 text-xs px-3 py-1.5 rounded border border-red-800/60 transition font-medium cursor-pointer"
            title="Delete Movie"
          >
            <IoTrashOutline className="text-sm" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}