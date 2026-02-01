'use client';

import { useState, useRef, useEffect } from 'react';

interface BenchRadioProps {
  track?: string;
  src?: string;
}

export function BenchRadio({ track, src }: BenchRadioProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  const togglePlay = () => {
    if (!audioRef.current || !src) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  if (!src || !track) return null;
  
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <audio ref={audioRef} src={src} loop />
      
      <div 
        className={`
          bg-[var(--paper)] border border-[var(--tape-border)] rounded-lg shadow-lg
          transition-all duration-200 overflow-hidden
          ${isExpanded ? 'w-56' : 'w-12'}
        `}
      >
        <div className="flex items-center">
          {/* Play/Pause button */}
          <button
            onClick={togglePlay}
            onMouseEnter={() => setIsExpanded(true)}
            className="w-12 h-12 flex items-center justify-center text-[var(--ink)] hover:bg-[var(--tape)] transition-colors"
          >
            {isPlaying ? '❚❚' : '▶'}
          </button>
          
          {/* Expanded content */}
          {isExpanded && (
            <div 
              className="flex-1 pr-3 py-2"
              onMouseLeave={() => setIsExpanded(false)}
            >
              <p className="text-xs text-[var(--ink)] truncate font-medium mb-1">
                {track}
              </p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-[var(--tape)] rounded appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 
                           [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--stamp)] 
                           [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
