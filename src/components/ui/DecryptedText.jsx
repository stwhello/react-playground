import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';

const styles = {
  wrapper: { display:'inline-block', whiteSpace:'pre-wrap' },
  srOnly: { position:'absolute', width:'1px', height:'1px', padding:0, margin:'-1px', overflow:'hidden', clip:'rect(0,0,0,0)', border:0 }
};

export default function DecryptedText({
  text, speed=50, maxIterations=10, sequential=false,
  revealDirection='start', useOriginalCharsOnly=false,
  characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className='', parentClassName='', encryptedClassName='',
  animateOn='hover', clickMode='once', ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn!=='click');
  const [direction, setDirection] = useState('forward');
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const availableChars = useMemo(() =>
    useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(c=>c!==' ')
      : characters.split(''),
    [useOriginalCharsOnly, text, characters]
  );

  const shuffleText = useCallback((originalText, currentRevealed) =>
    originalText.split('').map((char,i) => {
      if (char===' ') return ' ';
      if (currentRevealed.has(i)) return originalText[i];
      return availableChars[Math.floor(Math.random()*availableChars.length)];
    }).join(''), [availableChars]
  );

  const fillAllIndices = useCallback(() => {
    const s=new Set(); for(let i=0;i<text.length;i++) s.add(i); return s;
  }, [text]);

  const encryptInstantly = useCallback(() => {
    const e=new Set(); setRevealedIndices(e); setDisplayText(shuffleText(text,e)); setIsDecrypted(false);
  }, [text, shuffleText]);

  const triggerDecrypt = useCallback(() => {
    setRevealedIndices(new Set()); setDirection('forward'); setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    let currentIteration = 0;
    const getNextIndex = revealedSet => {
      const len=text.length;
      if (revealDirection==='start') return revealedSet.size;
      if (revealDirection==='end') return len-1-revealedSet.size;
      const middle=Math.floor(len/2), offset=Math.floor(revealedSet.size/2);
      const idx=revealedSet.size%2===0?middle+offset:middle-offset-1;
      if (idx>=0&&idx<len&&!revealedSet.has(idx)) return idx;
      for(let i=0;i<len;i++) if(!revealedSet.has(i)) return i;
      return 0;
    };
    intervalRef.current = setInterval(() => {
      setRevealedIndices(prev => {
        if (sequential) {
          if (prev.size<text.length) {
            const ni=getNextIndex(prev), nr=new Set(prev); nr.add(ni);
            setDisplayText(shuffleText(text,nr)); return nr;
          } else {
            clearInterval(intervalRef.current); setIsAnimating(false); setIsDecrypted(true); return prev;
          }
        } else {
          setDisplayText(shuffleText(text,prev)); currentIteration++;
          if (currentIteration>=maxIterations) {
            clearInterval(intervalRef.current); setIsAnimating(false); setDisplayText(text); setIsDecrypted(true);
          }
          return prev;
        }
      });
    }, speed);
    return () => clearInterval(intervalRef.current);
  }, [isAnimating, text, speed, maxIterations, sequential, revealDirection, shuffleText, direction, fillAllIndices]);

  const triggerHoverDecrypt = useCallback(() => {
    if (isAnimating) return;
    setRevealedIndices(new Set()); setIsDecrypted(false); setDisplayText(text); setDirection('forward'); setIsAnimating(true);
  }, [isAnimating, text]);

  const resetToPlainText = useCallback(() => {
    clearInterval(intervalRef.current); setIsAnimating(false);
    setRevealedIndices(new Set()); setDisplayText(text); setIsDecrypted(true); setDirection('forward');
  }, [text]);

  useEffect(() => {
    if (animateOn!=='view'&&animateOn!=='inViewHover') return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting&&!hasAnimated) { triggerDecrypt(); setHasAnimated(true); } });
    }, { threshold: 0.1 });
    const cur=containerRef.current;
    if (cur) observer.observe(cur);
    return () => { if (cur) observer.unobserve(cur); };
  }, [animateOn, hasAnimated, triggerDecrypt]);

  useEffect(() => {
    if (animateOn==='click') encryptInstantly();
    else { setDisplayText(text); setIsDecrypted(true); }
    setRevealedIndices(new Set()); setDirection('forward');
  }, [animateOn, text, encryptInstantly]);

  const animateProps = animateOn==='hover'||animateOn==='inViewHover'
    ? { onMouseEnter: triggerHoverDecrypt, onMouseLeave: resetToPlainText }
    : {};

  return (
    <motion.span className={parentClassName} ref={containerRef} style={styles.wrapper} {...animateProps} {...props}>
      <span style={styles.srOnly}>{displayText}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char,index) => {
          const revealed = revealedIndices.has(index)||(!isAnimating&&isDecrypted);
          return <span key={index} className={revealed?className:encryptedClassName}>{char}</span>;
        })}
      </span>
    </motion.span>
  );
}