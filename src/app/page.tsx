import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import TechnologySection from "@/components/TechnologySection";
import PlatformOverview from "@/components/PlatformOverview";
import ProductsSection from "@/components/ProductsSection";
import TeamSection from "@/components/TeamSection";
import InvestorCTA from "@/components/InvestorCTA";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MissionSection />
        <TechnologySection />
        <PlatformOverview />
        <ProductsSection />
        <TeamSection />
        <InvestorCTA />
        <TrustBadges />
      </main>
      <Footer />
    </>
  );
}
