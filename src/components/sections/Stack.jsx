import { motion } from 'motion/react';
import Ballpit from '../ui/Ballpit';

const CARDS = [
  {
    symbol: '</>',
    category: 'Frontend',
    accent: '#C8FF4D',
    rgb: '200,255,77',
    desc: 'Building interfaces that feel alive — from pixel to physics.',
    techs: ['React', 'Vite', 'GSAP', 'Framer Motion', 'Three.js', 'OGL', 'SCSS'],
  },
  {
    symbol: '{ }',
    category: 'Backend',
    accent: '#FF5470',
    rgb: '255,84,112',
    desc: 'APIs, databases, and the logic no one sees but everyone feels.',
    techs: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Supabase', 'PostgreSQL'],
  },
  {
    symbol: '[ ]',
    category: 'Tooling',
    accent: '#7C83FD',
    rgb: '124,131,253',
    desc: 'The environment that keeps me fast and sane.',
    techs: ['TypeScript', 'Git', 'GitHub', 'Figma', 'Vercel', 'VS Code'],
  },
  {
    symbol: '~/',
    category: 'Learning',
    accent: '#C8FF4D',
    rgb: '200,255,77',
    desc: "Rabbit holes I'm actively falling into and loving every second.",
    techs: ['WebGL', 'GLSL Shaders', 'Python', 'GenAI Engineering', 'LangChain'],
  },
];

export default function Stack() {
  return (
    <section id="stack" style={{ position: 'relative', minHeight: '100vh' }}>}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Ballpit
          count={80}
          gravity={0.5}
          friction={0.9975}
          wallBounce={0.95}
          followCursor={true}
          colors={['#C8FF4D', '#7C83FD', '#FF5470', '#C8FF4D']}
          minSize={0.3}
          maxSize={0.8}
          lightIntensity={160}
        />
      </div>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'rgba(11,11,16,0.82)',
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to bottom, var(--bg), transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div className="section" style={{ position: 'relative', zIndex: 3 }}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">#stack</span>
          <h2 style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            My toolkit.
          </h2>
          <p style={{ marginBottom: 0 }}>
            Four categories. Every layer I work with — and a few I'm actively breaking into.
          </p>
        </motion.div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.25rem',
          marginTop: 'var(--space-4)',
        }}>
          {CARDS.map((card, i) => (
            <motion.div
              key={card.category}
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
              style={{
                background: 'rgba(13,13,18,0.92)',
                border: `1px solid rgba(${card.rgb},0.1)`,
                borderTop: `2px solid ${card.accent}`,
                borderRadius: '16px',
                padding: '1.75rem',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                cursor: 'default',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <h3 style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: card.accent,
                  letterSpacing: '-0.01em',
                }}>
                  {card.category}
                </h3>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem',
                  color: card.accent,
                  opacity: 0.22,
                  lineHeight: 1,
                  marginTop: '2px',
                }}>
                  {card.symbol}
                </span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: 'var(--text-dim)',
                lineHeight: 1.6,
              }}>
                {card.desc}
              </p>
              <div style={{ height: '1px', background: `rgba(${card.rgb},0.1)` }} />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {card.techs.map((tech) => (
                  <span key={tech} style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    padding: '0.28em 0.8em',
                    borderRadius: '999px',
                    background: `rgba(${card.rgb},0.08)`,
                    border: `1px solid rgba(${card.rgb},0.22)`,
                    color: card.accent,
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}