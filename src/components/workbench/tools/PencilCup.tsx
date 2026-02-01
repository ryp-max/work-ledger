export function PencilCup() {
  return (
    <svg width="50" height="70" viewBox="0 0 50 70">
      {/* Cup body - top down perspective */}
      <ellipse cx="25" cy="60" rx="22" ry="8" fill="#8b7355" />
      <rect x="3" y="20" width="44" height="40" fill="#a08060" />
      <ellipse cx="25" cy="20" rx="22" ry="8" fill="#c4a77d" />
      <ellipse cx="25" cy="20" rx="18" ry="6" fill="#1a1a1a" opacity="0.3" />
      
      {/* Pencils */}
      <rect x="12" y="0" width="4" height="25" fill="#f4d03f" transform="rotate(-5 14 25)" />
      <polygon points="12,0 16,0 14,-6" fill="#f5d76e" transform="rotate(-5 14 25)" />
      <rect x="12" y="-6" width="4" height="3" fill="#2c3e50" transform="rotate(-5 14 25)" />
      
      <rect x="20" y="2" width="4" height="22" fill="#e74c3c" />
      <polygon points="20,2 24,2 22,-4" fill="#f1948a" />
      <rect x="20" y="-4" width="4" height="3" fill="#2c3e50" />
      
      <rect x="28" y="0" width="4" height="24" fill="#3498db" transform="rotate(8 30 24)" />
      <polygon points="28,0 32,0 30,-6" fill="#5dade2" transform="rotate(8 30 24)" />
      <rect x="28" y="-6" width="4" height="3" fill="#2c3e50" transform="rotate(8 30 24)" />
      
      <rect x="35" y="3" width="4" height="21" fill="#27ae60" transform="rotate(12 37 24)" />
      <polygon points="35,3 39,3 37,-3" fill="#58d68d" transform="rotate(12 37 24)" />
      <rect x="35" y="-3" width="4" height="3" fill="#2c3e50" transform="rotate(12 37 24)" />
      
      {/* Brush */}
      <rect x="6" y="5" width="5" height="18" fill="#8b4513" transform="rotate(-12 8 23)" />
      <ellipse cx="8" cy="3" rx="4" ry="6" fill="#2c2c2c" transform="rotate(-12 8 23)" />
    </svg>
  );
}
