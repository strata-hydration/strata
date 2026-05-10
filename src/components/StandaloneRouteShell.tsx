export default function StandaloneRouteShell({
  children,
  spacerStyle,
}: {
  children: React.ReactNode;
  spacerStyle?: React.CSSProperties;
}) {
  return (
    <div className="relative z-10 -mb-px">
      {children}
      <div aria-hidden="true" className="relative h-10 sm:h-14 lg:h-20" style={spacerStyle}>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 sm:h-14 lg:h-20"
          style={{
            background: 'linear-gradient(180deg, rgba(0,62,138,0) 0%, #003E8A 100%)',
          }}
        />
      </div>
    </div>
  );
}