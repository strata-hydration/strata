import BoostSection from '@/components/BoostSection';
import StandaloneRouteShell from '@/components/StandaloneRouteShell';

export default function BoostPage() {
  return (
    <StandaloneRouteShell
      spacerStyle={{
        background: 'linear-gradient(165deg, #8CC2EC 0%, #78B4E6 38%, #5A9FDC 100%)',
      }}
    >
      <BoostSection />
    </StandaloneRouteShell>
  );
}
