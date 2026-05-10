import RefuelSection from '@/components/RefuelSection';
import StandaloneRouteShell from '@/components/StandaloneRouteShell';

export default function RefuelPage() {
  return (
    <StandaloneRouteShell
      spacerStyle={{
        background: 'linear-gradient(135deg, #A8CBFF 0%, #97BFFF 35%, #84B2FF 100%)',
      }}
    >
      <RefuelSection />
    </StandaloneRouteShell>
  );
}
