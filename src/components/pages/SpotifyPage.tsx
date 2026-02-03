'use client';

import { motion } from 'framer-motion';

interface SpotifyPageProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentSong: { id: number; title: string; src: string; artist?: string };
  onNext: () => void;
  onPrevious: () => void;
  isShuffled: boolean;
  onToggleShuffle: () => void;
  isRepeating: boolean;
  onToggleRepeat: () => void;
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
  isShuffled,
  onToggleShuffle,
  isRepeating,
  onToggleRepeat,
  currentTime,
  duration,
  progress,
  formatTime
}: SpotifyPageProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 gap-8 px-8">
      {/* Song Title */}
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-1 uppercase tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif', letterSpacing: '0.05em' }}>
          {currentSong.title}
        </h2>
        {currentSong.artist && (
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif', letterSpacing: '0.05em' }}>
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
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif', letterSpacing: '0.05em' }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        {/* Shuffle Button */}
        <motion.button
          onClick={onToggleShuffle}
          className={`w-10 h-10 flex items-center justify-center ${
            isShuffled 
              ? 'text-gray-900 dark:text-white opacity-100' 
              : 'text-gray-400 dark:text-gray-500'
          }`}
          whileHover={{ scale: 1.15, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          aria-label="Shuffle"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </motion.button>

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

        {/* Play/Pause Button - Centered */}
        <motion.button
          onClick={onTogglePlay}
          className="w-20 h-20 flex items-center justify-center text-gray-900 dark:text-white"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
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

        {/* Repeat Button */}
        <motion.button
          onClick={onToggleRepeat}
          className={`w-10 h-10 flex items-center justify-center ${
            isRepeating 
              ? 'text-gray-900 dark:text-white opacity-100' 
              : 'text-gray-400 dark:text-gray-500'
          }`}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          aria-label="Repeat"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v6z"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
