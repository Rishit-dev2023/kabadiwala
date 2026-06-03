import { motion } from "framer-motion";
import { T, fonts, radius } from "../constants/tokens";
import { useApp } from "../context/AppContext";
import { useRoute } from "../context/RouteContext";
import { Btn, Tag, Card, GlowDot, SectionHeader, FadeUp } from "../components/UI";

const REDEMPTIONS = [
  { icon: "🛵", label: "₹50 off on Zepto",             pts: 200, cat: "Shopping" },
  { icon: "🍕", label: "₹100 off on Swiggy",           pts: 350, cat: "Food" },
  { icon: "🌳", label: "Plant a tree in your name",    pts: 150, cat: "Environment" },
  { icon: "📚", label: "Donate books to a govt school", pts: 100, cat: "Social" },
  { icon: "☀️", label: "Solar lamp for a village home", pts: 500, cat: "Environment" },
  { icon: "🎁", label: "Kabadiwala Eco Kit",            pts: 300, cat: "Gift" },
];

const LEADERBOARD = [
  { rank: 1, name: "Priya M.",  city: "Mumbai",    pts: 1240, avatar: "PM" },
  { rank: 2, name: "Arjun S.", city: "Bengaluru", pts: 980,  avatar: "AS" },
  { rank: 3, name: "Sunita R.",city: "Pune",      pts: 875,  avatar: "SR" },
  { rank: 4, name: "Deepak K.",city: "Hyderabad", pts: 720,  avatar: "DK" },
  { rank: 5, name: "Meera T.", city: "Chennai",   pts: 690,  avatar: "MT" },
];

const RANK_COLORS = ["#f59e0b", "#9ca3af", "#b87333"];

export default function RewardsPage() {
  const { user, points, pickups, badges } = useApp();
  const { navigate }                       = useRoute();

  const nextBadge = badges.find(b => !b.earned);
  const progress  = nextBadge ? Math.min((points / nextBadge.threshold) * 100, 100) : 100;

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{
        background: T.bgCard, borderBottom: `1px solid ${T.border}`,
        padding: "100px 24px 60px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <GlowDot top="0" left="30%" size={400} opacity={0.09} color={T.amber} />
        <FadeUp>
          <Tag color="amber">🏆 Rewards</Tag>
          <h1 style={{
            fontFamily: fonts.heading, fontSize: "clamp(32px,5vw,52px)", fontWeight: 800,
            color: T.text, marginTop: 16, marginBottom: 12,
          }}>
            Your Rewards Dashboard
          </h1>
          <p style={{ fontFamily: fonts.body, fontSize: 16, color: T.textMuted, maxWidth: 480, margin: "0 auto" }}>
            Every pickup earns points. Redeem for deals, donations, and real-world impact.
          </p>
        </FadeUp>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* ── POINTS CARD ───────────────────────────────────────────── */}
        <FadeUp>
          <div style={{
            background: "linear-gradient(135deg, #1a3a10, #2d5a1b)",
            border: `1px solid rgba(34,197,94,0.3)`,
            borderRadius: radius.xxl, padding: "36px 40px", marginBottom: 32,
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: 32,
          }}>
            {user && (
              <div style={{
                width: 60, height: 60, borderRadius: "50%", background: T.emeraldDark,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: fonts.heading, fontWeight: 700, fontSize: 22, color: "#0a140a",
                border: `3px solid ${T.emeraldMid}`, flexShrink: 0,
              }}>
                {user.given_name?.[0] ?? "U"}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 120 }}>
              <p style={{ fontFamily: fonts.body, fontSize: 13, color: T.textMuted, marginBottom: 4 }}>
                {user ? `${user.name}'s Balance` : "Your Balance"}
              </p>
              <p style={{
                fontFamily: fonts.heading, fontWeight: 800,
                fontSize: "clamp(40px,5vw,64px)", color: T.emeraldMid, lineHeight: 1,
              }}>
                {points}
              </p>
              <p style={{ fontFamily: fonts.body, fontSize: 13, color: T.textMuted, marginTop: 4 }}>
                Kabadiwala Points
              </p>
            </div>
            {/* Progress to next badge */}
            <div style={{ minWidth: 200, flex: 1 }}>
              <p style={{ fontFamily: fonts.body, fontSize: 13, color: T.textMuted, marginBottom: 10 }}>
                {nextBadge ? `Next: ${nextBadge.emoji} ${nextBadge.name}` : "Max Level Reached! 👑"}
              </p>
              <div style={{ width: "100%", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: "100%", borderRadius: 3, background: T.emerald }}
                />
              </div>
              {nextBadge && (
                <p style={{ fontFamily: fonts.body, fontSize: 12, color: T.textMuted, marginTop: 6 }}>
                  {nextBadge.threshold - points} pts to go
                </p>
              )}
            </div>
          </div>
        </FadeUp>

        {/* ── IMPACT STATS ──────────────────────────────────────────── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16, marginBottom: 56,
        }}>
          {[
            { icon: "🚛", val: pickups.length,                    label: "Pickups Done" },
            { icon: "🌳", val: Math.floor(pickups.length * 1.7),  label: "Trees Equivalent" },
            { icon: "☁️", val: `${(pickups.length * 2.3).toFixed(1)} kg`, label: "CO₂ Saved" },
            { icon: "⚖️", val: `${pickups.length * 5} kg`,        label: "Waste Recycled" },
          ].map(({ icon, val, label }) => (
            <FadeUp key={label}>
              <Card hover={false} style={{ textAlign: "center", padding: "20px 16px" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                <p style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 24, color: T.text }}>{val}</p>
                <p style={{ fontFamily: fonts.body, fontSize: 12, color: T.textMuted, marginTop: 4 }}>{label}</p>
              </Card>
            </FadeUp>
          ))}
        </div>

        {/* ── BADGES ────────────────────────────────────────────────── */}
        <SectionHeader tag="Badges" title="Your achievements" center={false} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 64 }}>
          {badges.map(b => (
            <FadeUp key={b.id}>
              <div style={{
                background: b.earned ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${b.earned ? "rgba(34,197,94,0.25)" : T.border}`,
                borderRadius: radius.lg, padding: "16px 20px",
                textAlign: "center", minWidth: 120,
                opacity: b.earned ? 1 : 0.4, transition: "all 0.3s",
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{b.emoji}</div>
                <p style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 13, color: b.earned ? T.text : T.textMuted }}>
                  {b.name}
                </p>
                <p style={{ fontFamily: fonts.body, fontSize: 11, color: T.textMuted, marginTop: 4 }}>
                  {b.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* ── REDEMPTIONS ───────────────────────────────────────────── */}
        <SectionHeader tag="Redeem" title="Spend your points" center={false} />
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16, marginBottom: 64,
        }}>
          {REDEMPTIONS.map((r, i) => {
            const canRedeem = points >= r.pts;
            return (
              <FadeUp key={r.label} delay={i * 0.07}>
                <Card hover={canRedeem} style={{ opacity: canRedeem ? 1 : 0.5, height: "100%" }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{r.icon}</div>
                  <p style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 15, color: T.text, marginBottom: 6 }}>
                    {r.label}
                  </p>
                  <Tag color="dim">{r.cat}</Tag>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                    <span style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 16, color: T.amber }}>
                      {r.pts} pts
                    </span>
                    {canRedeem ? (
                      <Btn
                        size="sm" variant="amber"
                        onClick={() => alert(`Redeeming: ${r.label}\n\nConnect payment backend to enable real redemptions.`)}
                      >
                        Redeem
                      </Btn>
                    ) : (
                      <span style={{ fontFamily: fonts.body, fontSize: 12, color: T.textMuted }}>
                        Need {r.pts - points} more
                      </span>
                    )}
                  </div>
                </Card>
              </FadeUp>
            );
          })}
        </div>

        {/* ── LEADERBOARD ───────────────────────────────────────────── */}
        <SectionHeader tag="Community" title="City leaderboard" center={false} />
        <Card hover={false} style={{ maxWidth: 560, padding: "8px 0" }}>
          {LEADERBOARD.map((u, i) => (
            <div key={u.rank} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 24px",
              borderBottom: i < LEADERBOARD.length - 1 ? `1px solid ${T.border}` : "none",
            }}>
              <span style={{
                fontFamily: fonts.heading, fontWeight: 800, fontSize: 14, width: 20, textAlign: "center",
                color: RANK_COLORS[i] ?? T.textMuted,
              }}>
                {u.rank}
              </span>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: i < 3 ? `${RANK_COLORS[i]}22` : "rgba(255,255,255,0.05)",
                border: `1px solid ${i < 3 ? RANK_COLORS[i] + "55" : T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: fonts.heading, fontWeight: 700, fontSize: 12,
                color: RANK_COLORS[i] ?? T.textMuted, flexShrink: 0,
              }}>
                {u.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: fonts.body, fontWeight: 500, fontSize: 14, color: T.text }}>
                  {u.name}
                </p>
                <p style={{ fontFamily: fonts.body, fontSize: 12, color: T.textMuted }}>{u.city}</p>
              </div>
              <p style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 16, color: T.emeraldMid }}>
                {u.pts} pts
              </p>
            </div>
          ))}
        </Card>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Btn size="lg" variant="amber" onClick={() => navigate("pickup")}>
            Schedule a Pickup to Earn More Points 🚛
          </Btn>
        </div>

      </div>
    </div>
  );
}
