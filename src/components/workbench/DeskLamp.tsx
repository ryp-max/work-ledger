'use client';

import { useState, useRef, useEffect } from 'react';

interface DeskLampProps {
  initialPosition: { x: number; y: number };
  isOn: boolean;
  onToggle: () => void;
  side: 'left' | 'right';
}

export function DeskLamp({ initialPosition, isOn, onToggle, side }: DeskLampProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; lampX: number; lampY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      lampX: position.x,
      lampY: position.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      
      setPosition({
        x: dragRef.current.lampX + dx,
        y: dragRef.current.lampY + dy,
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
  }, [isDragging]);

  return (
    <div
      className={`absolute ${isDragging ? 'dragging' : 'draggable'}`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: 50,
      }}
    >
      {/* Lamp glow */}
      {isOn && (
        <div 
          className="absolute pointer-events-none"
          style={{
            width: 350,
            height: 500,
            left: side === 'left' ? -50 : -200,
            top: 60,
            background: 'radial-gradient(ellipse at top, rgba(254, 243, 199, 0.4) 0%, rgba(254, 243, 199, 0.1) 40%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
      )}

      {/* Lamp arm */}
      <div
        className="absolute w-2 bg-gradient-to-b from-gray-600 to-gray-700 rounded"
        style={{
          height: 120,
          left: 35,
          top: -80,
          transform: `rotate(${side === 'left' ? 15 : -15}deg)`,
          transformOrigin: 'bottom center',
        }}
      />

      {/* Lamp head */}
      <div
        className={`relative ${isDragging ? '' : 'cursor-pointer'}`}
        onMouseDown={handleMouseDown}
        onClick={onToggle}
      >
        <svg width="80" height="60" viewBox="0 0 80 60">
          {/* Lamp shade */}
          <path
            d="M10 55 L25 10 L55 10 L70 55 Z"
            fill={isOn ? '#1f2937' : '#374151'}
            stroke="#4b5563"
            strokeWidth="2"
          />
          {/* Inner glow when on */}
          {isOn && (
            <ellipse
              cx="40"
              cy="50"
              rx="25"
              ry="8"
              fill="#fef3c7"
              opacity="0.9"
            />
          )}
          {/* Bulb hint */}
          <circle
            cx="40"
            cy="25"
            r="8"
            fill={isOn ? '#fef08a' : '#6b7280'}
          />
        </svg>
      </div>

      {/* Lamp base clamp */}
      <div 
        className="absolute w-16 h-6 bg-gray-700 rounded-b-lg"
        style={{ left: 8, top: 55 }}
      />
    </div>
  );
}
