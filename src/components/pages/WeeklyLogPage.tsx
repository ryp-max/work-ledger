'use client';

// Mock blog posts - replace with actual MDX loading later
const MOCK_POSTS = [
  {
    id: '1',
    title: 'Week 01: Getting Started',
    date: '2024-01-01',
    excerpt: 'Starting a new year with fresh ideas and renewed energy. This week I focused on setting up my workspace and planning the year ahead.',
  },
  {
    id: '2',
    title: 'Week 02: Building Momentum',
    date: '2024-01-08',
    excerpt: 'Made significant progress on several projects. The momentum is building and I\'m feeling productive.',
  },
  {
    id: '3',
    title: 'Week 03: Reflections',
    date: '2024-01-15',
    excerpt: 'Taking time to reflect on the past few weeks. Sometimes slowing down helps you speed up.',
  },
];

export function WeeklyLogPage() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Weekly Log</h1>
      
      <div className="space-y-6">
        {MOCK_POSTS.map((post) => (
          <article
            key={post.id}
            className="p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
            <time className="text-sm text-gray-500 mb-3 block">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
