export default function CreatureCommon2({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sparky-body" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#16a34a" />
        </radialGradient>
        <filter id="sparky-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Body */}
      <path
        d="M55 80 Q50 60 70 55 Q85 50 100 48 Q115 50 130 55 Q150 60 145 80 Q150 120 140 145 Q130 165 100 168 Q70 165 60 145 Q50 120 55 80Z"
        fill="url(#sparky-body)"
        filter="url(#sparky-glow)"
      />
      {/* Belly */}
      <ellipse cx="100" cy="130" rx="30" ry="22" fill="rgba(255,255,255,0.12)" />
      {/* Left Ear (Lightning bolt) */}
      <polygon points="70,55 62,25 72,40 65,10 80,45 75,30 82,52" fill="#fbbf24" />
      {/* Right Ear (Lightning bolt) */}
      <polygon points="130,55 138,25 128,40 135,10 120,45 125,30 118,52" fill="#fbbf24" />
      {/* Left Eye */}
      <ellipse cx="80" cy="100" rx="14" ry="12" fill="white" />
      <circle cx="83" cy="101" r="7" fill="#0f172a" />
      <circle cx="86" cy="98" r="3" fill="white" />
      {/* Right Eye */}
      <ellipse cx="120" cy="100" rx="14" ry="12" fill="white" />
      <circle cx="123" cy="101" r="7" fill="#0f172a" />
      <circle cx="126" cy="98" r="3" fill="white" />
      {/* Mouth - wide grin */}
      <path d="M78 125 Q90 140 100 140 Q110 140 122 125" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M92 133 L95 138 L98 133" fill="white" stroke="white" strokeWidth="1" />
      {/* Blush */}
      <circle cx="62" cy="115" r="7" fill="#fbbf24" opacity="0.25" />
      <circle cx="138" cy="115" r="7" fill="#fbbf24" opacity="0.25" />
      {/* Feet */}
      <ellipse cx="78" cy="170" rx="15" ry="7" fill="#16a34a" />
      <ellipse cx="122" cy="170" rx="15" ry="7" fill="#16a34a" />
      {/* Spark accents */}
      <line x1="40" y1="90" x2="28" y2="85" stroke="#4ade80" strokeWidth="2" opacity="0.6" />
      <line x1="38" y1="100" x2="25" y2="102" stroke="#4ade80" strokeWidth="2" opacity="0.5" />
      <line x1="160" y1="90" x2="172" y2="85" stroke="#4ade80" strokeWidth="2" opacity="0.6" />
      <line x1="162" y1="100" x2="175" y2="102" stroke="#4ade80" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}
