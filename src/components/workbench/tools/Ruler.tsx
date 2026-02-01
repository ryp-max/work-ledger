export function Ruler() {
  return (
    <svg width="200" height="30" viewBox="0 0 200 30">
      {/* Ruler body */}
      <rect x="0" y="0" width="200" height="30" fill="#f5f5dc" rx="1" />
      <rect x="0" y="0" width="200" height="30" fill="url(#rulerGrain)" rx="1" />
      
      {/* Measurement marks */}
      {[...Array(21)].map((_, i) => (
        <g key={i}>
          {/* Main marks (every cm) */}
          <line 
            x1={i * 10} 
            y1="0" 
            x2={i * 10} 
            y2={i % 5 === 0 ? 12 : 8} 
            stroke="#333" 
            strokeWidth={i % 5 === 0 ? 1 : 0.5} 
          />
          {/* Numbers every 5 */}
          {i % 5 === 0 && i > 0 && (
            <text x={i * 10} y="22" fontSize="8" textAnchor="middle" fill="#333">
              {i}
            </text>
          )}
          {/* Half marks */}
          {i < 20 && (
            <line x1={i * 10 + 5} y1="0" x2={i * 10 + 5} y2="5" stroke="#333" strokeWidth="0.5" />
          )}
        </g>
      ))}
      
      {/* Metal edge */}
      <rect x="0" y="28" width="200" height="2" fill="#95a5a6" />
      
      <defs>
        <pattern id="rulerGrain" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="transparent" />
          <line x1="0" y1="0" x2="4" y2="4" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" />
        </pattern>
      </defs>
    </svg>
  );
}
