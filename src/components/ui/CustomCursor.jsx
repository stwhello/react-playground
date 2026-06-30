import { useEffect, useRef } from "react";

// Skeleton only — next step is wiring this to framer-motion springs
// so it trails the real cursor with bounce/overshoot easing.
export default function CustomCursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (!dotRef.current) return;
      dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "var(--lime)",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference",
      }}
    />
  );
}
