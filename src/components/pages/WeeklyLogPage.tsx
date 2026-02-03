'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// Mock blog posts - replace with actual MDX loading later
const MOCK_POSTS = [
  {
    id: '1',
    title: 'Week 01: Getting Started',
    date: '2024-01-01',
    excerpt: 'Starting a new year with fresh ideas and renewed energy. This week I focused on setting up my workspace and planning the year ahead.',
    likes: 12,
    comments: 3,
    shares: 1,
    hasDetailedContent: false,
  },
  {
    id: '2',
    title: 'Week 02: Building Momentum',
    date: '2024-01-08',
    excerpt: 'Made significant progress on several projects. The momentum is building and I\'m feeling productive.',
    likes: 24,
    comments: 5,
    shares: 2,
    hasDetailedContent: false,
  },
  {
    id: '3',
    title: 'Week 03: Reflections',
    date: '2024-01-15',
    excerpt: 'Taking time to reflect on the past few weeks. Sometimes slowing down helps you speed up.',
    likes: 18,
    comments: 4,
    shares: 1,
    hasDetailedContent: false,
  },
  {
    id: '4',
    title: 'Week 04: Current Update',
    date: new Date().toISOString().split('T')[0],
    excerpt: 'Here\'s what I\'ve been up to this week!',
    likes: 32,
    comments: 8,
    shares: 3,
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
      'Tried a new coffee shop downtown and their cold brew is amazing ☕',
      'Started learning piano again after a 5-year break - fingers are rusty but it feels good',
    ],
  },
];

// Helper function to format relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

export function WeeklyLogPage() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(
    MOCK_POSTS.reduce((acc, post) => {
      acc[post.id] = post.likes;
      return acc;
    }, {} as Record<string, number>)
  );

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        setLikeCounts(prev => ({ ...prev, [postId]: prev[postId] - 1 }));
      } else {
        newSet.add(postId);
        setLikeCounts(prev => ({ ...prev, [postId]: prev[postId] + 1 }));
      }
      return newSet;
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gray-100 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 p-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Log</h1>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {MOCK_POSTS.map((post, index) => {
            const isLiked = likedPosts.has(post.id);
            const currentLikes = likeCounts[post.id] || post.likes;
            
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-center gap-3">
                    {/* Profile Picture */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {post.title.charAt(post.title.length - 1)}
                    </div>
                    
                    {/* Name and Time */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-900 dark:text-white text-[15px]">
                          Weekly Log
                        </h2>
                        <span className="text-gray-500 dark:text-gray-400">·</span>
                        <time className="text-[13px] text-gray-500 dark:text-gray-400">
                          {getRelativeTime(post.date)}
                        </time>
                      </div>
                      <div className="text-[13px] text-gray-600 dark:text-gray-300 mt-0.5">
                        {post.title}
                      </div>
                    </div>
                    
                    {/* More Options */}
                    <button className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-[15px] text-gray-900 dark:text-gray-100 leading-relaxed mb-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Detailed Content */}
                  {post.hasDetailedContent && (
                    <div className="space-y-4 mt-3">
                      {/* Photos */}
                      {post.photos && post.photos.length > 0 && (
                        <div className={`grid gap-2 ${
                          post.photos.length === 1 ? 'grid-cols-1' :
                          post.photos.length === 2 ? 'grid-cols-2' :
                          'grid-cols-3'
                        }`}>
                          {post.photos.map((photo, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            >
                              <img
                                src={photo}
                                alt={`Photo ${idx + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Work in Progress */}
                      {post.workInProgress && post.workInProgress.length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
                          <h3 className="font-semibold text-[15px] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <span className="text-blue-600 dark:text-blue-400">⚙️</span>
                            Work in Progress
                          </h3>
                          <ul className="space-y-1.5">
                            {post.workInProgress.map((item, idx) => (
                              <li key={idx} className="text-[14px] text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Next Week Goals */}
                      {post.nextWeekGoals && post.nextWeekGoals.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800">
                          <h3 className="font-semibold text-[15px] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <span className="text-green-600 dark:text-green-400">🎯</span>
                            Next Week Goals
                          </h3>
                          <ul className="space-y-1.5">
                            {post.nextWeekGoals.map((item, idx) => (
                              <li key={idx} className="text-[14px] text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-green-500 dark:text-green-400 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Life Updates */}
                      {post.lifeUpdates && post.lifeUpdates.length > 0 && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-100 dark:border-purple-800">
                          <h3 className="font-semibold text-[15px] text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <span className="text-purple-600 dark:text-purple-400">✨</span>
                            Life Updates
                          </h3>
                          <ul className="space-y-1.5">
                            {post.lifeUpdates.map((item, idx) => (
                              <li key={idx} className="text-[14px] text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-purple-500 dark:text-purple-400 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Engagement Bar */}
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-[13px] text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    {currentLikes > 0 && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zM12 18.5l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-8 10z"/>
                        </svg>
                        <span>{currentLikes}</span>
                      </div>
                    )}
                    {post.comments > 0 && (
                      <span>{post.comments} comments</span>
                    )}
                    {post.shares > 0 && (
                      <span>{post.shares} shares</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <motion.button
                      onClick={() => handleLike(post.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg mx-1 transition-colors ${
                        isLiked
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-medium text-[15px]">Like</span>
                    </motion.button>
                    
                    <motion.button
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg mx-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="font-medium text-[15px]">Comment</span>
                    </motion.button>
                    
                    <motion.button
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg mx-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342c-.4 0-.8-.1-1.158-.3l-2.526 2.526c-.39.39-1.023.39-1.414 0-.39-.39-.39-1.023 0-1.414l2.526-2.526c-.2-.358-.3-.758-.3-1.158 0-1.381 1.119-2.5 2.5-2.5s2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zm5.316 0c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zm5.316 0c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5z" />
                      </svg>
                      <span className="font-medium text-[15px]">Share</span>
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
