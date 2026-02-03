'use client';

import { useState, useRef } from 'react';

export function SpotifyPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-white dark:bg-gray-900">
      <audio ref={audioRef} src="/audio/overdrive.mp3" loop />
      
      <button
        onClick={togglePlay}
        className="w-16 h-16 flex items-center justify-center text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
