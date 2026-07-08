import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './FlowingMenu.css';

function FlowingMenu({
  items = [], speed = 15,
  textColor = '#fff', bgColor = '#120F17',
  marqueeBgColor = '#fff', marqueeTextColor = '#120F17',
  borderColor = '#fff'
}) {
  return (
    <div className="menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="menu">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={item.marqueeBgColor || marqueeBgColor}
            marqueeTextColor={item.marqueeTextColor || marqueeTextColor}
            borderColor={borderColor}
          />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, image, speed, textColor, marqueeBgColor, marqueeTextColor, borderColor }) {
  const itemRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);
  const animationRef = useRef(null);
  const [repetitions, setRepetitions] = useState(5);
  const animDefaults = { duration: 0.6, ease: 'expo' };

  const distMetric = (x, y, x2, y2) => (x - x2) ** 2 + (y - y2) ** 2;
  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const top = distMetric(mouseX, mouseY, width / 2, 0);
    const bot = distMetric(mouseX, mouseY, width / 2, height);
    return top < bot ? 'top' : 'bottom';
  };

  useEffect(() => {
    const calc = () => {
      if (!marqueeInnerRef.current) return;
      const part = marqueeInnerRef.current.querySelector('.marquee__part');
      if (!part) return;
      const needed = Math.ceil(window.innerWidth / (part.offsetWidth || 1)) + 3;
      setRepetitions(Math.max(5, needed));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [text, image]);

  useEffect(() => {
    const setup = () => {
      if (!marqueeInnerRef.current) return;
      const part = marqueeInnerRef.current.querySelector('.marquee__part');
      if (!part || !part.offsetWidth) return;
      if (animationRef.current) animationRef.current.kill();
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -part.offsetWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });
    };
    const t = setTimeout(setup, 60);
    return () => { clearTimeout(t); animationRef.current?.kill(); };
  }, [text, image, repetitions, speed]);

  const handleMouseEnter = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    gsap.timeline({ defaults: animDefaults })
      .set(marqueeRef.current,      { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%'  : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    gsap.timeline({ defaults: animDefaults })
      .to(marqueeRef.current,      { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%'  : '-101%' }, 0);
  };

  return (
    <div className="menu__item" ref={itemRef} style={{ borderColor }}>
      <a
        className="menu__item-link"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: textColor }}
      >
        {text}
      </a>
      <div className="marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                <span>{text}</span>
                {image && <div className="marquee__img" style={{ backgroundImage: `url(${image})` }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;