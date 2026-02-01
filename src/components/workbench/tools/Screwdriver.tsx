export function Screwdriver() {
  return (
    <svg width="140" height="20" viewBox="0 0 140 20">
      {/* Handle */}
      <ellipse cx="20" cy="10" rx="18" ry="9" fill="#e67e22" />
      <ellipse cx="20" cy="10" rx="15" ry="7" fill="#f39c12" />
      
      {/* Handle grip lines */}
      {[8, 14, 20, 26, 32].map(x => (
        <line key={x} x1={x} y1="3" x2={x} y2="17" stroke="#d35400" strokeWidth="1.5" />
      ))}
      
      {/* Metal ferrule */}
      <rect x="38" y="5" width="12" height="10" fill="#95a5a6" rx="1" />
      <rect x="38" y="6" width="12" height="3" fill="#bdc3c7" />
      
      {/* Shaft */}
      <rect x="50" y="7" width="75" height="6" fill="#7f8c8d" rx="1" />
      <rect x="50" y="7" width="75" height="2" fill="#95a5a6" />
      
      {/* Tip */}
      <path d="M125 7 L140 9 L140 11 L125 13 Z" fill="#6c7a89" />
      <path d="M125 7 L140 9 L140 10 L125 10 Z" fill="#95a5a6" />
    </svg>
  );
}
