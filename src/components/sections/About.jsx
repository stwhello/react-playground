import { useRef } from 'react';
import { motion } from 'motion/react';
import Threads from '../ui/Threads';
import VariableProximity from '../ui/VariableProximity';
import GlareHover from '../ui/GlareHover';
import DecryptedText from '../ui/DecryptedText';

const STATS = [
  { value: '3+',  label: 'Years exp',        glare: '#C8FF4D', border: 'rgba(200,255,77,0.2)'  },
  { value: '20+', label: 'Projects shipped', glare: '#FF5470', border: 'rgba(255,84,112,0.2)'  },
  { value: '∞',   label: 'Cups of Coffee',  glare: '#7C83FD', border: 'rgba(124,131,253,0.2)' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function About() {
  const containerRef = useRef(null);

  return (
    <section id="about" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '6rem' }}>

      {/* Threads bg */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.35 }}>
        <Threads color={[0.47, 0.51, 0.99]} amplitude={1.5} distance={0.3} enableMouseInteraction={true} />
      </div>

      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '120px',
        background: 'linear-gradient(to bottom, var(--bg), transparent)',
        zIndex: 1, pointerEvents: 'none'
      }} />

      <div className="section" ref={containerRef} style={{ position: 'relative', zIndex: 2 }}>

        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          #about
        </motion.span>

        {/* VariableProximity headline */}
        <div style={{ margin: 'var(--space-3) 0 var(--space-4)', cursor: 'default' }}>
          <VariableProximity
            label="I build things that move."
            containerRef={containerRef}
            fromFontVariationSettings="'wght' 200, 'opsz' 8"
            toFontVariationSettings="'wght' 900, 'opsz' 40"
            radius={180}
            falloff="gaussian"
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
            }}
          />
        </div>

        {/* Bio */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ maxWidth: '65ch', marginBottom: 'var(--space-5)' }}
        >
          <p style={{ marginBottom: '1rem' }}>
            Senior Full Stack Developer based in Pune, India — with a Master's in CS
            and a habit of turning interfaces into experiences. I specialise in React,
            dynamic backends, and lately anything that involves shaders, WebGL, or
            physics-based motion.
          </p>
          <p>
            When I'm not pushing pixels, I'm sculpting clay, sketching, or deep in an
            anime rabbit hole. This playground is where both sides of my brain collide.
          </p>
        </motion.div>

        {/* GlareHover stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}
        >
          {STATS.map((stat, i) => (
            <div key={i} style={{ flex: '1 1 180px' }}>
              <GlareHover
                width="100%"
                height="160px"
                background="#131318"
                borderRadius="16px"
                borderColor={stat.border}
                glareColor={stat.glare}
                glareOpacity={0.25}
                glareAngle={-30}
                glareSize={280}
                transitionDuration={700}
              >
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    color: stat.glare,
                    lineHeight: 1,
                    marginBottom: '0.4rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-dim)',
                    letterSpacing: '0.05em'
                  }}>
                    {stat.label}
                  </div>
                </div>
              </GlareHover>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ color: 'var(--lime)' }}>→</span>
          <DecryptedText
            text="currently obsessed with WebGL shaders & motion design."
            animateOn="hover"
            sequential={true}
            revealDirection="start"
            speed={25}
            maxIterations={15}
            className="decrypted-revealed"
            encryptedClassName="decrypted-encrypted"
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&"
          />
        </motion.div>

      </div>
    </section>
  );
}