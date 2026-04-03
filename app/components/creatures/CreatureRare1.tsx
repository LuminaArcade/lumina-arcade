export default function CreatureRare1({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="nebula-body" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
        <filter id="nebula-glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Body */}
      <ellipse cx="100" cy="110" rx="55" ry="52" fill="url(#nebula-body)" filter="url(#nebula-glow)" />
      {/* Internal stars */}
      <circle cx="75" cy="95" r="1.5" fill="white" opacity="0.7" />
      <circle cx="120" cy="88" r="2" fill="#fbbf24" opacity="0.6" />
      <circle cx="90" cy="130" r="1" fill="white" opacity="0.5" />
      <circle cx="115" cy="125" r="1.5" fill="white" opacity="0.6" />
      <circle cx="80" cy="115" r="1" fill="#fbbf24" opacity="0.4" />
      <circle cx="130" cy="110" r="1.5" fill="white" opacity="0.5" />
      <circle cx="105" cy="140" r="1" fill="white" opacity="0.3" />
      {/* Ring */}
      <ellipse
        cx="100" cy="110" rx="72" ry="16"
        fill="none" stroke="#c084fc" strokeWidth="3" opacity="0.4"
        transform="rotate(-20 100 110)"
      />
      {/* Eyes - crescent/mysterious */}
      <path d="M75 105 Q82 98 90 105" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M110 105 Q117 98 125 105" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Mouth */}
      <circle cx="100" cy="122" r="3" fill="#1a1b3a" opacity="0.6" />
      {/* Tentacles */}
      <path d="M70 155 Q60 175 55 185" fill="none" stroke="#7c3aed" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      <path d="M88 158 Q85 180 80 192" fill="none" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M112 158 Q115 180 120 192" fill="none" stroke="#7c3aed" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M130 155 Q140 175 145 185" fill="none" stroke="#7c3aed" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      {/* Top glow spot */}
      <ellipse cx="100" cy="70" rx="20" ry="10" fill="#c084fc" opacity="0.15" />
    </svg>
  );
}
