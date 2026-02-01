'use client';

interface LampProps {
  isOn: boolean;
  onToggle: () => void;
}

export function Lamp({ isOn, onToggle }: LampProps) {
  return (
    <div className="relative" onClick={onToggle}>
      {/* Glow effect */}
      {isOn && (
        <div 
          className="absolute pointer-events-none"
          style={{
            width: 400,
            height: 400,
            left: -160,
            top: 20,
            background: 'radial-gradient(ellipse at center, rgba(255, 244, 214, 0.5) 0%, rgba(255, 244, 214, 0.2) 30%, transparent 60%)',
            filter: 'blur(20px)',
            zIndex: -1,
          }}
        />
      )}
      
      {/* Lamp head - top down view */}
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Lamp shade outer ring */}
        <ellipse cx="40" cy="40" rx="35" ry="35" fill="#1a1a1a" />
        <ellipse cx="40" cy="40" rx="32" ry="32" fill="#2d2d2d" />
        
        {/* Inner cone/reflector */}
        <ellipse cx="40" cy="40" rx="25" ry="25" fill="#3d3d3d" />
        
        {/* Bulb area */}
        <ellipse 
          cx="40" 
          cy="40" 
          rx="12" 
          ry="12" 
          fill={isOn ? '#fff8e7' : '#4a4a4a'}
        />
        {isOn && (
          <ellipse 
            cx="40" 
            cy="40" 
            rx="8" 
            ry="8" 
            fill="#fffef0"
            opacity="0.9"
          />
        )}
        
        {/* Arm attachment point */}
        <rect x="36" y="70" width="8" height="12" fill="#2d2d2d" rx="2" />
      </svg>
      
      {/* Coiled cord */}
      <svg 
        width="60" 
        height="40" 
        viewBox="0 0 60 40" 
        className="absolute"
        style={{ left: 60, top: 50 }}
      >
        <path
          d="M0 20 Q10 5, 20 20 Q30 35, 40 20 Q50 5, 60 20"
          stroke="#1a1a1a"
          strokeWidth="4"
          fill="none"
        />
      </svg>
    </div>
  );
}
