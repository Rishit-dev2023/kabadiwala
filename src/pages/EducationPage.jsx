import { useState } from "react";
import { T, fonts, radius } from "../constants/tokens";
import { Btn, Tag, Card, GlowDot, SectionHeader, FadeUp } from "../components/UI";

const BINS = [
  { color: "#22c55e", label: "Green – Wet Waste",   items: ["Food scraps", "Vegetable peels", "Fruit rinds", "Leftover food", "Garden clippings"], desc: "Organic / biodegradable waste." },
  { color: "#3b82f6", label: "Blue – Dry Waste",    items: ["Paper", "Cardboard", "Plastic bottles", "Metal cans", "Glass"], desc: "Recyclable dry materials." },
  { color: "#ef4444", label: "Red – Hazardous",     items: ["Batteries", "E-waste", "Paint cans", "Medicine", "CFL bulbs"], desc: "Requires special disposal." },
  { color: "#f59e0b", label: "Yellow – Sanitary",   items: ["Used masks", "Diapers", "Sanitary pads", "Bandages"], desc: "Non-recyclable sanitary waste." },
];

const FACTS = [
  { icon: "📄", stat: "1 tonne",     desc: "of recycled paper saves 17 trees and 26,500 litres of water." },
  { icon: "🧴", stat: "450 years",   desc: "is how long a plastic bottle takes to break down in nature." },
  { icon: "💻", stat: "₹1L crore",   desc: "worth of recyclables go unrecovered every year in India." },
  { icon: "🔋", stat: "80%",         desc: "of an EV battery can be recycled and reused." },
  { icon: "🌳", stat: "26 million",  desc: "trees could be saved annually if India recycled all its paper." },
  { icon: "💡", stat: "6 hrs",       desc: "of LED power from one recycled glass bottle's energy savings." },
];

const QUIZZES = [
  { q: "Where does used newspaper go?",            opts: ["Green bin", "Blue bin", "Red bin", "Yellow bin"],     ans: 1 },
  { q: "Dead batteries should go in:",             opts: ["Green bin", "Blue bin", "Red bin", "Black bag"],      ans: 2 },
  { q: "Which item is NOT recyclable?",            opts: ["Cardboard", "Plastic bottle", "Oily pizza box", "Aluminium can"], ans: 2 },
  { q: "Plastic takes how long to decompose?",     opts: ["20 years", "100 years", "450 years", "1000 years"],   ans: 2 },
  { q: "How many points does a Kabadiwala pickup earn?", opts: ["10", "25", "50", "100"],                        ans: 2 },
];

function QuizOption({ opt, idx, quizAns, correctAns, onAnswer }) {
  let bg     = "rgba(255,255,255,0.04)";
  let border = T.border;
  let color  = T.textMuted;

  if (quizAns !== null) {
    if (idx === correctAns)  { bg = "rgba(34,197,94,0.15)";  border = T.emerald; color = T.emeraldMid; }
    else if (idx === quizAns){ bg = "rgba(239,68,68,0.12)"; border = T.error;   color = "#fca5a5"; }
  }

  return (
    <button
      onClick={() => onAnswer(idx)}
      style={{
        padding: "13px 16px", borderRadius: radius.md,
        fontFamily: fonts.body, fontSize: 14, fontWeight: 500,
        cursor: quizAns !== null ? "default" : "pointer",
        textAlign: "left", transition: "all 0.2s",
        background: bg, border: `1px solid ${border}`, color,
      }}
    >
      {opt}
    </button>
  );
}

export default function EducationPage() {
  const [quizIdx,   setQuizIdx]   = useState(0);
  const [quizAns,   setQuizAns]   = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone,  setQuizDone]  = useState(false);

  const currentQ = QUIZZES[quizIdx];

  const handleAnswer = (i) => {
    if (quizAns !== null) return;
    setQuizAns(i);
    if (i === currentQ.ans) setQuizScore(s => s + 1);
    setTimeout(() => {
      if (quizIdx + 1 >= QUIZZES.length) {
        setQuizDone(true);
      } else {
        setQuizIdx(q => q + 1);
        setQuizAns(null);
      }
    }, 1300);
  };

  const resetQuiz = () => {
    setQuizIdx(0); setQuizAns(null); setQuizScore(0); setQuizDone(false);
  };

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{
        background: T.bgCard, borderBottom: `1px solid ${T.border}`,
        padding: "100px 24px 60px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <GlowDot top="0" right="20%" size={400} opacity={0.07} color="#38bdf8" />
        <FadeUp>
          <Tag>📚 Waste Education</Tag>
          <h1 style={{
            fontFamily: fonts.heading, fontSize: "clamp(32px,5vw,52px)", fontWeight: 800,
            color: T.text, marginTop: 16, marginBottom: 12,
          }}>
            Learn &amp; Segregate
          </h1>
          <p style={{ fontFamily: fonts.body, fontSize: 16, color: T.textMuted, maxWidth: 520, margin: "0 auto" }}>
            Master waste segregation with color-coded guides, recycling facts, and an interactive quiz.
          </p>
        </FadeUp>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* ── BIN GUIDE ─────────────────────────────────────────────── */}
        <SectionHeader
          tag="Segregation Guide"
          title="Which bin does it go in?"
          sub="India's national color-coding system for waste segregation."
        />
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20, marginBottom: 80,
        }}>
          {BINS.map((b, i) => (
            <FadeUp key={b.label} delay={i * 0.1}>
              <div style={{
                background: T.bgCard, border: `1px solid ${b.color}30`,
                borderTop: `3px solid ${b.color}`,
                borderRadius: radius.lg, padding: "24px 20px", height: "100%",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: `${b.color}20`, border: `2px solid ${b.color}40`,
                  marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: b.color }} />
                </div>
                <h3 style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 15, color: b.color, marginBottom: 6 }}>
                  {b.label}
                </h3>
                <p style={{ fontFamily: fonts.body, fontSize: 13, color: T.textMuted, marginBottom: 14 }}>
                  {b.desc}
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {b.items.map(item => (
                    <li key={item} style={{
                      fontFamily: fonts.body, fontSize: 13, color: "rgba(134,239,172,0.7)",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: b.color, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* ── RECYCLING FACTS ───────────────────────────────────────── */}
        <SectionHeader tag="Recycling Facts" title="Numbers that matter" />
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16, marginBottom: 80,
        }}>
          {FACTS.map((f, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div style={{
                background: T.bgCard, border: `1px solid ${T.border}`,
                borderRadius: radius.lg, padding: "20px 24px",
                display: "flex", gap: 16, alignItems: "flex-start",
              }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <p style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 20, color: T.emeraldMid, marginBottom: 4 }}>
                    {f.stat}
                  </p>
                  <p style={{ fontFamily: fonts.body, fontSize: 14, color: T.textMuted, lineHeight: 1.65 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* ── QUIZ ──────────────────────────────────────────────────── */}
        <SectionHeader
          tag="Quick Quiz"
          title="Test your knowledge"
          sub="5 questions on waste segregation and recycling in India."
        />
        <Card hover={false} style={{ maxWidth: 600, margin: "0 auto", padding: "36px 40px" }}>
          {quizDone ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                {quizScore >= 4 ? "🏆" : quizScore >= 3 ? "🌱" : "📖"}
              </div>
              <h3 style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 22, color: T.text, marginBottom: 8 }}>
                You scored {quizScore} / {QUIZZES.length}
              </h3>
              <p style={{ fontFamily: fonts.body, fontSize: 15, color: T.textMuted, marginBottom: 28 }}>
                {quizScore >= 4
                  ? "Excellent! You're a recycling expert."
                  : "Keep learning — you're getting there!"}
              </p>
              <Btn variant="primary" onClick={resetQuiz}>Try Again</Btn>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <Tag color="dim">Question {quizIdx + 1} of {QUIZZES.length}</Tag>
                <Tag color="amber">Score: {quizScore}</Tag>
              </div>
              <p style={{
                fontFamily: fonts.heading, fontWeight: 600, fontSize: 18,
                color: T.text, marginBottom: 24, lineHeight: 1.4,
              }}>
                {currentQ.q}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {currentQ.opts.map((opt, i) => (
                  <QuizOption
                    key={i} opt={opt} idx={i}
                    quizAns={quizAns} correctAns={currentQ.ans}
                    onAnswer={handleAnswer}
                  />
                ))}
              </div>
            </>
          )}
        </Card>

      </div>
    </div>
  );
}
