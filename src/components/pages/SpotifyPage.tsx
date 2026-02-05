'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { extractDominantColor, isLightColor, invertColor, hexToRgba } from '@/lib/color-extractor';

interface SpotifyPageProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentSong: { id: number; title: string; src: string; artist?: string; albumCover?: string };
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
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [isLightBg, setIsLightBg] = useState(true);
  const [inverseColor, setInverseColor] = useState<string>('#000000');

  // Extract dominant color from album cover
  useEffect(() => {
    if (currentSong.albumCover) {
      // Add a small delay to ensure image is loaded
      const timer = setTimeout(() => {
        extractDominantColor(currentSong.albumCover!)
          .then((color) => {
            console.log('Extracted color:', color, 'for song:', currentSong.title);
            setBackgroundColor(color);
            setIsLightBg(isLightColor(color));
            setInverseColor(invertColor(color));
          })
          .catch((error) => {
            console.error('Failed to extract color:', error);
            setBackgroundColor('#ffffff');
            setIsLightBg(true);
            setInverseColor('#000000');
          });
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      setBackgroundColor('#ffffff');
      setIsLightBg(true);
      setInverseColor('#000000');
    }
  }, [currentSong.albumCover, currentSong.id, currentSong.title]);

  return (
    <motion.div 
      className="w-full h-full flex flex-col items-center justify-center gap-8 px-8"
      style={{ backgroundColor }}
      animate={{ backgroundColor }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Album Cover */}
      {currentSong.albumCover && (
        <motion.div
          key={currentSong.id}
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.6
          }}
          className="w-64 h-64 rounded-lg overflow-hidden shadow-2xl"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src={currentSong.albumCover}
            alt={`${currentSong.title} album cover`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      )}

      {/* Song Title */}
      <div className="text-center">
        <motion.h2 
          key={`title-${currentSong.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-3xl font-semibold mb-1 uppercase tracking-wide" 
          style={{ 
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif', 
            letterSpacing: '0.05em',
            color: isLightBg ? '#1f2937' : '#ffffff'
          }}
        >
          {currentSong.title}
        </motion.h2>
        {currentSong.artist && (
          <motion.p 
            key={`artist-${currentSong.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-sm uppercase tracking-wide" 
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif', 
              letterSpacing: '0.05em',
              color: isLightBg ? '#6b7280' : '#d1d5db'
            }}
          >
            {currentSong.artist}
          </motion.p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div 
          className="h-1.5 rounded-full overflow-hidden mb-2"
          style={{ backgroundColor: isLightBg ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)' }}
        >
          <motion.div 
            className="h-full rounded-full"
            style={{ 
              width: `${progress}%`,
              backgroundColor: inverseColor
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
        <div className="flex justify-between text-xs uppercase tracking-wide" style={{ 
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif', 
          letterSpacing: '0.05em',
          color: isLightBg ? '#6b7280' : '#d1d5db'
        }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        {/* Shuffle Button */}
        <motion.div
          className="rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: hexToRgba(inverseColor, 0.2),
            width: '3rem',
            height: '3rem'
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.button
            onClick={onToggleShuffle}
            className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ 
              color: isShuffled 
                ? (isLightBg ? '#1f2937' : '#ffffff')
                : (isLightBg ? '#9ca3af' : '#6b7280'),
              opacity: isShuffled ? 1 : 0.6
            }}
            whileHover={{ scale: 1.15, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            aria-label="Shuffle"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
          </motion.button>
        </motion.div>

        {/* Previous Button */}
        <motion.div
          className="rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: hexToRgba(inverseColor, 0.2),
            width: '3.5rem',
            height: '3.5rem'
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.button
            onClick={onPrevious}
            className="w-12 h-12 flex items-center justify-center rounded-full"
            style={{ color: isLightBg ? '#1f2937' : '#ffffff' }}
            whileHover={{ scale: 1.15, x: -3 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            aria-label="Previous"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </motion.button>
        </motion.div>

        {/* Play/Pause Button - Centered */}
        <motion.div
          className="rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: hexToRgba(inverseColor, 0.2),
            width: '5.5rem',
            height: '5.5rem'
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.button
            onClick={onTogglePlay}
            className="w-20 h-20 flex items-center justify-center rounded-full"
            style={{ color: isLightBg ? '#1f2937' : '#ffffff' }}
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
        </motion.div>

        {/* Next Button */}
        <motion.div
          className="rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: hexToRgba(inverseColor, 0.2),
            width: '3.5rem',
            height: '3.5rem'
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.button
            onClick={onNext}
            className="w-12 h-12 flex items-center justify-center rounded-full"
            style={{ color: isLightBg ? '#1f2937' : '#ffffff' }}
            whileHover={{ scale: 1.15, x: 3 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            aria-label="Next"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </motion.button>
        </motion.div>

        {/* Repeat Button */}
        <motion.div
          className="rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: hexToRgba(inverseColor, 0.2),
            width: '3rem',
            height: '3rem'
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.button
            onClick={onToggleRepeat}
            className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ 
              color: isRepeating 
                ? (isLightBg ? '#1f2937' : '#ffffff')
                : (isLightBg ? '#9ca3af' : '#6b7280'),
              opacity: isRepeating ? 1 : 0.6
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            aria-label="Repeat"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v6z"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
