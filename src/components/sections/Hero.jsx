import { motion } from 'motion/react';
import Aurora from '../ui/Aurora';
import BlurText from '../ui/BlurText';
import ShinyText from '../ui/ShinyText';

const TAGS = [
  { label: 'React',         color: 'var(--periwinkle)', delay: 0    },
  { label: 'GSAP',          color: 'var(--lime)',        delay: 0.15 },
  { label: 'Three.js',      color: 'var(--coral)',       delay: 0.3  },
  { label: 'Framer Motion', color: 'var(--lime)',        delay: 0.45 },
  { label: 'TypeScript',    color: 'var(--periwinkle)', delay: 0.6  },
  { label: 'Node.js',       color: 'var(--coral)',       delay: 0.75 },
  { label: 'Vite',          color: 'var(--lime)',        delay: 0.9  },
  { label: 'WebGL',         color: 'var(--periwinkle)', delay: 1.05 },
];

const floatVariants = {
  animate: (delay) => ({
    y: [0, -10, 0],
    transition: {
      duration: 3,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }),
};

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Aurora
          colorStops={['#C8FF4D', '#7C83FD', '#FF5470']}
          blend={0.4}
          amplitude={1.2}
          speed={0.4}
        />
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
        background: 'linear-gradient(to bottom, transparent, var(--bg))',
        zIndex: 1,
      }} />

      <div className="section" style={{ position: 'relative', zIndex: 2 }}>
        <span className="eyebrow">#hero</span>

        <div style={{ marginTop: 'var(--space-2)' }}>
          <BlurText
            text="Hey, I'm Sherin —"
            delay={120}
            animateBy="words"
            direction="top"
            stepDuration={0.5}
            className="hero-line"
          />
          <BlurText
            text="this is my playground."
            delay={120}
            animateBy="words"
            direction="top"
            stepDuration={0.5}
            className="hero-line hero-line--accent"
          />
        </div>

        <p style={{ marginTop: 'var(--space-3)', fontSize: '1.1rem' }}>
          <ShinyText
            text="→ Senior Dev · Animation enthusiast · Breaking things on purpose."
            color="var(--text-dim)"
            shineColor="var(--lime)"
            speed={3}
            spread={100}
          />
        </p>

        <a
          href="#about"
          className="btn"
          style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}
        >
          Explore ↓
        </a>

        <div style={{
          marginTop: 'var(--space-5)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          maxWidth: '560px',
        }}>
          {TAGS.map((tag) => (
            <motion.span
              key={tag.label}
              custom={tag.delay}
              variants={floatVariants}
              animate="animate"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: tag.delay + 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.1, transition: { type: 'spring', stiffness: 400 } }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                padding: '0.4em 1em',
                borderRadius: '999px',
                border: `1px solid ${tag.color}40`,
                background: `${tag.color}12`,
                color: tag.color,
                cursor: 'default',
                userSelect: 'none',
                letterSpacing: '0.02em',
              }}
            >
              {tag.label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}