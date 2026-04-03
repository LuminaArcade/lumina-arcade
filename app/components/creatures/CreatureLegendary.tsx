export default function CreatureLegendary({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="arcana-body" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        <filter id="arcana-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="arcana-wing-l" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="arcana-wing-r" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Crown of light rays */}
      {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle) => (
        <line
          key={angle}
          x1="100"
          y1="60"
          x2={100 + Math.cos((angle * Math.PI) / 180) * 35}
          y2={60 + Math.sin((angle * Math.PI) / 180) * 35}
          stroke="#fbbf24"
          strokeWidth="2"
          opacity="0.3"
          strokeLinecap="round"
        />
      ))}
      {/* Halo */}
      <ellipse
        cx="100" cy="48" rx="28" ry="8"
        fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.5"
        className="animate-rotate-slow origin-center"
        style={{ transformOrigin: "100px 48px" }}
      />
      {/* Wings */}
      <path
        d="M48 110 Q20 80 25 50 Q30 75 45 85 Q35 95 40 105Z"
        fill="url(#arcana-wing-l)"
        stroke="#fbbf24"
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d="M152 110 Q180 80 175 50 Q170 75 155 85 Q165 95 160 105Z"
        fill="url(#arcana-wing-r)"
        stroke="#fbbf24"
        strokeWidth="1"
        opacity="0.6"
      />
      {/* Body */}
      <circle cx="100" cy="110" r="50" fill="url(#arcana-body)" filter="url(#arcana-glow)" />
      {/* Circuit patterns */}
      <path d="M70 95 L80 95 L85 100 L95 100" fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.4" />
      <path d="M105 100 L115 100 L120 95 L130 95" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.4" />
      <path d="M80 125 L90 125 L95 130 L105 130 L110 125 L120 125" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
      <circle cx="95" cy="100" r="2" fill="#22d3ee" opacity="0.5" />
      <circle cx="105" cy="100" r="2" fill="#a855f7" opacity="0.5" />
      {/* Left Eye */}
      <circle cx="82" cy="105" r="11" fill="white" />
      <circle cx="82" cy="105" r="7" fill="#d97706" />
      {/* Star pupil */}
      <polygon
        points="82,99 83.5,103 88,103 84.5,106 86,110 82,107 78,110 79.5,106 76,103 80.5,103"
        fill="#0f172a"
      />
      {/* Right Eye */}
      <circle cx="118" cy="105" r="11" fill="white" />
      <circle cx="118" cy="105" r="7" fill="#d97706" />
      <polygon
        points="118,99 119.5,103 124,103 120.5,106 122,110 118,107 114,110 115.5,106 112,103 116.5,103"
        fill="#0f172a"
      />
      {/* Shine on eyes */}
      <circle cx="86" cy="101" r="3" fill="white" opacity="0.7" />
      <circle cx="122" cy="101" r="3" fill="white" opacity="0.7" />
      {/* Mouth - serene smile */}
      <path d="M90 122 Q100 130 110 122" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
      {/* Floating gems */}
      <polygon points="42 130 46 125 50 130 46 135" fill="#a855f7" opacity="0.6" />
      <polygon points="150 130 154 125 158 130 154 135" fill="#22d3ee" opacity="0.6" />
      <polygon points="55 160 58 156 61 160 58 164" fill="#ec4899" opacity="0.4" />
      <polygon points="139 160 142 156 145 160 142 164" fill="#4ade80" opacity="0.4" />
    </svg>
  );
}
