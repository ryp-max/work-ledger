'use client';

import { motion } from 'framer-motion';

// Mock blog posts - replace with actual MDX loading later
const MOCK_POSTS = [
  {
    id: '1',
    title: 'Week 01: Getting Started',
    date: '2024-01-01',
    excerpt: 'Starting a new year with fresh ideas and renewed energy. This week I focused on setting up my workspace and planning the year ahead.',
    hasDetailedContent: false,
  },
  {
    id: '2',
    title: 'Week 02: Building Momentum',
    date: '2024-01-08',
    excerpt: 'Made significant progress on several projects. The momentum is building and I\'m feeling productive.',
    hasDetailedContent: false,
  },
  {
    id: '3',
    title: 'Week 03: Reflections',
    date: '2024-01-15',
    excerpt: 'Taking time to reflect on the past few weeks. Sometimes slowing down helps you speed up.',
    hasDetailedContent: false,
  },
  {
    id: '4',
    title: 'Week 04: Current Update',
    date: new Date().toISOString().split('T')[0],
    excerpt: 'Here\'s what I\'ve been up to this week.',
    hasDetailedContent: true,
    photos: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
    ],
    workInProgress: [
      'Redesigning the user dashboard with better analytics',
      'Building a new API endpoint for real-time notifications',
      'Writing documentation for the latest feature release',
    ],
    nextWeekGoals: [
      'Launch the beta version of the new feature',
      'Complete the mobile app redesign',
      'Schedule user testing sessions',
    ],
    lifeUpdates: [
      'Finally finished reading "The Design of Everyday Things" - highly recommend!',
      'Tried a new coffee shop downtown and their cold brew is amazing',
      'Started learning piano again after a 5-year break - fingers are rusty but it feels good',
    ],
  },
];

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
  return (
    <div className="w-full h-full overflow-y-auto bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto py-16 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-gray-50 mb-3 tracking-tight">
            Weekly Log
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            A collection of weekly reflections and updates
          </p>
        </motion.div>

        {/* Posts */}
        <div className="space-y-20">
          {MOCK_POSTS.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="group"
            >
              {/* Title with Week # and Date */}
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-4 tracking-tight group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors text-center">
                <span className="text-gray-600 dark:text-gray-400 font-normal">
                  Week {getWeekNumber(post.title) || '?'}
                </span>
                <span className="mx-2 text-gray-400 dark:text-gray-600">·</span>
                <time className="text-gray-600 dark:text-gray-400 font-normal">
                  {formatDate(post.date)}
                </time>
              </h2>
              
              {/* Subtitle */}
              {post.title.includes(':') && (
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 font-medium text-center">
                  {post.title.split(':').slice(1).join(':').trim()}
                </p>
              )}

              {/* Excerpt */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-lg text-center">
                {post.excerpt}
              </p>

              {/* Detailed Content */}
              {post.hasDetailedContent && (
                <div className="space-y-8 mt-8">
                  {/* Photos */}
                  {post.photos && post.photos.length > 0 && (
                    <div className={`grid gap-4 ${
                      post.photos.length === 1 ? 'grid-cols-1' :
                      post.photos.length === 2 ? 'grid-cols-2' :
                      'grid-cols-3'
                    }`}>
                      {post.photos.map((photo, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            delay: 0.2 + idx * 0.1,
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          className="relative aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden cursor-pointer group/photo"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <img
                            src={photo}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover transition-opacity duration-300 group-hover/photo:opacity-90"
                            loading="lazy"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Work in Progress */}
                  {post.workInProgress && post.workInProgress.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="border-l-2 border-gray-200 dark:border-gray-800 pl-6 py-2"
                    >
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                        Work in Progress
                      </h3>
                      <ul className="space-y-3">
                        {post.workInProgress.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + idx * 0.05, duration: 0.3 }}
                            className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start gap-3"
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
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className="border-l-2 border-gray-200 dark:border-gray-800 pl-6 py-2"
                    >
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                        Next Week Goals
                      </h3>
                      <ul className="space-y-3">
                        {post.nextWeekGoals.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.45 + idx * 0.05, duration: 0.3 }}
                            className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start gap-3"
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
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="border-l-2 border-gray-200 dark:border-gray-800 pl-6 py-2"
                    >
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                        Life Updates
                      </h3>
                      <ul className="space-y-3">
                        {post.lifeUpdates.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.55 + idx * 0.05, duration: 0.3 }}
                            className="text-gray-700 dark:text-gray-300 leading-relaxed flex items-start gap-3"
                          >
                            <span className="text-gray-400 dark:text-gray-600 mt-1.5 text-xs">—</span>
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Divider */}
              {index < MOCK_POSTS.length - 1 && (
                <div className="mt-20 pt-20 border-t border-gray-200 dark:border-gray-800" />
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
