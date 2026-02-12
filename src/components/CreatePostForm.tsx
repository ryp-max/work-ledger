'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePostsStore } from '@/stores/usePostsStore';

const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface CreatePostFormProps {
  onClose: () => void;
}

export function CreatePostForm({ onClose }: CreatePostFormProps) {
  const addPost = usePostsStore((s) => s.addPost);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [excerpt, setExcerpt] = useState('');
  const [hasDetailedContent, setHasDetailedContent] = useState(false);
  const [workInProgress, setWorkInProgress] = useState('');
  const [nextWeekGoals, setNextWeekGoals] = useState('');
  const [lifeUpdates, setLifeUpdates] = useState('');
  const [photos, setPhotos] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseLines = (s: string) =>
    s
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const files = e.target.files;
    if (!files?.length) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_FILE_SIZE) {
        setUploadError(`Some files exceed ${MAX_FILE_SIZE_MB}MB limit (${files[i].name})`);
        continue;
      }
      if (!files[i].type.startsWith('image/')) {
        setUploadError(`Skipped non-image: ${files[i].name}`);
        continue;
      }
      validFiles.push(files[i]);
    }

    try {
      const dataUrls = await Promise.all(validFiles.map(fileToDataUrl));
      setUploadedPhotos((prev) => [...prev, ...dataUrls]);
    } catch {
      setUploadError('Failed to read image files');
    }
    e.target.value = '';
  };

  const removeUploadedPhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) return;

    const wip = parseLines(workInProgress);
    const goals = parseLines(nextWeekGoals);
    const updates = parseLines(lifeUpdates);
    const photoUrls = parseLines(photos);
    const allPhotos = [...uploadedPhotos, ...photoUrls];

    addPost({
      type: 'weekly',
      title: title.trim(),
      date,
      excerpt: excerpt.trim(),
      status: 'published',
      hasDetailedContent,
        ...(hasDetailedContent && {
        ...(wip.length > 0 && { workInProgress: wip }),
        ...(goals.length > 0 && { nextWeekGoals: goals }),
        ...(updates.length > 0 && { lifeUpdates: updates }),
        ...(allPhotos.length > 0 && { photos: allPhotos }),
      }),
    });

    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 mb-8"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
        New Weekly Post
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
            placeholder="Week 01: Getting Started"
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
                    Photos
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                      >
                        Upload from device
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        or paste URLs below (max {MAX_FILE_SIZE_MB}MB per image)
                      </span>
                    </div>
                    {uploadError && (
                      <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                    )}
                    {uploadedPhotos.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {uploadedPhotos.map((src, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={src}
                              alt=""
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                            />
                            <button
                              type="button"
                              onClick={() => removeUploadedPhoto(idx)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <textarea
                      value={photos}
                      onChange={(e) => setPhotos(e.target.value)}
                      placeholder="Or paste image URLs (one per line)&#10;https://..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
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
