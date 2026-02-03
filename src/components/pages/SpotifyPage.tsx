'use client';

import { motion } from 'framer-motion';

interface SpotifyPageProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentSong: { id: number; title: string; src: string; artist?: string };
  onNext: () => void;
  onPrevious: () => void;
  currentTime: number;
  duration: number;
  progress: number;
  formatTime: (seconds: number) => string;
}

export function SpotifyPage({ 
  isPlaying, 
  onTogglePlay, 
  currentSong,
  onNext,
  onPrevious,
  currentTime,
  duration,
  progress,
  formatTime
}: SpotifyPageProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 gap-8 px-8">
      {/* Song Title */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-1">
          {currentSong.title}
        </h2>
        {currentSong.artist && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentSong.artist}
          </p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Previous Button */}
        <motion.button
          onClick={onPrevious}
          className="w-12 h-12 flex items-center justify-center text-gray-900 dark:text-white"
          whileHover={{ scale: 1.15, x: -3 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          aria-label="Previous"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </motion.button>

        {/* Play/Pause Button */}
        <motion.button
          onClick={onTogglePlay}
          className="w-16 h-16 flex items-center justify-center text-gray-900 dark:text-white"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </motion.button>

        {/* Next Button */}
        <motion.button
          onClick={onNext}
          className="w-12 h-12 flex items-center justify-center text-gray-900 dark:text-white"
          whileHover={{ scale: 1.15, x: 3 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          aria-label="Next"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
