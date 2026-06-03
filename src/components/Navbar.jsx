import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { T, fonts } from "../constants/tokens";
import { NAV_ITEMS } from "../constants/data";
import { useRoute } from "../context/RouteContext";
import { useApp } from "../context/AppContext";
import { Btn } from "./UI";

export default function Navbar() {
  const { page, navigate }                        = useRoute();
  const { user, setUser, logout, setAuthLoading, setAuthError } = useApp();
  const { points }                                = useApp();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [page]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Fetch user profile after OAuth success
  const fetchProfile = async (tokenResponse) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const profile = await res.json();
      setUser({
        ...profile,
        access_token: tokenResponse.access_token,
      });
      setAuthError(null);
    } catch (err) {
      setAuthError("Failed to sign in. Please try again.");
      console.error("Google sign-in error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAuthLoading(true);
      fetchProfile(tokenResponse);
    },
    onError: (err) => {
      setAuthError("Google sign-in was cancelled or failed.");
      setAuthLoading(false);
      console.error("OAuth error:", err);
    },
  });

  const handleSignIn = () => {
    setAuthError(null);
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      alert("Google OAuth not configured. Add VITE_GOOGLE_CLIENT_ID to your .env file.");
      return;
    }
    googleLogin();
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
        background: scrolled ? "rgba(13,17,23,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", height: 68, gap: 40,
        }}>
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0,
            }}
            aria-label="Kabadiwala home"
          >
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(16,217,126,0.12)", border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>
              ♻️
            </div>
            <span style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 17, color: T.text, letterSpacing: "-0.01em" }}>
              Kabadiwala
            </span>
          </button>

          {/* Desktop nav */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                style={{
                  fontFamily: fonts.body, fontSize: 14, fontWeight: 500,
                  padding: "6px 14px", borderRadius: 100, border: "none", cursor: "pointer",
                  transition: "all 0.2s",
                  background: page === item.page ? "rgba(16,217,126,0.1)" : "transparent",
                  color:      page === item.page ? T.emeraldMid : "rgba(232,244,241,0.55)",
                }}
                onMouseEnter={e => { if (page !== item.page) e.currentTarget.style.color = T.text; }}
                onMouseLeave={e => { if (page !== item.page) e.currentTarget.style.color = "rgba(232,244,241,0.55)"; }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(245,158,11,0.08)", border: `1px solid ${T.borderAmt}`,
                borderRadius: 100, padding: "6px 14px",
              }}>
                <span style={{ fontSize: 13 }}>🏆</span>
                <span style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 600, color: T.amber }}>
                  {points} pts
                </span>
              </div>
            )}

            {user ? (
              <div ref={profileRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "none", border: "none", cursor: "pointer", padding: 4,
                  }}
                  aria-label="Profile menu"
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.given_name}
                      style={{
                        width: 34, height: 34, borderRadius: "50%",
                        border: `2px solid ${T.emerald}`, objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%", background: T.emeraldDark,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: fonts.heading, fontWeight: 700, fontSize: 14, color: "#0d1117",
                      border: `2px solid ${T.emerald}`,
                    }}>
                      {user.given_name?.[0] ?? "U"}
                    </div>
                  )}
                  <span className="desktop-only-name" style={{ fontFamily: fonts.body, fontSize: 13, color: T.textMuted }}>
                    {user.given_name}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Profile dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: 200,
                        background: T.bgCard, border: `1px solid ${T.border}`,
                        borderRadius: 12, overflow: "hidden", zIndex: 200,
                        backdropFilter: "blur(20px)", boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                      }}
                    >
                      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
                        <p style={{ fontFamily: fonts.body, fontSize: 13, fontWeight: 600, color: T.text }}>
                          {user.name}
                        </p>
                        <p style={{ fontFamily: fonts.body, fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        style={{
                          width: "100%", padding: "10px 16px", textAlign: "left",
                          fontFamily: fonts.body, fontSize: 13, color: "#ef4444",
                          background: "transparent", border: "none", cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Btn size="sm" variant="ghost" onClick={handleSignIn} style={{ borderColor: T.border }}>
                Sign in with Google
              </Btn>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="mobile-menu-btn"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              style={{ background: "none", border: "none", cursor: "pointer", color: T.text, padding: 4, display: "none" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: "rgba(13,17,23,0.97)", backdropFilter: "blur(20px)",
                borderTop: `1px solid ${T.border}`, overflow: "hidden",
              }}
            >
              <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.page}
                    onClick={() => navigate(item.page)}
                    style={{
                      fontFamily: fonts.body, fontSize: 15, fontWeight: 500,
                      padding: "12px 16px", borderRadius: 12, border: "none",
                      cursor: "pointer", textAlign: "left",
                      background: page === item.page ? "rgba(16,217,126,0.08)" : "transparent",
                      color:      page === item.page ? T.emeraldMid : T.textMuted,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
                {!user && (
                  <button
                    onClick={() => { setMobileOpen(false); handleSignIn(); }}
                    style={{
                      fontFamily: fonts.body, fontSize: 14, fontWeight: 600,
                      padding: "12px 16px", borderRadius: 12,
                      border: `1px solid ${T.border}`, background: "transparent",
                      color: T.text, cursor: "pointer", textAlign: "left", marginTop: 8,
                    }}
                  >
                    Sign in with Google
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
