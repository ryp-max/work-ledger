'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { usePostsStore } from '@/stores/usePostsStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { LoginModal } from '@/components/LoginModal';
import { CreatePostForm } from '@/components/CreatePostForm';

// Helper function to extract week number from title
function getWeekNumber(title: string): string {
  const match = title.match(/Week (\d+)/);
  return match ? match[1] : '';
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function WeeklyLogPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  const posts = usePostsStore((s) => s.posts);
  const deletePost = usePostsStore((s) => s.deletePost);
  const canPost = useAuthStore((s) => s.canPost);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);

  const visiblePosts = posts.filter(
    (p) => p.type === 'weekly' && p.status === 'published'
  );

  const handleCreatePostClick = () => {
    if (canPost()) {
      setShowCreateForm(true);
    } else {
      setShowLoginModal(true);
    }
  };

  // Calculate which post is currently in view
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerTop = containerRef.current.scrollTop;
      const containerHeight = containerRef.current.clientHeight;
      const viewportCenter = containerTop + containerHeight / 2;

      let newActiveIndex = 0;
      let minDistance = Infinity;

      postRefs.current.forEach((ref, index) => {
        if (ref && containerRef.current) {
          const rect = ref.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          const elementTop = rect.top - containerRect.top + containerRef.current.scrollTop;
          const elementCenter = elementTop + rect.height / 2;
          const distance = Math.abs(elementCenter - viewportCenter);

          if (distance < minDistance) {
            minDistance = distance;
            newActiveIndex = index;
          }
        }
      });
      
      setActiveIndex(newActiveIndex);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial call
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [visiblePosts]);

  const scrollToPost = (index: number) => {
    const ref = postRefs.current[index];
    if (ref && containerRef.current) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full h-full flex bg-white dark:bg-gray-950 overflow-hidden">
      {/* Left Sidebar - Table of Contents */}
      <div className="w-40 shrink-0 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="pt-6 pb-4 px-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Contents
          </h2>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-3">
          <div className="relative pl-3 border-l-2 border-gray-200 dark:border-gray-700">
            {visiblePosts.map((post, index) => (
              <button
                key={post.id}
                onClick={() => scrollToPost(index)}
                className={`block w-full text-left py-2 pl-3 -ml-px border-l-2 transition-colors ${
                  activeIndex === index
                    ? 'border-l-orange-500 text-orange-600 dark:text-orange-400 font-medium'
                    : 'border-l-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <span className="text-sm">
                  Week {getWeekNumber(post.title) || '?'}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Right Content Area - Wider feed */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-white dark:bg-gray-950 min-w-0"
        style={{ padding: '24px 32px' }}
      >
        <div className="max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-50 mb-3 tracking-tight">
                  Weekly Log
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  A collection of weekly reflections and updates
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCreatePostClick}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-sm font-medium"
                >
                  Create post
                </button>
                {isLoggedIn && (
                  <>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {username}
                    </span>
                    <button
                      onClick={() => logout()}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                    >
                      Log out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onSuccess={() => setShowCreateForm(true)}
          />

          {showCreateForm && canPost() && (
            <CreatePostForm onClose={() => setShowCreateForm(false)} />
          )}

          {/* Posts */}
          <div className="space-y-16">
            {visiblePosts.map((post, index) => (
              <motion.article
                key={post.id}
                ref={(el) => {
                  postRefs.current[index] = el as HTMLDivElement | null;
                }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group relative"
              >
                {/* Title with Week # and Date */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <motion.h2 
                    className="text-2xl font-semibold text-gray-900 dark:text-gray-50 tracking-tight group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  >
                    <span className="text-gray-600 dark:text-gray-400 font-normal">
                      Week {getWeekNumber(post.title) || '?'}
                    </span>
                    <span className="mx-2 text-gray-400 dark:text-gray-600">·</span>
                    <time className="text-gray-600 dark:text-gray-400 font-normal">
                      {formatDate(post.date)}
                    </time>
                  </motion.h2>
                  {canPost() && (
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this post?')) {
                          deletePost(post.id);
                        }
                      }}
                      className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                      title="Delete post"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Subtitle */}
                {post.title.includes(':') && (
                  <motion.p 
                    className="text-lg text-gray-700 dark:text-gray-300 mb-8 font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  >
                    {post.title.split(':').slice(1).join(':').trim()}
                  </motion.p>
                )}

                {/* Excerpt */}
                <motion.p 
                  className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-lg"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                >
                  {post.excerpt}
                </motion.p>

                {/* Detailed Content */}
                {post.hasDetailedContent && (
                  <motion.div 
                    className="space-y-8 mt-8"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.5 }}
                  >
                    {/* Photos - uniform size (same as single-photo size), click to open lightbox */}
                    {post.photos && post.photos.length > 0 && (
                      <motion.div 
                        className="flex flex-wrap gap-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 + 0.6 }}
                      >
                        {post.photos.map((photo, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ 
                              delay: index * 0.1 + 0.7 + idx * 0.1,
                              duration: 0.5,
                              ease: [0.16, 1, 0.3, 1]
                            }}
                            className="relative w-56 h-56 shrink-0 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden cursor-pointer group/photo"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => {
                              setLightboxPhotos(post.photos ?? []);
                              setLightboxIndex(idx);
                              setLightboxZoom(1);
                            }}
                          >
                            <img
                              src={photo}
                              alt={`Photo ${idx + 1}`}
                              className="w-full h-full object-cover transition-opacity duration-300 group-hover/photo:opacity-90"
                              loading="lazy"
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* Work in Progress */}
                    {post.workInProgress && post.workInProgress.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.8, duration: 0.5 }}
                        className="py-2 mx-auto max-w-2xl"
                      >
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 text-center">
                          Work in Progress
                        </h3>
                        <ul className="space-y-3">
                          {post.workInProgress.map((item, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 + 0.85 + idx * 0.05, duration: 0.4 }}
                              className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start justify-center gap-3"
                            >
                              <span className="text-gray-400 dark:text-gray-600 mt-1.5 text-xs">—</span>
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Next Week Goals */}
                    {post.nextWeekGoals && post.nextWeekGoals.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 1.0, duration: 0.5 }}
                        className="py-2 mx-auto max-w-2xl"
                      >
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 text-center">
                          Next Week Goals
                        </h3>
                        <ul className="space-y-3">
                          {post.nextWeekGoals.map((item, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 + 1.05 + idx * 0.05, duration: 0.4 }}
                              className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start justify-center gap-3"
                            >
                              <span className="text-gray-400 dark:text-gray-600 mt-1.5 text-xs">—</span>
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Life Updates */}
                    {post.lifeUpdates && post.lifeUpdates.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 1.2, duration: 0.5 }}
                        className="py-2 mx-auto max-w-2xl"
                      >
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 text-center">
                          Life Updates
                        </h3>
                        <ul className="space-y-3">
                          {post.lifeUpdates.map((item, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 + 1.25 + idx * 0.05, duration: 0.4 }}
                              className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start justify-center gap-3"
                            >
                              <span className="text-gray-400 dark:text-gray-600 mt-1.5 text-xs">—</span>
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      {/* Photo lightbox - shows only this post's photos */}
      <AnimatePresence>
        {lightboxPhotos && lightboxPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
            onClick={() => setLightboxPhotos(null)}
          >
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxPhotos(null);
              }}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 items-center z-10">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxZoom((prev) => Math.max(0.5, prev - 0.25));
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </motion.button>
              <span className="text-white text-sm min-w-[60px] text-center">{Math.round(lightboxZoom * 100)}%</span>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxZoom((prev) => Math.min(3, prev + 0.25));
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

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: lightboxZoom, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full"
            >
              <img
                src={lightboxPhotos[lightboxIndex]}
                alt={`Photo ${lightboxIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                style={{ transform: `scale(${lightboxZoom})` }}
              />
            </motion.div>

            {lightboxPhotos.length > 1 && (
              <>
                {lightboxIndex > 0 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((i) => i - 1);
                      setLightboxZoom(1);
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
                {lightboxIndex < lightboxPhotos.length - 1 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex((i) => i + 1);
                      setLightboxZoom(1);
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
