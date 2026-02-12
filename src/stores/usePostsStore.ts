import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PostType = 'weekly' | 'daily';

export interface Post {
  id: string;
  type: PostType;
  title: string;
  date: string;
  excerpt: string;
  status: 'published' | 'draft';
  hasDetailedContent?: boolean;
  photos?: string[];
  workInProgress?: string[];
  nextWeekGoals?: string[];
  lifeUpdates?: string[];
}

const DEFAULT_POSTS: Post[] = [
  {
    id: '1',
    type: 'weekly',
    title: 'Week 01: Getting Started',
    date: '2024-01-01',
    excerpt:
      'Starting a new year with fresh ideas and renewed energy. This week I focused on setting up my workspace and planning the year ahead.',
    hasDetailedContent: false,
    status: 'published',
  },
  {
    id: '2',
    type: 'weekly',
    title: 'Week 02: Building Momentum',
    date: '2024-01-08',
    excerpt:
      "Made significant progress on several projects. The momentum is building and I'm feeling productive.",
    hasDetailedContent: false,
    status: 'published',
  },
  {
    id: '3',
    type: 'weekly',
    title: 'Week 03: Reflections',
    date: '2024-01-15',
    excerpt:
      'Taking time to reflect on the past few weeks. Sometimes slowing down helps you speed up.',
    hasDetailedContent: false,
    status: 'published',
  },
  {
    id: '4',
    type: 'weekly',
    title: 'Week 04: Current Update',
    date: new Date().toISOString().split('T')[0],
    excerpt: "Here's what I've been up to this week.",
    hasDetailedContent: true,
    status: 'published',
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

interface PostsState {
  posts: Post[];
  addPost: (post: Omit<Post, 'id'>) => void;
  deletePost: (id: string) => void;
}

export const usePostsStore = create<PostsState>()(
  persist(
    (set) => ({
      posts: DEFAULT_POSTS,

      addPost: (post) => {
        const newPost: Post = {
          ...post,
          id: Date.now().toString(),
          hasDetailedContent: post.hasDetailedContent ?? false,
        };
        set((state) => ({
          posts: [newPost, ...state.posts].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        }));
      },

      deletePost: (id) => {
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        }));
      },
    }),
    { name: 'work-ledger-posts' }
  )
);
