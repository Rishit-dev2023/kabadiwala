import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T, fonts } from "../constants/tokens";
import { LOADING_FACTS } from "../constants/data";

/* ── Indian Flag Tricolor Ring ───────────────────────────────────────────── */
function IndianFlagRing({ size = 120, style }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", ...style }}>
      {/* Outermost slow rotate — tricolor gradient ring */}
      <div style={{
        position: "absolute",
        width: size + 48, height: size + 48,
        borderRadius: "50%",
        background: "conic-gradient(from 0deg, #FF9933 0deg 120deg, #ffffff 120deg 240deg, #138808 240deg 360deg)",
        animation: "flagRing 8s linear infinite",
        mask: "radial-gradient(transparent 54%, black 55%)",
        WebkitMask: "radial-gradient(transparent 54%, black 55%)",
        opacity: 0.55,
      }} />

      {/* Middle ring — softer glow, counter-rotate */}
      <div style={{
        position: "absolute",
        width: size + 24, height: size + 24,
        borderRadius: "50%",
        background: "conic-gradient(from 180deg, #138808 0deg 120deg, #FF9933 120deg 240deg, #ffffff 240deg 360deg)",
        animation: "flagRing 12s linear infinite reverse",
        mask: "radial-gradient(transparent 56%, black 57%)",
        WebkitMask: "radial-gradient(transparent 56%, black 57%)",
        opacity: 0.28,
        filter: "blur(1px)",
      }} />

      {/* Saffron glow blob — top */}
      <div style={{
        position: "absolute",
        width: size * 0.6, height: size * 0.25,
        borderRadius: "50%",
        top: -size * 0.12,
        background: "radial-gradient(ellipse, rgba(255,153,51,0.55) 0%, transparent 70%)",
        filter: "blur(6px)",
        animation: "flagPulse 3s ease-in-out infinite",
      }} />

      {/* Green glow blob — bottom */}
      <div style={{
        position: "absolute",
        width: size * 0.6, height: size * 0.25,
        borderRadius: "50%",
        bottom: -size * 0.12,
        background: "radial-gradient(ellipse, rgba(19,136,8,0.5) 0%, transparent 70%)",
        filter: "blur(6px)",
        animation: "flagPulse 3s ease-in-out infinite 1.5s",
      }} />
    </div>
  );
}

/* ── Main Loading Screen ─────────────────────────────────────────────────── */
export default function LoadingScreen({ onDone }) {
  const [phase,   setPhase]   = useState(0);
  const [factIdx, setFactIdx] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setInterval(() => setFactIdx(i => (i + 1) % LOADING_FACTS.length), 1800);
    const t3 = setTimeout(onDone, 5000);
    return () => { clearTimeout(t1); clearInterval(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        key="loading"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6 } }}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: T.bg,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: 24,
        }}
      >
        {/* Background ambient glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
          width: 500, height: 500, borderRadius: "50%",
          background: T.emerald, filter: "blur(180px)", opacity: 0.05, pointerEvents: "none",
        }} />

        {/* Logo lockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", position: "relative", zIndex: 1 }}
        >
          {/* Logo circle with Indian flag ring */}
          <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 20px" }}>
            {/* The animated Indian flag rings */}
            <IndianFlagRing size={88} />

            {/* Logo circle — sits on top */}
            <div style={{
              position: "relative", zIndex: 2,
              width: 88, height: 88, borderRadius: "50%",
              background: "rgba(16,217,126,0.08)",
              border: "1.5px solid rgba(16,217,126,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 36,
              backdropFilter: "blur(4px)",
            }}>
              ♻️
            </div>
          </div>

          <h1 style={{
            fontFamily: fonts.heading, fontWeight: 800, fontSize: "clamp(32px,5vw,48px)",
            color: T.text, letterSpacing: "-0.03em", marginBottom: 8,
          }}>
            Kabadiwala
          </h1>
          <p style={{
            fontFamily: fonts.body, fontSize: 12, color: T.textMuted,
            letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 500,
          }}>
            Purani Cheezein · Nayi Soch
          </p>
        </motion.div>

        {/* Rotating fact */}
        <AnimatePresence mode="wait">
          {phase >= 1 && (
            <motion.div
              key={factIdx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45 }}
              style={{ marginTop: 52, maxWidth: 380, textAlign: "center", position: "relative", zIndex: 1 }}
            >
              <div style={{
                background: "rgba(16,217,126,0.04)",
                border: `1px solid ${T.border}`,
                borderRadius: 16, padding: "18px 28px",
                backdropFilter: "blur(8px)",
              }}>
                <p style={{ fontFamily: fonts.body, fontSize: 14, color: T.textMuted, lineHeight: 1.65 }}>
                  {LOADING_FACTS[factIdx]}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: "rgba(16,217,126,0.07)",
        }}>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #FF9933, #ffffff, #138808)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
