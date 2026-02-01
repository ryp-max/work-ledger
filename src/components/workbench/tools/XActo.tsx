export function XActo() {
  return (
    <svg width="100" height="14" viewBox="0 0 100 14">
      {/* Metal body */}
      <rect x="0" y="3" width="70" height="8" fill="#95a5a6" rx="1" />
      <rect x="0" y="3" width="70" height="3" fill="#bdc3c7" />
      
      {/* Grip rings */}
      {[10, 20, 30, 40, 50].map(x => (
        <rect key={x} x={x} y="2" width="3" height="10" fill="#7f8c8d" rx="0.5" />
      ))}
      
      {/* Blade holder */}
      <rect x="65" y="4" width="10" height="6" fill="#6c7a89" />
      
      {/* Blade */}
      <path d="M75 5 L100 6 L100 8 L75 9 Z" fill="#d5d5d5" />
      <path d="M75 5 L100 6 L100 7 L75 7 Z" fill="#f0f0f0" />
      
      {/* Blade edge (sharp) */}
      <line x1="75" y1="7" x2="100" y2="7" stroke="#aaa" strokeWidth="0.5" />
    </svg>
  );
}
