import { motion } from 'motion/react';
import DotGrid from '../ui/DotGrid';
import FlowingMenu from '../ui/FlowingMenu';

const pill = (hex) => {
  const c = hex.replace('#', '%23');
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='64'><rect width='180' height='64' rx='32' fill='${c}'/></svg>`;
};

const ITEMS = [
  {
    link: '#',
    text: 'Frontend',
    image: pill('#0B0B10'),
    marqueeBgColor: '#C8FF4D',
    marqueeTextColor: '#0B0B10',
  },
  {
    link: '#',
    text: 'Backend',
    image: pill('#F4F2ED'),
    marqueeBgColor: '#FF5470',
    marqueeTextColor: '#F4F2ED',
  },
  {
    link: '#',
    text: 'Tooling',
    image: pill('#F4F2ED'),
    marqueeBgColor: '#7C83FD',
    marqueeTextColor: '#F4F2ED',
  },
  {
    link: '#',
    text: 'Learning',
    image: pill('#0B0B10'),
    marqueeBgColor: '#C8FF4D',
    marqueeTextColor: '#0B0B10',
  },
];

export default function Stack() {
  return (
    <section
      id="stack"
      style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      {/* DotGrid background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <DotGrid
          dotSize={5}
          gap={22}
          baseColor="#1C1C28"
          activeColor="#C8FF4D"
          proximity={110}
          shockRadius={180}
          shockStrength={6}
          returnDuration={1.4}
        />
      </div>

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'rgba(11,11,16,0.55)',
        pointerEvents: 'none',
      }} />

      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to bottom, var(--bg), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px',
        background: 'linear-gradient(to top, var(--bg), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: 'var(--space-5) var(--space-4) var(--space-3)',
            maxWidth: '1100px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <span className="eyebrow">#stack</span>
          <h2 style={{ marginTop: 'var(--space-1)', marginBottom: 0 }}>
            My toolkit.
          </h2>
        </motion.div>

        {/* FlowingMenu fills remaining height */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <FlowingMenu
            items={ITEMS}
            bgColor="transparent"
            textColor="#F4F2ED"
            borderColor="rgba(244,242,237,0.08)"
            speed={14}
          />
        </div>
      </div>
    </section>
  );
}