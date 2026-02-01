'use client';

import { useState, useRef, useEffect } from 'react';

interface DraggableToolProps {
  id: string;
  initialPosition: { x: number; y: number };
  initialRotation?: number;
  children: React.ReactNode;
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  zIndex?: number;
}

export function DraggableTool({ 
  id, 
  initialPosition, 
  initialRotation = 0,
  children, 
  onPositionChange,
  zIndex = 10 
}: DraggableToolProps) {
  const [position, setPosition] = useState(initialPosition);
  const [rotation] = useState(initialRotation);
  const [isDragging, setIsDragging] = useState(false);
  const [currentZ, setCurrentZ] = useState(zIndex);
  const dragRef = useRef<{ startX: number; startY: number; itemX: number; itemY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setCurrentZ(100);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      itemX: position.x,
      itemY: position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      
      const newPos = {
        x: dragRef.current.itemX + dx,
        y: dragRef.current.itemY + dy,
      };
      
      setPosition(newPos);
      onPositionChange?.(id, newPos);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setCurrentZ(zIndex);
      dragRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, id, onPositionChange, zIndex]);

  return (
    <div
      className={`absolute tool-shadow ${isDragging ? 'dragging' : 'draggable'}`}
      style={{
        left: position.x,
        top: position.y,
        transform: `rotate(${rotation}deg)`,
        zIndex: currentZ,
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
}
