import FuelSection from '@/components/FuelSection';
import StandaloneRouteShell from '@/components/StandaloneRouteShell';

export default function FuelPage() {
  return (
    <StandaloneRouteShell
      spacerStyle={{
        background: 'linear-gradient(165deg, #8CC2EC 0%, #79B6E8 35%, #66A8E1 100%)',
      }}
    >
      <FuelSection />
    </StandaloneRouteShell>
  );
}
