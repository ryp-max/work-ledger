'use client';

// Mock photos - replace with actual images later
const MOCK_PHOTOS = [
  { id: '1', src: '/placeholder.jpg', alt: 'Photo 1' },
  { id: '2', src: '/placeholder.jpg', alt: 'Photo 2' },
  { id: '3', src: '/placeholder.jpg', alt: 'Photo 3' },
  { id: '4', src: '/placeholder.jpg', alt: 'Photo 4' },
  { id: '5', src: '/placeholder.jpg', alt: 'Photo 5' },
  { id: '6', src: '/placeholder.jpg', alt: 'Photo 6' },
];

export function PhotosPage() {
  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Photos</h1>
      
      <div className="grid grid-cols-3 gap-4">
        {MOCK_PHOTOS.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              📷
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
