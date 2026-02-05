/**
 * Extracts the dominant color from an image
 * @param imageUrl - URL of the image
 * @returns Promise resolving to hex color code
 */
export async function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Only set crossOrigin for external URLs
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      img.crossOrigin = 'anonymous';
    }
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Resize for performance (sample smaller image)
        const size = 50;
        canvas.width = size;
        canvas.height = size;
        
        ctx.drawImage(img, 0, 0, size, size);
        
        // Sample pixels
        const imageData = ctx.getImageData(0, 0, size, size);
        const data = imageData.data;
        
        // Group colors by similarity
        const colorMap = new Map<string, number>();
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          // Skip transparent pixels
          if (a < 128) continue;
          
          // Quantize colors to reduce noise
          const quantizedR = Math.floor(r / 10) * 10;
          const quantizedG = Math.floor(g / 10) * 10;
          const quantizedB = Math.floor(b / 10) * 10;
          
          const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;
          colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
        }
        
        // Find the most common color
        let maxCount = 0;
        let dominantColor = '#000000';
        
        for (const [colorKey, count] of colorMap.entries()) {
          if (count > maxCount) {
            maxCount = count;
            const [r, g, b] = colorKey.split(',').map(Number);
            dominantColor = rgbToHex(r, g, b);
          }
        }
        
        // Ensure we have a valid color
        if (dominantColor === '#000000' && colorMap.size === 0) {
          dominantColor = '#ffffff';
        }
        
        resolve(dominantColor);
      } catch (error) {
        console.error('Error extracting color:', error);
        reject(error);
      }
    };
    
    img.onerror = (error) => {
      console.error('Failed to load image:', imageUrl, error);
      reject(new Error(`Failed to load image: ${imageUrl}`));
    };
    
    // Set src after setting up handlers
    img.src = imageUrl;
  });
}

/**
 * Converts RGB values to hex color code
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

/**
 * Determines if a color is light or dark
 * @param hex - Hex color code
 * @returns true if color is light, false if dark
 */
export function isLightColor(hex: string): boolean {
  // Remove # if present
  const color = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
}

/**
 * Inverts a hex color (calculates the inverse/complementary color)
 * @param hex - Hex color code
 * @returns Inverted hex color code
 */
export function invertColor(hex: string): string {
  // Remove # if present
  const color = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Invert each component
  const invertedR = 255 - r;
  const invertedG = 255 - g;
  const invertedB = 255 - b;
  
  // Convert back to hex
  return rgbToHex(invertedR, invertedG, invertedB);
}
