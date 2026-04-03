export default function CreatureRare2({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="frost-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <filter id="frost-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Body - faceted crystal shape */}
      <polygon
        points="100,55 145,80 155,120 140,155 100,170 60,155 45,120 55,80"
        fill="url(#frost-body)"
        filter="url(#frost-glow)"
      />
      {/* Inner facets */}
      <line x1="100" y1="55" x2="100" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="55" y1="80" x2="140" y2="155" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="145" y1="80" x2="60" y2="155" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* Crown crystals */}
      <polygon points="80,58 85,30 90,55" fill="#a5f3fc" opacity="0.8" />
      <polygon points="95,52 100,18 105,52" fill="#c4b5fd" opacity="0.9" />
      <polygon points="110,58 115,30 120,55" fill="#a5f3fc" opacity="0.8" />
      {/* Eyes - diamond shaped */}
      <polygon points="78,105 85,98 92,105 85,112" fill="white" />
      <polygon points="82,105 85,101 88,105 85,109" fill="#0f172a" />
      <polygon points="108,105 115,98 122,105 115,112" fill="white" />
      <polygon points="112,105 115,101 118,105 115,109" fill="#0f172a" />
      {/* Mouth */}
      <line x1="93" y1="128" x2="107" y2="128" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
      {/* Icicle limbs */}
      <polygon points="45,120 30,135 48,125" fill="#67e8f9" opacity="0.7" />
      <polygon points="155,120 170,135 152,125" fill="#67e8f9" opacity="0.7" />
      <polygon points="75,160 65,185 80,162" fill="#a78bfa" opacity="0.6" />
      <polygon points="125,160 135,185 120,162" fill="#a78bfa" opacity="0.6" />
      {/* Shimmer highlights */}
      <circle cx="80" cy="85" r="3" fill="white" opacity="0.3" />
      <circle cx="120" cy="140" r="2" fill="white" opacity="0.2" />
    </svg>
  );
}
