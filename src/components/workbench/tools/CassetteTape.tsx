'use client';

import { useState, useRef, useEffect } from 'react';

interface CassetteTapeProps {
  track: string;
  artist: string;
  audioSrc?: string;
}

export function CassetteTape({ track, artist, audioSrc }: CassetteTapeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioSrc) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;
      
      // Check if audio can be loaded
      audioRef.current.addEventListener('canplaythrough', () => setHasAudio(true));
      audioRef.current.addEventListener('error', () => setHasAudio(false));
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioSrc]);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setRotation(prev => (prev + 3) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current && hasAudio) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
    // Still animate even without audio for visual effect
    setIsPlaying(!isPlaying);
  };

  return (
    <div 
      className="cursor-pointer select-none"
      onClick={togglePlay}
      title={isPlaying ? 'Click to pause' : 'Click to play'}
    >
      <svg width="200" height="130" viewBox="0 0 200 130">
        {/* Outer shell shadow */}
        <rect x="5" y="5" width="190" height="120" rx="8" fill="rgba(0,0,0,0.3)" />
        
        {/* Cassette body - main shell */}
        <rect x="0" y="0" width="190" height="120" rx="8" fill="#1c1c1c" />
        <rect x="2" y="2" width="186" height="116" rx="6" fill="#2a2a2a" />
        
        {/* Top edge highlight */}
        <rect x="2" y="2" width="186" height="4" rx="2" fill="#3a3a3a" />
        
        {/* Label area - retro gradient */}
        <rect x="12" y="10" width="166" height="50" rx="3" fill="#f0e6d3" />
        <rect x="12" y="10" width="166" height="50" rx="3" fill="url(#retroGradient)" />
        
        {/* Label border */}
        <rect x="12" y="10" width="166" height="50" rx="3" fill="none" stroke="#c9a86c" strokeWidth="1" />
        
        {/* Retro stripes */}
        <rect x="12" y="10" width="166" height="8" fill="#e74c3c" opacity="0.9" />
        <rect x="12" y="18" width="166" height="4" fill="#f39c12" opacity="0.9" />
        <rect x="12" y="22" width="166" height="3" fill="#f1c40f" opacity="0.9" />
        
        {/* Artist name */}
        <text x="95" y="38" fontSize="14" fill="#1a1a1a" textAnchor="middle" fontWeight="900" fontFamily="Impact, sans-serif" letterSpacing="2">
          TWS
        </text>
        
        {/* Track name */}
        <text x="95" y="52" fontSize="10" fill="#e74c3c" textAnchor="middle" fontWeight="bold" fontFamily="Arial Black, sans-serif" letterSpacing="1">
          ★ OVERDRIVE ★
        </text>
        
        {/* Small text */}
        <text x="165" y="18" fontSize="5" fill="#fff" textAnchor="end" fontFamily="Arial">
          SIDE A
        </text>
        
        {/* Tape window - dark area */}
        <rect x="25" y="65" width="140" height="40" rx="4" fill="#0a0a0a" />
        <rect x="28" y="68" width="134" height="34" rx="3" fill="#151515" />
        
        {/* Tape window inner shine */}
        <rect x="28" y="68" width="134" height="6" rx="2" fill="rgba(255,255,255,0.03)" />
        
        {/* Left reel - larger (more tape) */}
        <circle cx="58" cy="85" r="20" fill="#1a1a1a" />
        <circle cx="58" cy="85" r="17" fill="#252525" />
        <circle cx="58" cy="85" r="14" fill="#6b4423" /> {/* Tape color - brown */}
        <circle 
          cx="58" 
          cy="85" 
          r="9" 
          fill="#1a1a1a"
        />
        {/* Reel hub with spokes */}
        {[0, 72, 144, 216, 288].map(angle => (
          <line
            key={`left-${angle}`}
            x1="58"
            y1="85"
            x2={58 + 8 * Math.cos(((angle + rotation) * Math.PI) / 180)}
            y2={85 + 8 * Math.sin(((angle + rotation) * Math.PI) / 180)}
            stroke="#333"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}
        <circle cx="58" cy="85" r="3" fill="#444" />
        <circle cx="58" cy="85" r="1.5" fill="#222" />
        
        {/* Right reel - smaller (less tape) */}
        <circle cx="132" cy="85" r="20" fill="#1a1a1a" />
        <circle cx="132" cy="85" r="17" fill="#252525" />
        <circle cx="132" cy="85" r="8" fill="#6b4423" /> {/* Less tape */}
        <circle 
          cx="132" 
          cy="85" 
          r="9" 
          fill="#1a1a1a"
        />
        {/* Reel hub with spokes */}
        {[0, 72, 144, 216, 288].map(angle => (
          <line
            key={`right-${angle}`}
            x1="132"
            y1="85"
            x2={132 + 8 * Math.cos(((angle + rotation) * Math.PI) / 180)}
            y2={85 + 8 * Math.sin(((angle + rotation) * Math.PI) / 180)}
            stroke="#333"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}
        <circle cx="132" cy="85" r="3" fill="#444" />
        <circle cx="132" cy="85" r="1.5" fill="#222" />
        
        {/* Tape between reels */}
        <path 
          d="M 72 85 Q 95 72, 118 85" 
          stroke="#4a3520" 
          strokeWidth="2.5" 
          fill="none"
        />
        
        {/* Tape guides */}
        <circle cx="85" cy="78" r="2" fill="#333" />
        <circle cx="105" cy="78" r="2" fill="#333" />
        
        {/* Head area (bottom center) */}
        <rect x="80" y="100" width="30" height="10" rx="2" fill="#333" />
        <rect x="85" y="102" width="20" height="6" rx="1" fill="#222" />
        
        {/* Corner screws */}
        <circle cx="15" cy="108" r="4" fill="#1a1a1a" />
        <circle cx="15" cy="108" r="2.5" fill="#333" />
        <line x1="13" y1="108" x2="17" y2="108" stroke="#222" strokeWidth="1" />
        <line x1="15" y1="106" x2="15" y2="110" stroke="#222" strokeWidth="1" />
        
        <circle cx="175" cy="108" r="4" fill="#1a1a1a" />
        <circle cx="175" cy="108" r="2.5" fill="#333" />
        <line x1="173" y1="108" x2="177" y2="108" stroke="#222" strokeWidth="1" />
        <line x1="175" y1="106" x2="175" y2="110" stroke="#222" strokeWidth="1" />
        
        {/* Write protect tabs */}
        <rect x="8" y="62" width="10" height="14" fill="#2a2a2a" rx="1" />
        <rect x="172" y="62" width="10" height="14" fill="#2a2a2a" rx="1" />
        
        {/* Playing indicator - pulsing red dot */}
        {isPlaying && (
          <g>
            <circle cx="20" cy="25" r="5" fill="#e74c3c">
              <animate attributeName="opacity" values="1;0.4;1" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="20" cy="25" r="3" fill="#ff6b6b">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="0.8s" repeatCount="indefinite" />
            </circle>
          </g>
        )}
        
        <defs>
          <linearGradient id="retroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Play status */}
      <div className="text-center mt-2">
        <span 
          className={`text-xs px-3 py-1 rounded-full ${
            isPlaying 
              ? 'bg-red-500/80 text-white' 
              : 'bg-black/50 text-white/70'
          }`}
        >
          {isPlaying ? '♫ NOW PLAYING' : '▶ CLICK TO PLAY'}
        </span>
      </div>
    </div>
  );
}
