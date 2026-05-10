import SipSection from '@/components/SipSection';
import StandaloneRouteShell from '@/components/StandaloneRouteShell';

export default function SipPage() {
  return (
    <StandaloneRouteShell
      spacerStyle={{
        background: 'linear-gradient(165deg, #6EE7B7 0%, #5EDDAA 36%, #4CD39C 100%)',
      }}
    >
      <SipSection />
    </StandaloneRouteShell>
  );
}
