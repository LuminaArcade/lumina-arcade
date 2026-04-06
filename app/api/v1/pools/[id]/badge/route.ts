import { NextRequest } from "next/server";
import { generateSeedData } from "@/lib/seed";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const SVG_HEADERS = {
  "Content-Type": "image/svg+xml",
  "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
  ...CORS_HEADERS,
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function notFoundSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
  <rect width="400" height="120" rx="12" fill="#0a0a0f" stroke="#333" stroke-width="1"/>
  <text x="200" y="55" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="600" fill="#ef4444">Pool Not Found</text>
  <text x="200" y="80" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#666">The requested pool does not exist</text>
  <text x="200" y="108" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#444">Lumina Arcade</text>
</svg>`;
}

function statusColor(status: string): string {
  switch (status) {
    case "active": return "#22c55e";
    case "launched": return "#a855f7";
    case "expired": return "#ef4444";
    default: return "#666";
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case "active": return "ACTIVE";
    case "launched": return "LAUNCHED";
    case "expired": return "EXPIRED";
    default: return status.toUpperCase();
  }
}

function formatSol(val: number): string {
  return val % 1 === 0 ? val.toString() : val.toFixed(1);
}

function buildFullBadge(pool: {
  name: string;
  ticker: string;
  targetSol: number;
  raisedSol: number;
  participants: string[];
  status: string;
  expiresAt: number;
}): string {
  const percentage = Math.min(100, Math.round((pool.raisedSol / pool.targetSol) * 100));
  const participantCount = pool.participants.length;
  const sColor = statusColor(pool.status);
  const sLabel = statusLabel(pool.status);
  const isEndingSoon = pool.status === "active" && (pool.expiresAt - Date.now()) < 86400000;

  const progressBarWidth = Math.max(2, (percentage / 100) * 240);

  // Gradient for progress bar: purple to cyan
  const gradientId = "prog";

  const pulseAnim = isEndingSoon
    ? `<animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>`
    : "";

  const endingSoonIndicator = isEndingSoon
    ? `<g>
        <circle cx="375" cy="18" r="4" fill="#ec4899">${pulseAnim}</circle>
        <text x="367" y="22" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#ec4899">ENDING SOON</text>
      </g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
    <clipPath id="barClip">
      <rect x="24" y="62" width="240" height="14" rx="7"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="400" height="120" rx="12" fill="#0a0a0f" stroke="#1e1e2e" stroke-width="1"/>

  <!-- Status badge -->
  <rect x="24" y="12" rx="4" width="${sLabel.length * 7.5 + 12}" height="18" fill="${sColor}" opacity="0.15"/>
  <text x="30" y="25" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" fill="${sColor}" letter-spacing="0.5">${sLabel}</text>

  ${endingSoonIndicator}

  <!-- Pool name and ticker -->
  <text x="24" y="52" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#e2e8f0">${escapeXml(pool.name)}</text>
  <text x="${28 + pool.name.length * 10}" y="52" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#a855f7" font-weight="500">$${escapeXml(pool.ticker)}</text>

  <!-- Progress bar background -->
  <rect x="24" y="62" width="240" height="14" rx="7" fill="#1e1e2e"/>

  <!-- Progress bar fill -->
  <g clip-path="url(#barClip)">
    <rect x="24" y="62" width="${progressBarWidth}" height="14" fill="url(#${gradientId})"/>
  </g>

  <!-- Percentage on bar -->
  <text x="144" y="73" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="9" font-weight="700" fill="#fff">${percentage}%</text>

  <!-- Raised / Target -->
  <text x="24" y="92" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#94a3b8">
    <tspan fill="#22d3ee" font-weight="600">${formatSol(pool.raisedSol)}</tspan>
    <tspan fill="#64748b"> / ${formatSol(pool.targetSol)} SOL</tspan>
  </text>

  <!-- Participants -->
  <text x="270" y="73" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94a3b8">
    <tspan fill="#ec4899" font-weight="600">${participantCount}</tspan>
    <tspan> participant${participantCount !== 1 ? "s" : ""}</tspan>
  </text>

  <!-- Branding -->
  <text x="24" y="110" font-family="system-ui, -apple-system, sans-serif" font-size="9" fill="#4a4a5a" font-weight="500">Lumina Arcade</text>
  <text x="376" y="110" text-anchor="end" font-family="system-ui, -apple-system, sans-serif" font-size="8" fill="#3a3a4a">Powered by Bags.fm</text>
</svg>`;
}

function buildFlatBadge(pool: {
  name: string;
  ticker: string;
  targetSol: number;
  raisedSol: number;
  participants: string[];
  status: string;
  expiresAt: number;
}): string {
  const percentage = Math.min(100, Math.round((pool.raisedSol / pool.targetSol) * 100));
  const sColor = statusColor(pool.status);
  const sLabel = statusLabel(pool.status);
  const labelWidth = 120;
  const valueWidth = 180;
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" viewBox="0 0 ${totalWidth} 20">
  <rect width="${labelWidth}" height="20" fill="#0a0a0f"/>
  <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="#1e1e2e"/>
  <rect width="${totalWidth}" height="20" rx="3" fill="transparent" stroke="#333" stroke-width="0.5"/>

  <!-- Status dot -->
  <circle cx="10" cy="10" r="3.5" fill="${sColor}"/>

  <!-- Pool name -->
  <text x="20" y="14" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#e2e8f0" font-weight="600">${escapeXml(pool.name)}</text>

  <!-- Value section -->
  <text x="${labelWidth + 8}" y="14" font-family="system-ui, -apple-system, sans-serif" font-size="11" fill="#94a3b8">
    <tspan fill="#22d3ee" font-weight="600">${formatSol(pool.raisedSol)}</tspan>
    <tspan fill="#64748b">/${formatSol(pool.targetSol)} SOL</tspan>
    <tspan fill="#a855f7" font-weight="600"> ${percentage}%</tspan>
    <tspan fill="#64748b"> ${sLabel}</tspan>
  </text>
</svg>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { pools } = generateSeedData();
  const pool = pools.find((p) => p.id === id);

  if (!pool) {
    return new Response(notFoundSvg(), { status: 404, headers: SVG_HEADERS });
  }

  const style = req.nextUrl.searchParams.get("style");
  const svg = style === "flat" ? buildFlatBadge(pool) : buildFullBadge(pool);

  return new Response(svg, { headers: SVG_HEADERS });
}
