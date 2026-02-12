'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock photos - generic placeholders
const MOCK_PHOTOS = [
  { id: '1', src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23E5E7EB"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="48" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3EPhoto 1%3C/text%3E%3C/svg%3E', alt: 'Photo 1' },
  { id: '2', src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"%3E%3Crect width="800" height="1000" fill="%23F3F4F6"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="48" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3EPhoto 2%3C/text%3E%3C/svg%3E', alt: 'Photo 2' },
  { id: '3', src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="800"%3E%3Crect width="800" height="800" fill="%23E5E7EB"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="48" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3EPhoto 3%3C/text%3E%3C/svg%3E', alt: 'Photo 3' },
  { id: '4', src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="1200"%3E%3Crect width="800" height="1200" fill="%23F3F4F6"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="48" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3EPhoto 4%3C/text%3E%3C/svg%3E', alt: 'Photo 4' },
  { id: '5', src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23E5E7EB"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="48" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3EPhoto 5%3C/text%3E%3C/svg%3E', alt: 'Photo 5' },
  { id: '6', src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="900"%3E%3Crect width="800" height="900" fill="%23F3F4F6"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="48" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3EPhoto 6%3C/text%3E%3C/svg%3E', alt: 'Photo 6' },
];

export function PhotosPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const selectedPhotoData = MOCK_PHOTOS.find(p => p.id === selectedPhoto);

  return (
    <div className="w-full h-full overflow-y-auto" style={{ padding: '16px' }}>
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Photos</h1>
        
        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {MOCK_PHOTOS.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="mb-4 break-inside-avoid cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              onClick={() => {
                setSelectedPhoto(photo.id);
                setZoomLevel(1);
              }}
            >
              <motion.div
                className="rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-Screen Preview */}
      <AnimatePresence>
        {selectedPhoto && selectedPhotoData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Zoom Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 items-center z-10">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel(prev => Math.max(0.5, prev - 0.25));
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </motion.button>
              <span className="text-white text-sm min-w-[60px] text-center">{Math.round(zoomLevel * 100)}%</span>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel(prev => Math.min(3, prev + 0.25));
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </motion.button>
            </div>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: zoomLevel, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full"
            >
              <img
                src={selectedPhotoData.src}
                alt={selectedPhotoData.alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </motion.div>

            {/* Navigation Arrows */}
            {MOCK_PHOTOS.length > 1 && (
              <>
                {MOCK_PHOTOS.findIndex(p => p.id === selectedPhoto) > 0 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = MOCK_PHOTOS.findIndex(p => p.id === selectedPhoto);
                      setSelectedPhoto(MOCK_PHOTOS[currentIndex - 1].id);
                      setZoomLevel(1);
                    }}
                    className="absolute left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white z-10"
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.button>
                )}
                {MOCK_PHOTOS.findIndex(p => p.id === selectedPhoto) < MOCK_PHOTOS.length - 1 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = MOCK_PHOTOS.findIndex(p => p.id === selectedPhoto);
                      setSelectedPhoto(MOCK_PHOTOS[currentIndex + 1].id);
                      setZoomLevel(1);
                    }}
                    className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white z-10"
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
