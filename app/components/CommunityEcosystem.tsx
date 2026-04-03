import { DiscordIcon, TwitterIcon, GitHubIcon } from "./icons";

const links = [
  {
    title: "Discord",
    description: "Join the community",
    href: "#",
    Icon: DiscordIcon,
    accent: "group-hover:border-neon-purple/40 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    iconColor: "text-neon-purple",
  },
  {
    title: "Twitter / X",
    description: "Follow for updates",
    href: "#",
    Icon: TwitterIcon,
    accent: "group-hover:border-neon-cyan/40 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]",
    iconColor: "text-neon-cyan",
  },
  {
    title: "GitHub",
    description: "View the source",
    href: "#",
    Icon: GitHubIcon,
    accent: "group-hover:border-neon-green/40 group-hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]",
    iconColor: "text-neon-green",
  },
  {
    title: "Docs",
    description: "Read the guides",
    href: "#",
    Icon: () => (
      <svg
        className="h-12 w-12 text-neon-pink"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M8 7h6" />
        <path d="M8 11h8" />
      </svg>
    ),
    accent: "group-hover:border-neon-pink/40 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]",
    iconColor: "text-neon-pink",
  },
];

export default function CommunityEcosystem() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Join the Arcade
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-text-secondary">
          Connect with thousands of players building the future of SocialFi
        </p>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-neon-green neon-glow-green" />
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
        {links.map(({ title, description, href, Icon, accent, iconColor }) => (
          <a
            key={title}
            href={href}
            className={`glass-card group p-6 text-center transition-all hover:scale-[1.02] ${accent}`}
          >
            <div
              className={`mx-auto ${iconColor} transition-transform group-hover:scale-110`}
            >
              <Icon className="mx-auto h-12 w-12" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
