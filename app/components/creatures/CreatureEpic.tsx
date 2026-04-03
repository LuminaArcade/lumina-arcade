export default function CreatureEpic({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="void-body" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#2d1b4e" />
          <stop offset="100%" stopColor="#0f0720" />
        </radialGradient>
        <filter id="void-glow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="void-eye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#ec4899" />
        </radialGradient>
      </defs>
      {/* Shadow wisps */}
      <path d="M45 100 Q30 80 40 60 Q35 75 50 90" fill="#a855f7" opacity="0.15" />
      <path d="M155 100 Q170 80 160 60 Q165 75 150 90" fill="#ec4899" opacity="0.15" />
      <path d="M60 150 Q40 160 35 175 Q45 165 65 155" fill="#a855f7" opacity="0.1" />
      <path d="M140 150 Q160 160 165 175 Q155 165 135 155" fill="#ec4899" opacity="0.1" />
      {/* Body */}
      <circle cx="100" cy="110" r="55" fill="url(#void-body)" filter="url(#void-glow)" />
      {/* Energy crack lines */}
      <path d="M65 85 Q75 95 70 110 Q80 100 75 120" fill="none" stroke="#ec4899" strokeWidth="1.5" opacity="0.4" />
      <path d="M130 90 Q125 100 135 115 Q120 108 130 125" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.4" />
      <path d="M85 140 Q95 135 100 145 Q105 135 115 140" fill="none" stroke="#ec4899" strokeWidth="1" opacity="0.3" />
      {/* Horns */}
      <path d="M72 68 Q65 45 58 30" fill="none" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
      <path d="M128 68 Q135 45 142 30" fill="none" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
      <circle cx="58" cy="28" r="4" fill="#ec4899" opacity="0.8" />
      <circle cx="142" cy="28" r="4" fill="#ec4899" opacity="0.8" />
      {/* Single large eye */}
      <circle cx="100" cy="105" r="20" fill="url(#void-eye)" />
      <circle cx="100" cy="105" r="10" fill="#0f0720" />
      <circle cx="100" cy="105" r="4" fill="#ec4899" opacity="0.6" />
      <circle cx="107" cy="98" r="5" fill="white" opacity="0.7" />
      <circle cx="94" cy="110" r="2.5" fill="white" opacity="0.4" />
      {/* Mouth */}
      <path d="M85 132 Q92 128 100 132 Q108 128 115 132" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.6" />
      {/* Floating particles around */}
      <circle cx="50" cy="70" r="2" fill="#ec4899" opacity="0.5" />
      <circle cx="150" cy="75" r="1.5" fill="#a855f7" opacity="0.4" />
      <circle cx="45" cy="140" r="1.5" fill="#ec4899" opacity="0.3" />
      <circle cx="155" cy="135" r="2" fill="#a855f7" opacity="0.4" />
    </svg>
  );
}
