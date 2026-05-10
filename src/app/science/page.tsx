import ScienceSection from '@/components/ScienceSection';
import StandaloneRouteShell from '@/components/StandaloneRouteShell';

export default function SciencePage() {
  return (
    <StandaloneRouteShell
      spacerStyle={{
        background: 'linear-gradient(165deg, #FFD0DC 0%, #FFC0D2 36%, #FFB1C8 100%)',
      }}
    >
      <ScienceSection />
    </StandaloneRouteShell>
  );
}
