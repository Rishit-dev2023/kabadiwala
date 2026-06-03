import { T, fonts } from "../constants/tokens";
import { useRoute } from "../context/RouteContext";

export default function Footer() {
  const { navigate } = useRoute();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: T.bg, borderTop: `1px solid ${T.border}`, padding: "48px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40, marginBottom: 48,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 22 }}>♻️</span>
              <span style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 18, color: T.text }}>
                Kabadiwala
              </span>
            </div>
            <p style={{ fontFamily: fonts.body, fontSize: 14, color: T.textMuted, lineHeight: 1.7, maxWidth: 260 }}>
              Modernising India's oldest recycling tradition with technology, gamification, and community power.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <p style={{
              fontFamily: fonts.heading, fontWeight: 600, fontSize: 13, color: T.textDim,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16,
            }}>
              Platform
            </p>
            {["home", "pickup", "education", "rewards"].map(p => (
              <button
                key={p}
                onClick={() => navigate(p)}
                style={{
                  display: "block", fontFamily: fonts.body, fontSize: 14, color: T.textMuted,
                  background: "none", border: "none", cursor: "pointer", padding: "4px 0",
                  textTransform: "capitalize", transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = T.text}
                onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Company links */}
          <div>
            <p style={{
              fontFamily: fonts.heading, fontWeight: 600, fontSize: 13, color: T.textDim,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16,
            }}>
              Company
            </p>
            <button
              onClick={() => navigate("about")}
              style={{
                display: "block", fontFamily: fonts.body, fontSize: 14, color: T.textMuted,
                background: "none", border: "none", cursor: "pointer", padding: "4px 0",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = T.text}
              onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
            >
              About
            </button>
            <a
              href="mailto:hello@kabadiwala.app"
              style={{
                display: "block", fontFamily: fonts.body, fontSize: 14, color: T.textMuted,
                textDecoration: "none", padding: "4px 0", transition: "color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = T.text}
              onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
            >
              Contact
            </a>
          </div>

          {/* Reach */}
          <div>
            <p style={{
              fontFamily: fonts.heading, fontWeight: 600, fontSize: 13, color: T.textDim,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16,
            }}>
              Reach
            </p>
            <p style={{ fontFamily: fonts.body, fontSize: 13, color: T.textMuted, lineHeight: 1.7 }}>
              Operational in Bhubaneswar.<br />Expanding to 10 cities by 2027.
            </p>
          </div>
        </div>

        <div style={{
          borderTop: `1px solid ${T.border}`, paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ fontFamily: fonts.body, fontSize: 13, color: T.textSubtle }}>
            © {year} Kabadiwala. Built with purpose.
          </p>
          <a
            href="https://github.com/Rishit-dev2023/Kabadiwala"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: fonts.body, fontSize: 13, color: T.textSubtle,
              textDecoration: "none", transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = T.textMuted}
            onMouseLeave={e => e.currentTarget.style.color = T.textSubtle}
          >
            GitHub →
          </a>
        </div>
      </div>
    </footer>
  );
}
