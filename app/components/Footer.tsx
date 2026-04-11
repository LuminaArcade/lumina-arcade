import Link from "next/link";
import { DiscordIcon, TwitterIcon, GitHubIcon } from "./icons";

const platformLinks = [
  { label: "Pools", href: "/pools" },
  { label: "Trade", href: "/trade" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Characters", href: "/characters" },
  { label: "Fees", href: "/fees" },
  { label: "Analytics", href: "/analytics" },
];

const resourceLinks = [
  { label: "Documentation", href: "https://docs.bags.fm", external: true },
  { label: "GitHub", href: "https://github.com/LuminaArcade", external: true },
  { label: "Blog", href: "https://twitter.com/LuminaArcade", external: true },
  { label: "FAQ", href: "/pools" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Contact", href: "https://twitter.com/LuminaArcade", external: true },
];

const socials = [
  { icon: DiscordIcon, href: "https://discord.gg/luminaarcade", label: "Discord" },
  { icon: TwitterIcon, href: "https://twitter.com/LuminaArcade", label: "Twitter" },
  { icon: GitHubIcon, href: "https://github.com/LuminaArcade", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-bg-secondary/50 px-4 pb-8 pt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
        <div>
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-bold text-neon-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              LUMINA
            </span>
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-text-secondary">
              ARCADE
            </span>
          </Link>
          <p className="mt-3 text-sm text-text-secondary">
            The ultimate gamified SocialFi arcade built on Bags.fm.
          </p>
          <div className="mt-4 flex gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-text-secondary transition-colors hover:text-neon-cyan focus-visible:text-neon-cyan focus-visible:outline-none"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Platform
          </h3>
          {platformLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block py-1 text-sm text-text-secondary transition-colors hover:text-neon-cyan focus-visible:text-neon-cyan focus-visible:outline-none"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Resources
          </h3>
          {resourceLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 py-1 text-sm text-text-secondary transition-colors hover:text-neon-cyan focus-visible:text-neon-cyan focus-visible:outline-none"
              >
                {link.label}
                <svg className="h-3 w-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="block py-1 text-sm text-text-secondary transition-colors hover:text-neon-cyan focus-visible:text-neon-cyan focus-visible:outline-none"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Legal
          </h3>
          {legalLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-1 text-sm text-text-secondary transition-colors hover:text-neon-cyan focus-visible:text-neon-cyan focus-visible:outline-none"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="block py-1 text-sm text-text-secondary transition-colors hover:text-neon-cyan focus-visible:text-neon-cyan focus-visible:outline-none"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between border-t border-white/5 pt-8 text-xs text-text-dim md:flex-row">
        <p>&copy; {new Date().getFullYear()} Lumina Arcade. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Built on Bags.fm</p>
      </div>
    </footer>
  );
}
