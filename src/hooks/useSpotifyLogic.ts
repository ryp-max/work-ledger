import { useState, useEffect } from 'react';
import { extractDominantColor, isLightColor, invertColor } from '@/lib/color-extractor';

export interface UseSpotifyLogicOptions {
  albumCover?: string;
  songId: number;
  songTitle: string;
}

export function useSpotifyLogic({ albumCover, songId, songTitle }: UseSpotifyLogicOptions) {
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [isLightBg, setIsLightBg] = useState(true);
  const [inverseColor, setInverseColor] = useState<string>('#000000');

  useEffect(() => {
    if (albumCover) {
      const timer = setTimeout(() => {
        extractDominantColor(albumCover)
          .then((color) => {
            setBackgroundColor(color);
            setIsLightBg(isLightColor(color));
            setInverseColor(invertColor(color));
          })
          .catch(() => {
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
  }, [albumCover, songId, songTitle]);

  return { backgroundColor, isLightBg, inverseColor };
}
