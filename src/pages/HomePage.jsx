import { motion } from "framer-motion";
import { T, fonts } from "../constants/tokens";
import { fadeUp, stagger } from "../animations/variants";
import { useRoute } from "../context/RouteContext";
import { useApp } from "../context/AppContext";
import { Btn, Tag, Card, GlowDot, SectionHeader, FadeUp } from "../components/UI";

const FEATURES = [
  { icon: "🚛", title: "Schedule Pickup",  desc: "Book a doorstep scrap collection — paper, plastic, e-waste and more.", page: "pickup",    accent: "#22c55e" },
  { icon: "📚", title: "Learn & Segregate",desc: "Color-coded guides, quizzes, and recycling facts that actually stick.", page: "education", accent: "#38bdf8" },
  { icon: "🏆", title: "Earn Rewards",     desc: "Every pickup earns points. Redeem for discounts, tree plantations, or NGO donations.", page: "rewards", accent: "#f59e0b" },
  { icon: "🌍", title: "Track Impact",     desc: "Trees saved, CO₂ reduced, and your rank in the community leaderboard.", page: "rewards",   accent: "#a78bfa" },
];

const STEPS = [
  { n: "01", icon: "📝", title: "Book a Pickup", desc: "Fill in your address, waste type, and preferred time slot." },
  { n: "02", icon: "🚛", title: "We Collect",    desc: "Our empanelled partners arrive at your doorstep." },
  { n: "03", icon: "🏭", title: "We Recycle",    desc: "Waste is sorted, processed, and responsibly recycled." },
  { n: "04", icon: "🎁", title: "You Earn",      desc: "Points land in your account. Redeem for cool rewards." },
];

const FACTS = [
  "India generates 62 million tonnes of waste annually.",
  "Only 9% of plastic ever produced has been recycled globally.",
  "Recycling 1 tonne of paper saves 17 trees and 26,500 L of water.",
  "E-waste is India's fastest-growing waste stream.",
];

const TRUST_BADGES = ["🇮🇳 Made in India", "🌱 Eco-first", "🔒 Google Sign-in", "🏆 Gamified Rewards"];

export default function HomePage() {
  const { navigate }             = useRoute();
  const { user, pickups, points } = useApp();
  const totalTreesSaved = Math.floor(pickups.length * 1.7);
  const co2Reduced      = (pickups.length * 2.3).toFixed(1);

  return (
    <div style={{ background: T.bg }}>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", minHeight: "92vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", padding: "120px 24px 80px",
      }}>
        <GlowDot top="-5%"  left="20%"  size={600} opacity={0.11} />
        <GlowDot bottom="10%" right="15%" size={500} opacity={0.07} color={T.amber} />
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.022,
          backgroundImage: "radial-gradient(circle, rgba(34,197,94,0.9) 1px, transparent 1px)",
          backgroundSize: "48px 48px", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ marginBottom: 24 }}>
            <Tag color="emerald">🌱 India's Smart Recycling Platform</Tag>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: fonts.heading, fontSize: "clamp(40px,6vw,76px)", fontWeight: 800,
              color: T.text, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24,
            }}
          >
            Purani Cheezein,{" "}
            <span style={{
              background: `linear-gradient(135deg, ${T.emerald}, ${T.emeraldMid})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Nayi Soch.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              fontFamily: fonts.body, fontSize: "clamp(16px,2vw,20px)", color: T.textMuted,
              lineHeight: 1.75, maxWidth: 560, margin: "0 auto 40px",
            }}
          >
            Schedule waste pickups, learn responsible recycling, and earn rewards — helping India breathe cleaner, one pickup at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Btn size="lg" variant="amber"  onClick={() => navigate("pickup")}>📍 Book a Pickup</Btn>
            <Btn size="lg" variant="ghost"  onClick={() => navigate("education")}>Learn Recycling →</Btn>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{ marginTop: 60, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}
          >
            {TRUST_BADGES.map(t => (
              <span key={t} style={{
                fontFamily: fonts.body, fontSize: 12, color: T.textSubtle,
                padding: "4px 12px", border: "1px solid rgba(34,197,94,0.1)", borderRadius: 100,
              }}>
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────── */}
      <section style={{
        background: "rgba(34,197,94,0.05)",
        borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
        padding: "28px 24px",
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 24, textAlign: "center",
        }}>
          {[
            { val: pickups.length,          label: "Your Pickups", icon: "🚛" },
            { val: points,                  label: "Your Points",  icon: "🏆" },
            { val: totalTreesSaved,         label: "Trees Saved",  icon: "🌳" },
            { val: `${co2Reduced} kg`,      label: "CO₂ Reduced",  icon: "🌍" },
          ].map(({ val, label, icon }) => (
            <FadeUp key={label}>
              <p style={{ fontFamily: fonts.body, fontSize: 11, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                {icon} {label}
              </p>
              <p style={{ fontFamily: fonts.heading, fontSize: 28, fontWeight: 700, color: T.text }}>{val}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── WELCOME BANNER (logged-in only) ───────────────────────────── */}
      {user && (
        <div style={{ maxWidth: 1200, margin: "32px auto 0", padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(34,197,94,0.07)", border: `1px solid rgba(34,197,94,0.2)`,
              borderRadius: 16, padding: "20px 24px",
              display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: "50%", background: T.emeraldDark,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: fonts.heading, fontWeight: 700, fontSize: 18, color: "#0a140a",
              border: `2px solid ${T.emerald}`, flexShrink: 0,
            }}>
              {user.given_name?.[0] ?? "U"}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: fonts.heading, fontWeight: 600, color: T.text, fontSize: 15 }}>
                Welcome back, {user.given_name}! 👋
              </p>
              <p style={{ fontFamily: fonts.body, color: T.textMuted, fontSize: 13, marginTop: 2 }}>
                You have <strong style={{ color: T.amber }}>{points} points</strong> — keep recycling to earn more!
              </p>
            </div>
            <Btn size="sm" variant="primary" onClick={() => navigate("pickup")}>+ New Pickup</Btn>
          </motion.div>
        </div>
      )}

      {/* ── FEATURE CARDS ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <SectionHeader
          tag="Platform"
          title="Everything you need to recycle right"
          sub="Kabadiwala bundles scheduling, education, and rewards into one seamless platform."
        />
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}
        >
          {FEATURES.map(f => (
            <motion.div key={f.title} variants={fadeUp}>
              <Card onClick={() => navigate(f.page)} hover style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, marginBottom: 20,
                  background: `${f.accent}18`, border: `1px solid ${f.accent}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 17, color: T.text, marginBottom: 10 }}>
                  {f.title}
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: 14, color: T.textMuted, lineHeight: 1.75, flex: 1 }}>
                  {f.desc}
                </p>
                <p style={{ marginTop: 20, fontFamily: fonts.body, fontSize: 13, fontWeight: 600, color: f.accent }}>
                  Explore →
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FACTS STRIP ───────────────────────────────────────────────── */}
      <section style={{
        background: T.bgCard,
        borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionHeader
            tag="Did You Know?"
            title="The waste crisis is real — and solvable"
            sub="Understanding the problem is the first step to fixing it."
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {FACTS.map((fact, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div style={{
                  background: "rgba(34,197,94,0.04)", border: `1px solid ${T.border}`,
                  borderRadius: 16, padding: "20px 24px",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: "rgba(34,197,94,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, marginBottom: 12,
                  }}>
                    💡
                  </div>
                  <p style={{ fontFamily: fonts.body, fontSize: 14, color: T.textMuted, lineHeight: 1.75 }}>{fact}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Btn variant="ghost" onClick={() => navigate("education")}>Learn more facts →</Btn>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <SectionHeader
          tag="Process"
          title="How Kabadiwala works"
          sub="From your doorstep to certified recycling — we handle it all."
        />
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8,
        }}>
          {STEPS.map((s, i) => (
            <FadeUp key={s.n} delay={i * 0.12}>
              <div style={{ padding: "28px 24px", textAlign: "center" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%", margin: "0 auto 20px",
                  background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>
                  {s.icon}
                </div>
                <p style={{
                  fontFamily: fonts.body, fontSize: 11, fontWeight: 700,
                  color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8,
                }}>
                  Step {s.n}
                </p>
                <h3 style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 16, color: T.text, marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: 14, color: T.textMuted, lineHeight: 1.75 }}>
                  {s.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Btn size="lg" variant="primary" onClick={() => navigate("pickup")}>
            Schedule Your First Pickup 🚛
          </Btn>
        </div>
      </section>

    </div>
  );
}
