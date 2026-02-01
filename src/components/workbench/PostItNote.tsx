'use client';

import { useState, useRef, useEffect } from 'react';
import type { PostItNote as PostItNoteType } from '@/lib/workbench-store';

interface PostItNoteProps {
  note: PostItNoteType;
  onUpdate: (id: string, updates: Partial<PostItNoteType>) => void;
  onDelete: (id: string) => void;
  onBringToFront: (id: string) => void;
}

const colorClasses = {
  yellow: 'bg-[#fef08a]',
  pink: 'bg-[#fda4af]',
  blue: 'bg-[#93c5fd]',
  green: 'bg-[#86efac]',
  orange: 'bg-[#fdba74]',
};

export function PostItNote({ note, onUpdate, onDelete, onBringToFront }: PostItNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const dragRef = useRef<{ startX: number; startY: number; noteX: number; noteY: number } | null>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    
    e.preventDefault();
    onBringToFront(note.id);
    setIsDragging(true);
    
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      noteX: note.position.x,
      noteY: note.position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      
      onUpdate(note.id, {
        position: {
          x: dragRef.current.noteX + dx,
          y: dragRef.current.noteY + dy,
        },
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, note.id, onUpdate]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(note.id, { content });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setContent(note.content);
    }
  };

  return (
    <div
      ref={noteRef}
      className={`
        postit absolute w-44 min-h-44 p-3 rounded-sm
        ${colorClasses[note.color]}
        ${isDragging ? 'dragging scale-105' : 'draggable'}
        transition-shadow duration-150
        hover:shadow-lg
      `}
      style={{
        left: note.position.x,
        top: note.position.y,
        transform: `rotate(${note.rotation}deg)`,
        zIndex: note.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Tape effect at top */}
      <div 
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#e8dcc8] opacity-70 rounded-sm"
        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
      />
      
      {/* Delete button */}
      <button
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full 
                   text-xs flex items-center justify-center opacity-0 hover:opacity-100
                   transition-opacity shadow-md"
        onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
        style={{ zIndex: note.zIndex + 1 }}
      >
        ×
      </button>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full min-h-32 bg-transparent border-none outline-none resize-none
                     font-[var(--font-handwriting)] text-lg text-gray-800 leading-relaxed"
          placeholder="Write something..."
        />
      ) : (
        <p className="font-[var(--font-handwriting)] text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
          {note.content || 'Double-click to edit...'}
        </p>
      )}

      {/* Color picker on hover */}
      <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
        {(['yellow', 'pink', 'blue', 'green', 'orange'] as const).map((color) => (
          <button
            key={color}
            className={`w-3 h-3 rounded-full ${colorClasses[color]} border border-gray-400/30`}
            onClick={(e) => { e.stopPropagation(); onUpdate(note.id, { color }); }}
          />
        ))}
      </div>
    </div>
  );
}
