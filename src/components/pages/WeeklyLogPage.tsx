'use client';

import { motion } from 'framer-motion';
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

  const posts = usePostsStore((s) => s.posts);
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


  return (
    <div className="w-full h-full flex bg-white dark:bg-gray-950 overflow-hidden">
      {/* Left Sidebar - Timeline */}
      <div className="w-1/3 bg-gray-100 dark:bg-gray-900 relative border-r border-gray-200 dark:border-gray-800" style={{ padding: '16px' }}>
        <div className="h-full relative">
          {/* Timeline Lines */}
          <div className="relative h-full">
            {/* Thick separator lines */}
            {visiblePosts.map((post, index) => {
              const isLast = index === visiblePosts.length - 1;
              const yPosition = index * 120; // Spacing between posts
              
              return (
                <motion.div
                  key={`separator-${post.id}`}
                  className="absolute left-0 right-0 h-px bg-gray-900 dark:bg-gray-100"
                  style={{ top: `${yPosition}px` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                />
              );
            })}

            {/* Thin item lines */}
            {visiblePosts.map((post, index) => {
              const yPosition = index * 120 + 60; // Position between separators
              
              return (
                <motion.div
                  key={`item-${post.id}`}
                  className="absolute left-0 right-0 h-px bg-gray-400 dark:bg-gray-600"
                  style={{ top: `${yPosition}px` }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1 + 0.3,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                />
              );
            })}

            {/* Orange Indicator Line */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-orange-500 z-10 origin-left"
              animate={{
                y: activeIndex * 120 + 60,
                scaleX: 1,
              }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 30,
              }}
              initial={{ scaleX: 0, y: 60 }}
            >
              {/* Orange Triangle */}
              <motion.div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-t-transparent border-b-transparent border-r-orange-500"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-white dark:bg-gray-950"
        style={{ padding: '16px' }}
      >
        <div className="max-w-3xl mx-auto">
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
            <CreatePostForm
              postType="weekly"
              onClose={() => setShowCreateForm(false)}
            />
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
                className="group"
              >
                {/* Title with Week # and Date */}
                <motion.h2 
                  className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4 tracking-tight group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors"
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
                    {/* Photos */}
                    {post.photos && post.photos.length > 0 && (
                      <motion.div 
                        className={`grid gap-4 justify-center ${
                          post.photos.length === 1 ? 'grid-cols-1' :
                          post.photos.length === 2 ? 'grid-cols-2' :
                          'grid-cols-3'
                        }`}
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
                            className="relative aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden cursor-pointer group/photo"
                            whileHover={{ scale: 1.02 }}
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
    </div>
  );
}
