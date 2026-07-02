import BubbleMenu from './BubbleMenu';

const Logo = () => (
  <span style={{
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.1rem',
    color: 'var(--lime)',
    letterSpacing: '-0.02em'
  }}>
    S.
  </span>
);

export default function Navbar() {
  return (
    <BubbleMenu
      logo={<Logo />}
      menuBg="#131318"
      menuContentColor="#C8FF4D"
      useFixedPosition={true}
      animationEase="back.out(1.5)"
      animationDuration={0.45}
      staggerDelay={0.1}
    />
  );
}