const steps = [
  {
    number: "01",
    title: "Create Pool",
    description: "Set up a community token pool with custom parameters, target amount, and timeline.",
    accent: "neon-purple",
    icon: (
      <svg className="h-12 w-12 text-neon-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Gather Pledges",
    description: "Community members pledge tokens to your pool. Watch it grow in real-time.",
    accent: "neon-cyan",
    icon: (
      <svg className="h-12 w-12 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Launch Token",
    description: "Once the target is hit, your token auto-launches. No manual steps needed.",
    accent: "neon-pink",
    icon: (
      <svg className="h-12 w-12 text-neon-pink" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Earn Rewards",
    description: "Earn XP, climb the leaderboard, and collect fee shares from your pools.",
    accent: "neon-green",
    icon: (
      <svg className="h-12 w-12 text-neon-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const accentBorder: Record<string, string> = {
  "neon-purple": "hover:border-neon-purple/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
  "neon-cyan": "hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]",
  "neon-pink": "hover:border-neon-pink/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]",
  "neon-green": "hover:border-neon-green/50 hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]",
};

const accentRing: Record<string, string> = {
  "neon-purple": "border-neon-purple text-neon-purple",
  "neon-cyan": "border-neon-cyan text-neon-cyan",
  "neon-pink": "border-neon-pink text-neon-pink",
  "neon-green": "border-neon-green text-neon-green",
};

export default function HowItWorks() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">How It Works</h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-neon-purple neon-glow-purple" />
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-4 md:gap-4">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-center md:flex-col md:items-stretch">
            <div className={`glass-card p-6 text-center transition-all ${accentBorder[step.accent]}`}>
              <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 font-mono text-sm ${accentRing[step.accent]}`}>
                {step.number}
              </div>
              <div className="mt-4 flex justify-center">{step.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.description}</p>
            </div>
            {/* Arrow connector (between cards, desktop only) */}
            {i < steps.length - 1 && (
              <svg className="mx-2 hidden h-6 w-6 flex-shrink-0 text-text-dim md:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
