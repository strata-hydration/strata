import VoicesSection from '@/components/VoicesSection';
import StandaloneRouteShell from '@/components/StandaloneRouteShell';

export default function VoicesPage() {
  return (
    <StandaloneRouteShell
      spacerStyle={{
        background: 'linear-gradient(165deg, #FFD7A8 0%, #FFCB90 36%, #FFBF78 100%)',
      }}
    >
      <VoicesSection />
    </StandaloneRouteShell>
  );
}
