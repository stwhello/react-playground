import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./BubbleMenu.css";

const DEFAULT_ITEMS = [
  {
    label: "hero",
    href: "#hero",
    ariaLabel: "Hero",
    rotation: -8,
    hoverStyles: { bgColor: "#C8FF4D", textColor: "#0B0B10" },
  },
  {
    label: "about",
    href: "#about",
    ariaLabel: "About",
    rotation: 8,
    hoverStyles: { bgColor: "#FF5470", textColor: "#F4F2ED" },
  },
  {
    label: "stack",
    href: "#stack",
    ariaLabel: "Stack",
    rotation: -8,
    hoverStyles: { bgColor: "#7C83FD", textColor: "#F4F2ED" },
  },
  {
    label: "work",
    href: "#work",
    ariaLabel: "Work",
    rotation: 8,
    hoverStyles: { bgColor: "#C8FF4D", textColor: "#0B0B10" },
  },
  {
    label: "contact",
    href: "#contact",
    ariaLabel: "Contact",
    rotation: -8,
    hoverStyles: { bgColor: "#FF5470", textColor: "#F4F2ED" },
  },
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = "Toggle menu",
  menuBg = "#131318",
  menuContentColor = "#C8FF4D",
  useFixedPosition = true,
  items,
  animationEase = "back.out(1.5)",
  animationDuration = 0.5,
  staggerDelay = 0.12,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayRef = useRef(null);
  const bubblesRef = useRef([]);
  const labelRefs = useRef([]);
  const menuItems = items?.length ? items : DEFAULT_ITEMS;
  const containerClassName = [
    "bubble-menu",
    useFixedPosition ? "fixed" : "absolute",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!overlay || !bubbles.length) return;
    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 24, autoAlpha: 0 });
      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase,
        });
        if (labels[i])
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: "power3.out",
            },
            `-=${animationDuration * 0.9}`,
          );
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: "power3.in",
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setShowOverlay(false);
        },
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  return (
    <>
      <nav
        className={containerClassName}
        style={style}
        aria-label='Main navigation'
      >
        <div className='bubble logo-bubble' style={{ background: menuBg }}>
          <span className='logo-content'>
            {typeof logo === "string" ? (
              <img src={logo} alt='Logo' className='bubble-logo' />
            ) : (
              logo
            )}
          </span>
        </div>
        <button
          type='button'
          className={`bubble toggle-bubble menu-btn ${isMenuOpen ? "open" : ""}`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span
            className='menu-line'
            style={{ background: menuContentColor }}
          />
          <span
            className='menu-line short'
            style={{ background: menuContentColor }}
          />
        </button>
      </nav>
      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items ${useFixedPosition ? "fixed" : "absolute"}`}
          aria-hidden={!isMenuOpen}
        >
          <ul className='pill-list' role='menu'>
            {menuItems.map((item, idx) => (
              <li key={idx} role='none' className='pill-col'>
                <a
                  role='menuitem'
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className='pill-link'
                  style={{
                    "--item-rot": `${item.rotation ?? 0}deg`,
                    "--pill-bg": menuBg,
                    "--pill-color": menuContentColor,
                    "--hover-bg": item.hoverStyles?.bgColor || "#C8FF4D",
                    "--hover-color": item.hoverStyles?.textColor || "#0B0B10",
                  }}
                  ref={(el) => {
                    if (el) bubblesRef.current[idx] = el;
                  }}
                  onClick={handleToggle}
                >
                  <span
                    className='pill-label'
                    ref={(el) => {
                      if (el) labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
