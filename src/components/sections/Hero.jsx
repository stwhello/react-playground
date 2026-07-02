import Aurora from '../ui/Aurora';
import BlurText from '../ui/BlurText';
import ShinyText from '../ui/ShinyText';

export default function Hero() {
  return (
    <section id="hero" style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Aurora
          colorStops={['#C8FF4D', '#7C83FD', '#FF5470']}
          blend={0.4} amplitude={1.2} speed={0.4}
        />
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
        background: 'linear-gradient(to bottom, transparent, var(--bg))', zIndex: 1
      }} />
      <div className="section" style={{ position: 'relative', zIndex: 2 }}>
        <span className="eyebrow">#hero</span>
        <div style={{ marginTop: 'var(--space-2)' }}>
          <BlurText text="Hey, I'm Sherin —" delay={120} animateBy="words" direction="top" stepDuration={0.5} className="hero-line" />
          <BlurText text="this is my playground." delay={120} animateBy="words" direction="top" stepDuration={0.5} className="hero-line hero-line--accent" />
        </div>
        <p style={{ marginTop: 'var(--space-3)', fontSize: '1.1rem' }}>
          <ShinyText
            text="→ Senior Dev · Animation enthusiast · Breaking things on purpose."
            color="var(--text-dim)" shineColor="var(--lime)" speed={3} spread={100}
          />
        </p>
        <a href="#about" className="btn" style={{ marginTop: 'var(--space-4)', display: 'inline-block' }}>
          Explore ↓
        </a>
      </div>
    </section>
  );
}