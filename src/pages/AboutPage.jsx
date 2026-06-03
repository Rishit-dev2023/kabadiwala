import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T, fonts, radius } from "../constants/tokens";
import { useRoute } from "../context/RouteContext";
import { Btn, Tag, Card, GlowDot, SectionHeader, FadeUp } from "../components/UI";

const VALUES = [
  { icon: "🌱", title: "Sustainability First", desc: "Every decision considers its long-term environmental impact." },
  { icon: "🤝", title: "Community-Driven",     desc: "Collective action at neighbourhood level changes cities." },
  { icon: "🏆", title: "Incentivize Good",     desc: "Points make purpose fun. People do better when rewarded." },
  { icon: "📖", title: "Education = Action",   desc: "Knowing what to do is half the battle. We make it easy." },
];

const TIMELINE = [
  { year: "2025",    milestone: "Kabadiwala founded — born from frustration with India's broken waste ecosystem." },
  { year: "2025 Q3", milestone: "MVP launched — pickup scheduling + basic rewards system." },
  { year: "2026",    milestone: "Expansion to 10 cities with 500+ monthly pickups." },
  { year: "2027",    milestone: "1 million kg of waste diverted from landfill. 🎯" },
];

const FAQS = [
  { q: "How does the pickup service work?",
    a: "You fill out a pickup form with your address, waste type, and time slot. Our empanelled Kabadiwala partner in your area confirms and collects." },
  { q: "What types of waste do you accept?",
    a: "Paper, plastic, e-waste, metal/scrap, glass, and organic waste. We do not accept hazardous chemicals or medical waste for regular pickups." },
  { q: "How are points calculated?",
    a: "You earn 50 base points per completed pickup, plus bonus points for certain waste types. E-waste earns the most!" },
  { q: "Is this service free?",
    a: "Yes! Kabadiwala pickup scheduling is completely free. Our partners earn through the recycling value of the material collected." },
  { q: "Which cities are you live in?",
    a: "Currently operational in Bhubaneswar (pilot). Expanding to Hyderabad, Pune, and Chennai in 2026." },
];

const IMPACT_STATS = [
  { val: "62M",    label: "Tonnes of waste/year in India",           icon: "🗑️" },
  { val: "<30%",   label: "Waste properly managed",                   icon: "♻️" },
  { val: "4M+",    label: "Informal waste workers in India",          icon: "👷" },
  { val: "₹1L Cr", label: "Annual value of unrecovered recyclables",  icon: "💰" },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div style={{
      background: T.bgCard,
      border: `1px solid ${isOpen ? "rgba(34,197,94,0.25)" : T.border}`,
      borderRadius: radius.lg, overflow: "hidden", transition: "border-color 0.2s",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", padding: "18px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <p style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 15, color: T.text }}>
          {faq.q}
        </p>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ color: T.textDim, flexShrink: 0, marginLeft: 16, display: "inline-block" }}
        >
          ↓
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 24px 20px" }}>
              <p style={{ fontFamily: fonts.body, fontSize: 14, color: T.textMuted, lineHeight: 1.75 }}>
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AboutPage() {
  const { navigate }    = useRoute();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{
        background: T.bgCard, borderBottom: `1px solid ${T.border}`,
        padding: "100px 24px 60px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <GlowDot top="0" right="25%" size={400} opacity={0.07} />
        <FadeUp>
          <Tag>🌏 Our Story</Tag>
          <h1 style={{
            fontFamily: fonts.heading, fontSize: "clamp(32px,5vw,52px)", fontWeight: 800,
            color: T.text, marginTop: 16, marginBottom: 12,
          }}>
            About Kabadiwala
          </h1>
          <p style={{
            fontFamily: fonts.body, fontSize: 16, color: T.textMuted,
            maxWidth: 580, margin: "0 auto", lineHeight: 1.75,
          }}>
            Modernising India's oldest recycling tradition — the Kabadiwala — with technology, gamification, and community power.
          </p>
        </FadeUp>
      </section>

      {/* Mission */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
        <FadeUp>
          <Tag>Mission</Tag>
          <h2 style={{
            fontFamily: fonts.heading, fontSize: "clamp(24px,3vw,36px)", fontWeight: 700,
            color: T.text, margin: "16px 0", lineHeight: 1.2,
          }}>
            We're fixing India's ₹1 lakh crore waste problem.
          </h2>
          <p style={{
            fontFamily: fonts.body, fontSize: 17, color: T.textMuted,
            lineHeight: 1.85, maxWidth: 680, margin: "0 auto 20px",
          }}>
            India generates{" "}
            <strong style={{ color: T.emeraldMid }}>62 million tonnes</strong> of waste every year, and less than 30% is properly managed.
            The humble Kabadiwala — our neighbourhood scrap collector — is one of the most effective recyclers in the world,
            yet they're unorganised, undervalued, and invisible.
          </p>
          <p style={{
            fontFamily: fonts.body, fontSize: 17, color: T.textMuted,
            lineHeight: 1.85, maxWidth: 680, margin: "0 auto",
          }}>
            We're changing that. Kabadiwala connects households with local collectors, educates citizens, and rewards responsible behaviour —
            making recycling the default, not the exception.
          </p>
        </FadeUp>
      </section>

      {/* Impact numbers */}
      <section style={{
        background: T.bgCard,
        borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
        padding: "64px 24px",
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 32, textAlign: "center",
          }}>
            {IMPACT_STATS.map(({ val, label, icon }) => (
              <FadeUp key={label}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                <p style={{
                  fontFamily: fonts.heading, fontWeight: 800,
                  fontSize: "clamp(24px,3vw,40px)", color: T.amber,
                }}>
                  {val}
                </p>
                <p style={{ fontFamily: fonts.body, fontSize: 13, color: T.textMuted, marginTop: 6, lineHeight: 1.55 }}>
                  {label}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}>
        <SectionHeader tag="Values" title="What we believe in" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {VALUES.map((v, i) => (
            <FadeUp key={v.title} delay={i * 0.1}>
              <Card hover style={{ textAlign: "center", height: "100%" }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{v.icon}</div>
                <h3 style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 16, color: T.text, marginBottom: 10 }}>
                  {v.title}
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: 14, color: T.textMuted, lineHeight: 1.75 }}>
                  {v.desc}
                </p>
              </Card>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px 72px" }}>
        <SectionHeader tag="Journey" title="Our milestones" />
        <div style={{ position: "relative", paddingLeft: 40 }}>
          <div style={{
            position: "absolute", left: 7, top: 0, bottom: 0, width: 2,
            background: `linear-gradient(to bottom, ${T.emerald}, transparent)`,
          }} />
          {TIMELINE.map((t, i) => (
            <FadeUp key={i} delay={i * 0.12}>
              <div style={{ position: "relative", marginBottom: 36 }}>
                <div style={{
                  position: "absolute", left: -40, top: 4,
                  width: 16, height: 16, borderRadius: "50%",
                  background: T.emerald, border: `3px solid ${T.bg}`,
                }} />
                <Tag color="emerald">{t.year}</Tag>
                <p style={{ fontFamily: fonts.body, fontSize: 15, color: T.textMuted, lineHeight: 1.75, marginTop: 8 }}>
                  {t.milestone}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{
        background: T.bgCard,
        borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
        padding: "72px 24px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <SectionHeader tag="Team" title="Built by believers" sub="Small team, enormous mission." />
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {/* Founder */}
            <FadeUp>
              <div style={{
                background: T.bg, border: `1px solid ${T.border}`, borderRadius: radius.xl,
                padding: "28px 32px", width: 240, textAlign: "center",
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", background: T.emeraldDark,
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                  fontFamily: fonts.heading, fontWeight: 700, fontSize: 22, color: "#0a140a",
                  border: `3px solid ${T.emerald}`,
                }}>
                  RD
                </div>
                <h3 style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 17, color: T.text }}>
                  Rishit Dev
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: 13, color: T.emeraldMid, marginTop: 4 }}>
                  Founder &amp; Developer
                </p>
                <p style={{
                  fontFamily: fonts.body, fontSize: 13, color: T.textMuted,
                  marginTop: 8, fontStyle: "italic", lineHeight: 1.65,
                }}>
                  "Building tech to solve India's waste problem."
                </p>
              </div>
            </FadeUp>

            {/* Join card */}
            <FadeUp delay={0.1}>
              <div style={{
                background: T.bg, border: "1px dashed rgba(34,197,94,0.3)", borderRadius: radius.xl,
                padding: "28px 32px", width: 240, textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
                <h3 style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 17, color: T.text }}>
                  Join Us!
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: 13, color: T.textMuted, marginTop: 8, lineHeight: 1.65 }}>
                  We're looking for passionate builders who care about the planet.
                </p>
                <div style={{ marginTop: 16 }}>
                  <Tag color="emerald">Open Roles</Tag>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "72px 24px" }}>
        <SectionHeader tag="FAQ" title="Frequently asked questions" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <FAQItem
                faq={faq}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: T.bgCard, borderTop: `1px solid ${T.border}`,
        padding: "72px 24px", textAlign: "center",
      }}>
        <FadeUp>
          <h2 style={{
            fontFamily: fonts.heading, fontWeight: 800,
            fontSize: "clamp(24px,4vw,40px)", color: T.text, marginBottom: 12,
          }}>
            Ready to start recycling?
          </h2>
          <p style={{
            fontFamily: fonts.body, fontSize: 16, color: T.textMuted,
            maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.75,
          }}>
            Whether you're a citizen, NGO, municipality, or investor — we'd love to talk.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn size="lg" variant="amber" onClick={() => navigate("pickup")}>
              Schedule a Pickup 🚛
            </Btn>
            <a href="mailto:hello@kabadiwala.app" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              <Btn size="lg" variant="ghost">📧 Contact us</Btn>
            </a>
          </div>
        </FadeUp>
      </section>

    </div>
  );
}
