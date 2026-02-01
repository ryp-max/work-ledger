'use client';

export function ToolRack() {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2">
      {/* Tool holder bar */}
      <div className="w-48 h-3 bg-gradient-to-b from-gray-500 to-gray-600 rounded shadow-md" />
      
      {/* Hanging tools */}
      <div className="flex gap-4 -mt-1 pl-2">
        {/* Scissors */}
        <div className="tool cursor-pointer hover:scale-110 transition-transform">
          <svg width="30" height="50" viewBox="0 0 30 50">
            <ellipse cx="8" cy="8" rx="6" ry="8" fill="none" stroke="#374151" strokeWidth="2"/>
            <ellipse cx="22" cy="8" rx="6" ry="8" fill="none" stroke="#374151" strokeWidth="2"/>
            <path d="M8 16 L15 30 L22 16" stroke="#374151" strokeWidth="3" fill="none"/>
            <path d="M12 30 L8 48" stroke="#9ca3af" strokeWidth="2"/>
            <path d="M18 30 L22 48" stroke="#9ca3af" strokeWidth="2"/>
          </svg>
        </div>

        {/* Ruler */}
        <div className="tool cursor-pointer hover:scale-110 transition-transform">
          <div className="w-4 h-40 bg-gradient-to-b from-amber-200 to-amber-300 rounded-sm border border-amber-400">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-px bg-gray-600 ml-1"
                style={{ marginTop: i === 0 ? 4 : 16 }}
              />
            ))}
          </div>
        </div>

        {/* Brush */}
        <div className="tool cursor-pointer hover:scale-110 transition-transform">
          <svg width="20" height="50" viewBox="0 0 20 50">
            <rect x="7" y="0" width="6" height="30" fill="#8b5a2b" rx="1"/>
            <rect x="5" y="28" width="10" height="8" fill="#9ca3af"/>
            <path d="M5 36 Q10 50 15 36" fill="#1f2937"/>
          </svg>
        </div>

        {/* Pencil cup */}
        <div className="tool cursor-pointer">
          <div className="relative">
            <div className="w-10 h-12 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-lg border-t-2 border-gray-500" />
            {/* Pencils sticking out */}
            <div className="absolute -top-6 left-1 w-1.5 h-8 bg-yellow-400 rounded-t-sm transform -rotate-6" />
            <div className="absolute -top-8 left-3 w-1.5 h-10 bg-red-400 rounded-t-sm" />
            <div className="absolute -top-5 left-5 w-1.5 h-7 bg-blue-400 rounded-t-sm transform rotate-6" />
            <div className="absolute -top-7 left-7 w-1.5 h-9 bg-green-400 rounded-t-sm transform rotate-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
