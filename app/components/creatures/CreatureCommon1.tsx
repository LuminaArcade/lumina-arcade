export default function CreatureCommon1({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="blobby-body" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0e7490" />
        </radialGradient>
        <filter id="blobby-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Body */}
      <ellipse cx="100" cy="115" rx="58" ry="52" fill="url(#blobby-body)" filter="url(#blobby-glow)" />
      {/* Belly highlight */}
      <ellipse cx="100" cy="125" rx="35" ry="28" fill="rgba(255,255,255,0.1)" />
      {/* Antenna */}
      <line x1="100" y1="63" x2="100" y2="38" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="33" r="6" fill="#22d3ee" opacity="0.9" />
      {/* Left Eye */}
      <ellipse cx="78" cy="105" rx="12" ry="13" fill="white" />
      <circle cx="81" cy="106" r="6" fill="#0f172a" />
      <circle cx="83" cy="103" r="2.5" fill="white" />
      {/* Right Eye */}
      <ellipse cx="122" cy="105" rx="12" ry="13" fill="white" />
      <circle cx="125" cy="106" r="6" fill="#0f172a" />
      <circle cx="127" cy="103" r="2.5" fill="white" />
      {/* Mouth */}
      <path d="M90 128 Q100 138 110 128" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms */}
      <ellipse cx="45" cy="120" rx="14" ry="10" fill="#0e7490" transform="rotate(-20 45 120)" />
      <ellipse cx="155" cy="120" rx="14" ry="10" fill="#0e7490" transform="rotate(20 155 120)" />
      {/* Feet */}
      <ellipse cx="80" cy="165" rx="16" ry="8" fill="#0e7490" />
      <ellipse cx="120" cy="165" rx="16" ry="8" fill="#0e7490" />
      {/* Blush */}
      <circle cx="62" cy="122" r="7" fill="#ec4899" opacity="0.2" />
      <circle cx="138" cy="122" r="7" fill="#ec4899" opacity="0.2" />
    </svg>
  );
}
