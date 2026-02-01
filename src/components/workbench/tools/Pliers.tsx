export function Pliers() {
  return (
    <svg width="120" height="35" viewBox="0 0 120 35">
      {/* Handle 1 */}
      <rect x="0" y="8" width="45" height="8" rx="2" fill="#c0392b" />
      <rect x="0" y="16" width="45" height="8" rx="2" fill="#a93226" />
      
      {/* Handle 2 */}
      <rect x="0" y="20" width="45" height="8" rx="2" fill="#2980b9" />
      <rect x="0" y="12" width="45" height="8" rx="2" fill="#3498db" />
      
      {/* Metal joint */}
      <circle cx="50" cy="17" r="8" fill="#7f8c8d" />
      <circle cx="50" cy="17" r="5" fill="#95a5a6" />
      <circle cx="50" cy="17" r="2" fill="#7f8c8d" />
      
      {/* Jaws */}
      <path d="M55 10 L115 5 L118 12 L60 15 Z" fill="#95a5a6" />
      <path d="M55 24 L115 29 L118 22 L60 19 Z" fill="#7f8c8d" />
      
      {/* Jaw tips */}
      <path d="M115 5 L120 8 L120 12 L118 12 L115 5" fill="#bdc3c7" />
      <path d="M115 29 L120 26 L120 22 L118 22 L115 29" fill="#95a5a6" />
      
      {/* Serrated edge */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={i} x1={65 + i*6} y1="14" x2={65 + i*6} y2="20" stroke="#7f8c8d" strokeWidth="1" />
      ))}
    </svg>
  );
}
