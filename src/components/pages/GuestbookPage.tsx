'use client';

// Mock guestbook entries - replace with actual API later
const MOCK_ENTRIES = [
  {
    id: '1',
    name: 'Alice',
    message: 'Love your site! Keep up the great work.',
    date: '2024-01-20',
  },
  {
    id: '2',
    name: 'Bob',
    message: 'This is such a cool concept. Really inspiring!',
    date: '2024-01-18',
  },
];

export function GuestbookPage() {
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Guestbook</h1>
      
      {/* Sign Form */}
      <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sign the Guestbook</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            placeholder="Your message"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {MOCK_ENTRIES.map((entry) => (
          <div
            key={entry.id}
            className="p-6 border border-gray-200 rounded-lg bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{entry.name}</h3>
              <time className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</time>
            </div>
            <p className="text-gray-700">{entry.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
