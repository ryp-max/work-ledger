'use client';

import { useState } from 'react';
import type { Artifact } from '@/lib/schemas';

interface ArtifactGridProps {
  artifacts: Artifact[];
}

export function ArtifactGrid({ artifacts }: ArtifactGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  if (artifacts.length === 0) return null;
  
  const displayArtifacts = artifacts.slice(0, 6);
  
  return (
    <>
      <div className={`
        grid gap-3
        ${displayArtifacts.length === 1 ? 'grid-cols-1' : ''}
        ${displayArtifacts.length === 2 ? 'grid-cols-2' : ''}
        ${displayArtifacts.length >= 3 ? 'grid-cols-2 md:grid-cols-3' : ''}
      `}>
        {displayArtifacts.map((artifact, index) => (
          <button
            key={index}
            onClick={() => setLightboxIndex(index)}
            className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--tape)] 
                       border border-[var(--tape-border)] transition-all duration-200
                       hover:shadow-md hover:border-[var(--ink-muted)] cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artifact.src}
              alt={artifact.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl"
            onClick={() => setLightboxIndex(null)}
          >
            ✕
          </button>
          
          {lightboxIndex > 0 && (
            <button
              className="absolute left-6 text-white/70 hover:text-white text-3xl"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
            >
              ‹
            </button>
          )}
          
          {lightboxIndex < displayArtifacts.length - 1 && (
            <button
              className="absolute right-6 text-white/70 hover:text-white text-3xl"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
            >
              ›
            </button>
          )}
          
          <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayArtifacts[lightboxIndex].src}
              alt={displayArtifacts[lightboxIndex].alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <p className="absolute bottom-6 text-white/70 text-sm">
            {displayArtifacts[lightboxIndex].alt}
          </p>
        </div>
      )}
    </>
  );
}
