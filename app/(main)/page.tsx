import HeroSection from "@/app/components/HeroSection";
import StatsBar from "@/app/components/StatsBar";
import HowItWorks from "@/app/components/HowItWorks";
import CreatureShowcase from "@/app/components/CreatureShowcase";
import HotPools from "@/app/components/HotPools";
import LeaderboardPreview from "@/app/components/LeaderboardPreview";
import CommunityEcosystem from "@/app/components/CommunityEcosystem";
import BagsPowered from "@/app/components/BagsPowered";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <HotPools />
      <BagsPowered />
      <CreatureShowcase />
      <LeaderboardPreview />
      <CommunityEcosystem />
    </>
  );
}
