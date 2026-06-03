/**
 * Kabadiwala — Design Token System
 * Single source of truth for colors, fonts, and spacing.
 */

export const T = {
  // Backgrounds — deep charcoal / dark slate (less green-tinted)
  bg:           "#0d1117",
  bgCard:       "#161b22",
  bgHover:      "rgba(22,27,34,0.97)",
  bgSection:    "#111418",

  // Emerald accent system
  emerald:      "#10d97e",
  emeraldDark:  "#059660",
  emeraldMid:   "#34d399",
  emeraldGlow:  "rgba(16,217,126,0.15)",

  // Amber accent
  amber:        "#f59e0b",
  amberDark:    "#d97706",

  // Dark base
  charcoal:     "#090d12",

  // Typography — neutral, readable
  text:         "#e8f4f1",
  textMuted:    "#8ca3a0",
  textDim:      "#4ade80",
  textSubtle:   "rgba(140,163,160,0.5)",

  // Borders — emerald-tinted glass
  border:       "rgba(16,217,126,0.12)",
  borderHover:  "rgba(16,217,126,0.28)",
  borderAmt:    "rgba(245,158,11,0.28)",

  // Glassmorphism
  glass:        "rgba(13,17,23,0.78)",
  glassLight:   "rgba(255,255,255,0.04)",
  glassBorder:  "rgba(255,255,255,0.07)",

  // Status
  error:        "#ef4444",
  errorBg:      "rgba(239,68,68,0.1)",
  success:      "#10d97e",
  successBg:    "rgba(16,217,126,0.08)",
};

export const fonts = {
  heading: "'Sora', 'Plus Jakarta Sans', system-ui, sans-serif",
  body:    "'Plus Jakarta Sans', system-ui, sans-serif",
};

export const radius = {
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  pill: 100,
};

export const ease = [0.22, 1, 0.36, 1];
