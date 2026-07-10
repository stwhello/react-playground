import { motion } from 'motion/react';
import MetaBalls from '../ui/MetaBalls';
import ClickSpark from '../ui/ClickSpark';
import Magnet from '../ui/Magnet';

const LINKS = [
  { label: 'Email me',  href: 'mailto:sherin@example.com', primary: true,  arrow: '↗' },
  { label: 'GitHub',    href: 'https://github.com',         primary: false, arrow: '↗' },
  { label: 'LinkedIn',  href: 'https://linkedin.com',       primary: false, arrow: '↗' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Contact() {
  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* MetaBalls layer 1 — lime + coral cursor */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <MetaBalls
          color="#C8FF4D"
          cursorBallColor="#FF5470"
          cursorBallSize={3.5}
          ballCount={10}
          animationSize={38}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.06}
          clumpFactor={0.85}
          speed={0.22}
        />
      </div>

      {/* MetaBalls layer 2 — periwinkle, subtler */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.55 }}>
        <MetaBalls
          color="#7C83FD"
          cursorBallColor="#7C83FD"
          cursorBallSize={1}
          ballCount={7}
          animationSize={42}
          enableMouseInteraction={false}
          enableTransparency={true}
          hoverSmoothness={0.03}
          clumpFactor={1.2}
          speed={0.14}
        />
      </div>

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'rgba(11,11,16,0.78)',
      }} />

      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '140px',
        background: 'linear-gradient(to bottom, var(--bg), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* ClickSpark wraps everything */}
      <div style={{ position: 'relative', zIndex: 3, width: '100%' }}>
        <ClickSpark
          sparkColor="#C8FF4D"
          sparkSize={14}
          sparkRadius={55}
          sparkCount={12}
          duration={600}
          extraScale={1.2}
        >
          <div className="section" style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-6)' }}>

            {/* Available badge */}
            <motion.div
              {...fadeUp(0)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: 'var(--space-3)' }}
            >
              <motion.span
                style={{
                  display: 'inline-block', width: 9, height: 9,
                  borderRadius: '50%', background: '#4ADE80', flexShrink: 0,
                }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
                color: 'var(--text-dim)', letterSpacing: '0.04em',
              }}>
                Available for freelance & full-time
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div {...fadeUp(0.1)} style={{ marginBottom: 'var(--space-3)' }}>
              <h2 style={{
                fontSize: 'clamp(3rem, 8.5vw, 7rem)',
                lineHeight: 0.93,
                letterSpacing: '-0.03em',
                margin: 0,
                color: 'var(--text)',
              }}>
                Let's make
                <br />
                <span style={{
                  color: 'transparent',
                  WebkitTextStroke: '2px var(--lime)',
                  display: 'inline-block',
                }}>
                  something
                </span>
                <br />
                that moves.
              </h2>
            </motion.div>

            {/* Subtext */}
            <motion.p {...fadeUp(0.2)} style={{ maxWidth: '50ch', marginBottom: 'var(--space-4)' }}>
              Senior Dev based in Pune. I take on projects that push the web
              forward — complex UIs, creative experiments, and anything that
              benefits from obsessive attention to motion.
            </motion.p>

            {/* Contact links */}
            <motion.div
              {...fadeUp(0.3)}
              style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}
            >
              {LINKS.map(link => (
              <Magnet
  key={link.label}
  padding={55}
  magnetStrength={3.5}
  activeTransition="transform 0.25s ease-out"
  inactiveTransition="transform 0.5s ease-in-out"
>
  <a
    href={link.href}
    target={link.href.startsWith('mailto') ? undefined : '_blank'}
    rel="noopener noreferrer"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4em',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(1rem, 2vw, 1.2rem)',
      letterSpacing: '-0.01em',
      padding: '0.85em 2.2em',
      borderRadius: '999px',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition:
        'background 0.25s, color 0.25s, border-color 0.25s, box-shadow 0.25s',
      ...(link.primary
        ? {
            background: 'var(--lime)',
            color: 'var(--bg)',
            border: '2px solid var(--lime)',
            boxShadow: '0 0 40px rgba(200,255,77,0.3)',
          }
        : {
            background: 'rgba(13,13,18,0.7)',
            color: 'var(--text)',
            border: '2px solid rgba(244,242,237,0.15)',
            backdropFilter: 'blur(10px)',
          }),
    }}
    onMouseEnter={(e) => {
      if (!link.primary) {
        e.currentTarget.style.borderColor = 'var(--lime)';
        e.currentTarget.style.color = 'var(--lime)';
      }
    }}
    onMouseLeave={(e) => {
      if (!link.primary) {
        e.currentTarget.style.borderColor =
          'rgba(244,242,237,0.15)';
        e.currentTarget.style.color = 'var(--text)';
      }
    }}
  >
    {link.label}
    <span style={{ fontSize: '0.9em', opacity: 0.7 }}>
      {link.arrow}
    </span>
  </a>
</Magnet>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.p
              {...fadeUp(0.45)}
              style={{
                marginTop: 'var(--space-6)',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-dim)',
                opacity: 0.45,
                maxWidth: 'none',
              }}
            >
              Built in Pune · React · React Bits · Framer Motion · GSAP · Three.js · OGL
              <br />
              Powered by too much chai and not enough sleep.
            </motion.p>

          </div>
        </ClickSpark>
      </div>
    </section>
  );
}