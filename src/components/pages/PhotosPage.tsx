'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePostsStore } from '@/stores/usePostsStore';

export function PhotosPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const posts = usePostsStore((s) => s.posts);
  const photos = useMemo(
    () =>
      posts.flatMap((post) =>
        (post.photos ?? []).map((src, idx) => ({
          id: `${post.id}-${idx}`,
          src,
          alt: `${post.title} — Photo ${idx + 1}`,
        }))
      ),
    [posts]
  );

  const selectedPhotoData = photos.find((p) => p.id === selectedPhoto);

  return (
    <div className="w-full h-full overflow-y-auto" style={{ padding: '16px' }}>
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Photos</h1>
        
        {/* Masonry Layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
          {photos.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 col-span-full py-12">
              No photos yet. Add photos to your weekly posts to see them here.
            </p>
          ) : (
          photos.map((photo, index) => (
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
          )))}
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
            {photos.length > 1 && (
              <>
                {photos.findIndex(p => p.id === selectedPhoto) > 0 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = photos.findIndex(p => p.id === selectedPhoto);
                      setSelectedPhoto(photos[currentIndex - 1].id);
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
                {photos.findIndex(p => p.id === selectedPhoto) < photos.length - 1 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = photos.findIndex(p => p.id === selectedPhoto);
                      setSelectedPhoto(photos[currentIndex + 1].id);
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
