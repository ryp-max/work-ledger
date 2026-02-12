'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePostsStore, type PostType } from '@/stores/usePostsStore';

interface CreatePostFormProps {
  onClose: () => void;
  postType: PostType;
}

export function CreatePostForm({ onClose, postType }: CreatePostFormProps) {
  const addPost = usePostsStore((s) => s.addPost);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [excerpt, setExcerpt] = useState('');
  const [hasDetailedContent, setHasDetailedContent] = useState(false);
  const [workInProgress, setWorkInProgress] = useState('');
  const [nextWeekGoals, setNextWeekGoals] = useState('');
  const [lifeUpdates, setLifeUpdates] = useState('');
  const [photos, setPhotos] = useState('');

  const parseLines = (s: string) =>
    s
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;

    const isWeekly = postType === 'weekly';
    const sanitizedTitle = isWeekly
      ? title.trim()
      : title.trim() || `Daily: ${date}`;

    const wip = parseLines(workInProgress);
    const goals = parseLines(nextWeekGoals);
    const updates = parseLines(lifeUpdates);
    const photoUrls = parseLines(photos);

    addPost({
      type: postType,
      title: sanitizedTitle,
      date,
      excerpt: excerpt.trim(),
      status: 'published',
      hasDetailedContent: isWeekly && hasDetailedContent,
      ...(isWeekly &&
        hasDetailedContent && {
          ...(wip.length > 0 && { workInProgress: wip }),
          ...(goals.length > 0 && { nextWeekGoals: goals }),
          ...(updates.length > 0 && { lifeUpdates: updates }),
          ...(photoUrls.length > 0 && { photos: photoUrls }),
        }),
    });

    onClose();
  };

  const isWeekly = postType === 'weekly';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 mb-8"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
        New {isWeekly ? 'Weekly' : 'Daily'} Post
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isWeekly ? 'Week 01: Getting Started' : 'Daily update'}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        {isWeekly && (
          <>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasDetailedContent}
                onChange={(e) => setHasDetailedContent(e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Include detailed content (photos, work in progress, goals, life updates)
              </span>
            </label>

            {hasDetailedContent && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Work in Progress (one per line)
                  </label>
                  <textarea
                    value={workInProgress}
                    onChange={(e) => setWorkInProgress(e.target.value)}
                    placeholder="Task 1&#10;Task 2"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Next Week Goals (one per line)
                  </label>
                  <textarea
                    value={nextWeekGoals}
                    onChange={(e) => setNextWeekGoals(e.target.value)}
                    placeholder="Goal 1&#10;Goal 2"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Life Updates (one per line)
                  </label>
                  <textarea
                    value={lifeUpdates}
                    onChange={(e) => setLifeUpdates(e.target.value)}
                    placeholder="Update 1&#10;Update 2"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Photo URLs (one per line)
                  </label>
                  <textarea
                    value={photos}
                    onChange={(e) => setPhotos(e.target.value)}
                    placeholder="https://...&#10;https://..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </>
            )}
          </>
        )}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
          >
            Create Post
          </button>
        </div>
      </form>
    </motion.div>
  );
}
