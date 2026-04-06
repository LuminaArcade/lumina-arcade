import type { Metadata } from "next";
import { isSupabaseConfigured } from "@/lib/supabase";
import { fetchPools } from "@/lib/supabase-data";
import { generateSeedData } from "@/lib/seed";

const SITE_URL = "https://luminaarcade.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  let pools;
  if (isSupabaseConfigured()) {
    pools = await fetchPools() ?? [];
  } else {
    pools = generateSeedData().pools;
  }
  const pool = pools.find((p) => p.id === id);

  if (!pool) {
    return {
      title: "Pool Not Found | Lumina Arcade",
    };
  }

  const percentage = Math.min(
    100,
    Math.round((pool.raisedSol / pool.targetSol) * 100)
  );

  const title = `${pool.name} ($${pool.ticker}) | Lumina Arcade`;
  const description = `${percentage}% funded - ${pool.raisedSol.toFixed(1)}/${pool.targetSol} SOL raised by ${pool.participants.length} participants. ${pool.description}`;
  const ogImageUrl = `${SITE_URL}/api/og/pool/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/pools/${id}`,
      siteName: "Lumina Arcade",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${pool.name} pool on Lumina Arcade`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function PoolDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
