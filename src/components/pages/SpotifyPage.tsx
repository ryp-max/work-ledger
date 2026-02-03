'use client';

interface SpotifyPageProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentSong: { id: number; title: string; src: string };
  onNext: () => void;
  onPrevious: () => void;
  isShuffled: boolean;
  onToggleShuffle: () => void;
}

export function SpotifyPage({ 
  isPlaying, 
  onTogglePlay, 
  currentSong,
  onNext,
  onPrevious,
  isShuffled,
  onToggleShuffle
}: SpotifyPageProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 gap-6">
      {/* Song Title */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {currentSong.title}
        </h2>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Shuffle Button */}
        <button
          onClick={onToggleShuffle}
          className={`w-10 h-10 flex items-center justify-center transition-opacity ${
            isShuffled 
              ? 'text-gray-900 dark:text-white opacity-100' 
              : 'text-gray-400 dark:text-gray-500 hover:opacity-70'
          }`}
          aria-label="Shuffle"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </button>

        {/* Previous Button */}
        <button
          onClick={onPrevious}
          className="w-12 h-12 flex items-center justify-center text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
          aria-label="Previous"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlay}
          className="w-16 h-16 flex items-center justify-center text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
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
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="w-12 h-12 flex items-center justify-center text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
          aria-label="Next"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
