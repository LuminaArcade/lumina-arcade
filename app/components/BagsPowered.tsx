import Link from "next/link";

const features = [
  {
    title: "Token Launching",
    description: "When your pool reaches its target, tokens are automatically launched on Bags.fm via Meteora DBC.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      </svg>
    ),
    color: "text-neon-purple",
    glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
  },
  {
    title: "Fee Sharing",
    description: "Creators earn 1% of all trading volume forever. Configure custom splits for your community.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    color: "text-neon-green",
    glow: "group-hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]",
  },
  {
    title: "Instant Trading",
    description: "Swap any Bags.fm token directly through Lumina Arcade. Powered by Meteora liquidity pools.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
      </svg>
    ),
    color: "text-neon-cyan",
    glow: "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]",
  },
];

export default function BagsPowered() {
  return (
    <section className="px-4 py-20 md:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-neon-purple/5 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-4 py-1.5 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-neon-purple">
              Powered by Bags.fm
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Real Token Launches on Solana
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-text-secondary">
            Every pool on Lumina Arcade connects to the Bags.fm launchpad. Real tokens, real trading, real revenue sharing.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-neon-purple neon-glow-purple" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`glass-card group p-6 transition-all hover:border-white/10 ${feature.glow}`}
            >
              <div className={`${feature.color} mb-4`}>{feature.icon}</div>
              <h3 className="text-lg font-bold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/trade"
            className="rounded-lg bg-gradient-to-r from-neon-purple to-neon-cyan px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            Start Trading
          </Link>
          <Link
            href="/fees"
            className="rounded-lg border border-neon-green/40 px-8 py-3 text-sm font-semibold text-neon-green transition-all hover:bg-neon-green/10"
          >
            Claim Fees
          </Link>
        </div>
      </div>
    </section>
  );
}
