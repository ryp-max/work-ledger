import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Work Ledger',
    short_name: 'Work Ledger',
    description: 'A personal workspace that combines productivity, creativity, and reflection.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
        purpose: 'any',
      },
    ],
  };
}
