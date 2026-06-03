import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { T, fonts, radius } from "../constants/tokens";
import { fadeUp } from "../animations/variants";

// ── FadeUp wrapper ──────────────────────────────────────────────────────────
export function FadeUp({ children, delay = 0, className, style }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── Button ──────────────────────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary:    { background: T.emerald,    color: "#0a140a" },
  amber:      { background: T.amber,      color: "#0a140a" },
  ghost:      { background: "transparent", color: T.text,  border: `1.5px solid ${T.border}` },
  ghostAmber: { background: "transparent", color: T.amber, border: `1.5px solid ${T.borderAmt}` },
  dark:       { background: "#1a2e1a",    color: T.emeraldMid, border: `1px solid ${T.border}` },
};

export function Btn({ children, onClick, variant = "primary", size = "md", style: s, className, type = "button" }) {
  const base = {
    fontFamily: fonts.body, fontWeight: 600, borderRadius: radius.pill,
    cursor: "pointer", transition: "all 0.2s cubic-bezier(0.22,1,0.36,1)",
    display: "inline-flex", alignItems: "center", gap: 8, border: "none",
    padding: size === "lg" ? "14px 32px" : size === "sm" ? "8px 18px" : "11px 24px",
    fontSize: size === "lg" ? 16 : size === "sm" ? 13 : 14,
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      style={{ ...base, ...BTN_VARIANTS[variant], ...s }}
      onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.12)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
    >
      {children}
    </button>
  );
}

// ── Tag / Chip ───────────────────────────────────────────────────────────────
const TAG_COLORS = {
  emerald: { bg: "rgba(34,197,94,0.12)",  color: T.emeraldMid, border: T.border },
  amber:   { bg: "rgba(245,158,11,0.12)", color: T.amber,      border: T.borderAmt },
  dim:     { bg: "rgba(255,255,255,0.06)",color: T.textMuted,   border: "rgba(134,239,172,0.2)" },
};

export function Tag({ children, color = "emerald" }) {
  const c = TAG_COLORS[color] || TAG_COLORS.emerald;
  return (
    <span style={{
      fontFamily: fonts.body, fontSize: 11, fontWeight: 600,
      letterSpacing: "0.08em", textTransform: "uppercase",
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: radius.pill, padding: "4px 12px",
    }}>
      {children}
    </span>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, style, hover = true, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isHov = hover && hovered;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: isHov ? T.bgHover : T.bgCard,
        border:     `1px solid ${isHov ? T.borderHover : T.border}`,
        borderRadius: radius.xl, padding: "24px 28px",
        transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
        transform:  isHov ? "translateY(-3px)" : "none",
        boxShadow:  isHov ? "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(34,197,94,0.1)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Ambient glow dot ─────────────────────────────────────────────────────────
export function GlowDot({ top, left, right, bottom, size = 300, opacity = 0.12, color = T.emerald }) {
  return (
    <div style={{
      position: "absolute", top, left, right, bottom, pointerEvents: "none",
      width: size, height: size, borderRadius: "50%",
      background: color, filter: `blur(${size * 0.4}px)`, opacity,
    }} />
  );
}

// ── Section header ───────────────────────────────────────────────────────────
export function SectionHeader({ tag, title, sub, center = true }) {
  return (
    <FadeUp style={{ textAlign: center ? "center" : "left", marginBottom: 56 }}>
      {tag && <div style={{ marginBottom: 16 }}><Tag>{tag}</Tag></div>}
      <h2 style={{
        fontFamily: fonts.heading, fontSize: "clamp(28px,4vw,42px)", fontWeight: 700,
        color: T.text, lineHeight: 1.15, marginBottom: 16,
      }}>
        {title}
      </h2>
      {sub && (
        <p style={{
          fontFamily: fonts.body, fontSize: 17, color: T.textMuted,
          maxWidth: 560, margin: center ? "0 auto" : undefined, lineHeight: 1.7,
        }}>
          {sub}
        </p>
      )}
    </FadeUp>
  );
}
