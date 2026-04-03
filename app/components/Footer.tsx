import Link from "next/link";
import { DiscordIcon, TwitterIcon, GitHubIcon } from "./icons";

const platformLinks = [
  { label: "Pools", href: "/pools" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Characters", href: "/characters" },
];

const resourceLinks = [
  { label: "Documentation", href: "#" },
  { label: "API", href: "#" },
  { label: "Blog", href: "#" },
  { label: "FAQ", href: "#" },
];

const legalLinks = [
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Contact", href: "#" },
];

const socials = [
  { icon: DiscordIcon, href: "#", label: "Discord" },
  { icon: TwitterIcon, href: "#", label: "Twitter" },
  { icon: GitHubIcon, href: "#", label: "GitHub" },
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
                aria-label={label}
                className="text-text-secondary transition-colors hover:text-neon-cyan"
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
              className="block py-1 text-sm text-text-secondary transition-colors hover:text-neon-cyan"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Resources
          </h3>
          {resourceLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block py-1 text-sm text-text-secondary transition-colors hover:text-neon-cyan"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Legal
          </h3>
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block py-1 text-sm text-text-secondary transition-colors hover:text-neon-cyan"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between border-t border-white/5 pt-8 text-xs text-text-dim md:flex-row">
        <p>&copy; 2026 Lumina Arcade. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Built on Bags.fm</p>
      </div>
    </footer>
  );
}
