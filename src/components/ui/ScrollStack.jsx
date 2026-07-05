import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children, className='', itemDistance=100, itemScale=0.03,
  itemStackDistance=30, stackPosition='20%', scaleEndPosition='10%',
  baseScale=0.85, scaleDuration=0.5, rotationAmount=0, blurAmount=0,
  useWindowScroll=false, onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%'))
      return (parseFloat(value) / 100) * containerHeight;
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) return { scrollTop: window.scrollY, containerHeight: window.innerHeight };
    const sc = scrollerRef.current;
    return { scrollTop: sc.scrollTop, containerHeight: sc.clientHeight };
  }, [useWindowScroll]);

  const getElementOffset = useCallback(el => {
    if (useWindowScroll) { const r = el.getBoundingClientRect(); return r.top + window.scrollY; }
    return el.offsetTop;
  }, [useWindowScroll]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const spPx = parsePercentage(stackPosition, containerHeight);
    const sePx = parsePercentage(scaleEndPosition, containerHeight);
    const endEl = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end');
    const endElTop = endEl ? getElementOffset(endEl) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - spPx - itemStackDistance * i;
      const triggerEnd = cardTop - sePx;
      const pinStart = cardTop - spPx - itemStackDistance * i;
      const pinEnd = endElTop - containerHeight / 2;
      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topIdx = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jt = getElementOffset(cardsRef.current[j]);
          const jts = jt - spPx - itemStackDistance * j;
          if (scrollTop >= jts) topIdx = j;
        }
        if (i < topIdx) blur = Math.max(0, (topIdx - i) * blurAmount);
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (isPinned) translateY = scrollTop - cardTop + spPx + itemStackDistance * i;
      else if (scrollTop > pinEnd) translateY = pinEnd - cardTop + spPx + itemStackDistance * i;

      const nt = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };
      const lt = lastTransformsRef.current.get(i);
      const changed = !lt ||
        Math.abs(lt.translateY - nt.translateY) > 0.1 ||
        Math.abs(lt.scale - nt.scale) > 0.001 ||
        Math.abs(lt.rotation - nt.rotation) > 0.1 ||
        Math.abs(lt.blur - nt.blur) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0,${nt.translateY}px,0) scale(${nt.scale}) rotate(${nt.rotation}deg)`;
        card.style.filter = nt.blur > 0 ? `blur(${nt.blur}px)` : '';
        lastTransformsRef.current.set(i, nt);
      }

      if (i === cardsRef.current.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !stackCompletedRef.current) { stackCompletedRef.current = true; onStackComplete?.(); }
        else if (!inView && stackCompletedRef.current) stackCompletedRef.current = false;
      }
    });

    isUpdatingRef.current = false;
  }, [itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, rotationAmount, blurAmount, useWindowScroll, onStackComplete, calculateProgress, parsePercentage, getScrollData, getElementOffset]);

  const handleScroll = useCallback(() => updateCardTransforms(), [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    const easing = t => Math.min(1, 1.001 - Math.pow(2, -10 * t));
    if (useWindowScroll) {
      const lenis = new Lenis({ duration: 1.2, easing, smoothWheel: true, touchMultiplier: 2, infinite: false, wheelMultiplier: 1, lerp: 0.1, syncTouch: true, syncTouchLerp: 0.075 });
      lenis.on('scroll', handleScroll);
      const raf = time => { lenis.raf(time); animationFrameRef.current = requestAnimationFrame(raf); };
      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
    } else {
      const sc = scrollerRef.current;
      if (!sc) return;
      const lenis = new Lenis({ wrapper: sc, content: sc.querySelector('.scroll-stack-inner'), duration: 1.2, easing, smoothWheel: true, touchMultiplier: 2, infinite: false, normalizeWheel: true, wheelMultiplier: 1, lerp: 0.1, syncTouch: true, syncTouchLerp: 0.075, touchInertia: 0.6 });
      lenis.on('scroll', handleScroll);
      const raf = time => { lenis.raf(time); animationFrameRef.current = requestAnimationFrame(raf); };
      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const cards = Array.from(useWindowScroll
      ? document.querySelectorAll('.scroll-stack-card')
      : sc.querySelectorAll('.scroll-stack-card'));
    cardsRef.current = cards;
    const cache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
    });

    setupLenis();
    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (lenisRef.current) lenisRef.current.destroy();
      stackCompletedRef.current = false;
      cardsRef.current = [];
      cache.clear();
      isUpdatingRef.current = false;
    };
  }, [itemDistance, itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, scaleDuration, rotationAmount, blurAmount, useWindowScroll, onStackComplete, setupLenis, updateCardTransforms]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;