"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from "./WalletButton";

const navLinks = [
  { label: "Pools", href: "/pools" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Characters", href: "/characters" },
  { label: "Docs", href: "#" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-bg-primary/90 backdrop-blur-lg border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="font-mono text-xl font-bold text-neon-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              LUMINA
            </span>
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-text-secondary">
              ARCADE
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-neon-cyan"
                    : "text-text-secondary hover:text-neon-cyan"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <WalletButton />
          </div>

          <button
            className="flex flex-col gap-1.5 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`h-0.5 w-6 bg-text-primary transition-all ${
                isMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-text-primary transition-all ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-text-primary transition-all ${
                isMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isMenuOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/5 bg-bg-secondary/95 backdrop-blur-lg px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`block py-3 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-neon-cyan"
                  : "text-text-secondary hover:text-neon-cyan"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <WalletButton className="mt-3 w-full justify-center" />
        </div>
      </div>
    </nav>
  );
}
