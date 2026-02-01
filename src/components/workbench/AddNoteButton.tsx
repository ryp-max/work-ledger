'use client';

interface AddNoteButtonProps {
  onAdd: () => void;
}

export function AddNoteButton({ onAdd }: AddNoteButtonProps) {
  return (
    <button
      onClick={onAdd}
      className="fixed bottom-6 right-6 w-14 h-14 bg-[#fef08a] rounded-lg shadow-lg
                 flex items-center justify-center text-3xl text-gray-700
                 hover:scale-110 hover:shadow-xl transition-all duration-200
                 border-2 border-yellow-300"
      style={{
        fontFamily: 'var(--font-handwriting)',
        zIndex: 100,
      }}
      title="Add new note"
    >
      +
    </button>
  );
}
