import HeroSection from '@/components/HeroSection';
import FuelSection from '@/components/FuelSection';
import BoostSection from '@/components/BoostSection';
import ScienceSection from '@/components/ScienceSection';
import SipSection from '@/components/SipSection';
import VoicesSection from '@/components/VoicesSection';
import RefuelSection from '@/components/RefuelSection';

export default function Home() {
  return (
    <div className="relative z-10 flex flex-col gap-3 sm:gap-4 lg:gap-5">
      <HeroSection />
      <FuelSection />
      <BoostSection />
      <ScienceSection />
      <div className="mb-8 sm:mb-10 lg:mb-14">
        <SipSection />
      </div>
      <VoicesSection />
      <div className="mb-10 sm:mb-12 lg:mb-16">
        <RefuelSection />
      </div>
    </div>
  );
}
