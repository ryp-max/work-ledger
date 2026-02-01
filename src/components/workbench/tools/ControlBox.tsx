export function ControlBox() {
  return (
    <svg width="60" height="80" viewBox="0 0 60 80">
      {/* Box body */}
      <rect x="0" y="0" width="60" height="70" fill="#e8e8e8" rx="3" />
      <rect x="2" y="2" width="56" height="66" fill="#d0d0d0" rx="2" />
      
      {/* Display */}
      <rect x="8" y="8" width="44" height="20" fill="#1a1a1a" rx="2" />
      <rect x="10" y="10" width="40" height="16" fill="#0a2a1a" rx="1" />
      <text x="30" y="22" fontSize="10" fill="#00ff00" textAnchor="middle" fontFamily="monospace">
        120
      </text>
      
      {/* Dial */}
      <circle cx="20" cy="48" r="12" fill="#333" />
      <circle cx="20" cy="48" r="10" fill="#444" />
      <line x1="20" y1="48" x2="20" y2="40" stroke="#e74c3c" strokeWidth="2" />
      <circle cx="20" cy="48" r="3" fill="#222" />
      
      {/* Button */}
      <rect x="38" y="40" width="14" height="14" fill="#c0392b" rx="2" />
      <rect x="39" y="41" width="12" height="6" fill="#e74c3c" rx="1" />
      
      {/* Label */}
      <text x="30" y="66" fontSize="5" fill="#666" textAnchor="middle">
        POWER
      </text>
      
      {/* Cord */}
      <path d="M30 70 Q30 85, 45 85" stroke="#222" strokeWidth="4" fill="none" />
    </svg>
  );
}
