'use client';

interface PegboardFrameProps {
  title: string;
  position: { x: number; y: number };
  children?: React.ReactNode;
}

export function PegboardFrame({ title, position, children }: PegboardFrameProps) {
  return (
    <div
      className="absolute"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Frame */}
      <div className="relative p-1 bg-gradient-to-br from-amber-900 to-amber-950 rounded shadow-lg">
        <div className="bg-white p-2">
          {children || (
            <div className="w-32 h-24 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-xs">{title}</span>
            </div>
          )}
        </div>
      </div>
      {/* Hanging wire */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 border-t-2 border-gray-500 rounded-t-full" />
    </div>
  );
}
