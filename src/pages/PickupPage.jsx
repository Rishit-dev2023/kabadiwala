import { useState } from "react";
import { motion } from "framer-motion";
import { T, fonts, radius } from "../constants/tokens";
import { WASTE_TYPES, TIME_SLOTS } from "../constants/data";
import { useApp } from "../context/AppContext";
import { Btn, Tag, Card, GlowDot, FadeUp } from "../components/UI";

const TODAY = new Date().toISOString().split("T")[0];

function inputStyle(hasError) {
  return {
    width: "100%", padding: "12px 16px", borderRadius: radius.md,
    fontFamily: fonts.body, fontSize: 14,
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${hasError ? T.error : T.border}`,
    color: T.text, outline: "none", transition: "border-color 0.2s",
    appearance: "none", WebkitAppearance: "none",
  };
}

const labelStyle = {
  fontFamily: fonts.body, fontSize: 13, fontWeight: 600,
  color: T.textMuted, display: "block", marginBottom: 8, letterSpacing: "0.01em",
};

const errStyle = {
  fontFamily: fonts.body, fontSize: 12, color: T.error, marginTop: 4,
};

function FieldError({ msg }) {
  if (!msg) return null;
  return <p style={errStyle}>{msg}</p>;
}

function Field({ label, error, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      <FieldError msg={error} />
    </div>
  );
}

export default function PickupPage() {
  const { addPickup, pickups, user } = useApp();
  const [form, setForm]         = useState({ name: user?.name || "", address: "", wasteTypes: [], date: "", time: "", notes: "" });
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [apiError,  setApiError]  = useState(null);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const toggleWaste = (id) => {
    setForm(f => ({
      ...f,
      wasteTypes: f.wasteTypes.includes(id)
        ? f.wasteTypes.filter(w => w !== id)
        : [...f.wasteTypes, id],
    }));
    setErrors(e => ({ ...e, wasteTypes: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())            e.name       = "Full name is required.";
    if (!form.address.trim())         e.address    = "Pickup address is required.";
    if (form.wasteTypes.length === 0) e.wasteTypes = "Select at least one waste type.";
    if (!form.date)                   e.date       = "Please choose a date.";
    if (!form.time)                   e.time       = "Please choose a time slot.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError(null);

    const label = form.wasteTypes
      .map(id => WASTE_TYPES.find(w => w.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    // Optimistically update local state (always works)
    addPickup({ type: label, name: form.name, address: form.address, date: form.date, time: form.time });

    // Try to persist to MongoDB via API
    try {
      const res = await fetch("/api/pickup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          userEmail: user?.email || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.warn("API pickup save failed:", data?.error || res.statusText);
        // Non-blocking: local state already updated, just warn
      }
    } catch (err) {
      // Network error or API not deployed — non-blocking
      console.warn("Pickup API not reachable:", err.message);
    }

    setLoading(false);
    setSubmitted(true);
  };

  const resetForm = () => {
    setForm({ name: user?.name || "", address: "", wasteTypes: [], date: "", time: "", notes: "" });
    setErrors({});
    setSubmitted(false);
    setApiError(null);
  };

  const focusOn  = (e) => { e.target.style.borderColor = T.emerald; };
  const focusOff = (field, e) => { e.target.style.borderColor = errors[field] ? T.error : T.border; };

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{
        background: T.bgCard, borderBottom: `1px solid ${T.border}`,
        padding: "100px 24px 60px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <GlowDot top="0" left="30%" size={400} opacity={0.07} />
        <FadeUp>
          <Tag>🚛 Doorstep Collection</Tag>
          <h1 style={{
            fontFamily: fonts.heading, fontSize: "clamp(32px,5vw,52px)", fontWeight: 800,
            color: T.text, marginTop: 16, marginBottom: 12, letterSpacing: "-0.03em",
          }}>
            Schedule a Pickup
          </h1>
          <p style={{ fontFamily: fonts.body, fontSize: 16, color: T.textMuted, maxWidth: 480, margin: "0 auto" }}>
            Fill in your details and we'll dispatch a local Kabadiwala partner to your doorstep.
          </p>
        </FadeUp>
      </section>

      {/* Layout: Form + Sidebar */}
      <div
        className="pickup-layout"
        style={{
          maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px",
          display: "grid", gridTemplateColumns: "1fr minmax(300px, 380px)",
          gap: 32, alignItems: "start",
        }}
      >
        {/* ── FORM COLUMN ─────────────────────────────────────────────── */}
        <div>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{
                background: T.successBg, border: `1px solid rgba(16,217,126,0.2)`,
                borderRadius: radius.xl, padding: "48px 32px", textAlign: "center",
              }}
            >
              <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
              <h2 style={{
                fontFamily: fonts.heading, fontWeight: 700, fontSize: 26,
                color: T.text, marginBottom: 12, letterSpacing: "-0.02em",
              }}>
                Pickup Scheduled!
              </h2>
              <p style={{
                fontFamily: fonts.body, color: T.textMuted, fontSize: 15,
                lineHeight: 1.75, marginBottom: 28, maxWidth: 400, margin: "0 auto 28px",
              }}>
                Your pickup has been confirmed. You'll earn{" "}
                <strong style={{ color: T.amber }}>50 points</strong> once it's completed.
              </p>
              <Btn variant="primary" onClick={resetForm}>
                Schedule Another Pickup
              </Btn>
            </motion.div>
          ) : (
            <Card hover={false} style={{ padding: "32px 36px" }}>
              {apiError && (
                <div style={{
                  background: T.errorBg, border: `1px solid ${T.error}`, borderRadius: radius.md,
                  padding: "12px 16px", marginBottom: 20,
                  fontFamily: fonts.body, fontSize: 13, color: T.error,
                }}>
                  {apiError}
                </div>
              )}

              <div className="pickup-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Full Name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Full Name" error={errors.name}>
                    <input
                      placeholder="Your full name"
                      value={form.name}
                      onChange={e => set("name", e.target.value)}
                      onFocus={focusOn}
                      onBlur={e => focusOff("name", e)}
                      style={inputStyle(errors.name)}
                    />
                  </Field>
                </div>

                {/* Address */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Pickup Address" error={errors.address}>
                    <textarea
                      placeholder="House no., Street, Area, City"
                      value={form.address}
                      onChange={e => set("address", e.target.value)}
                      onFocus={focusOn}
                      onBlur={e => focusOff("address", e)}
                      style={{ ...inputStyle(errors.address), minHeight: 80, resize: "vertical" }}
                    />
                  </Field>
                </div>

                {/* Waste types */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>What are you recycling?</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {WASTE_TYPES.map(w => {
                      const selected = form.wasteTypes.includes(w.id);
                      return (
                        <button
                          key={w.id}
                          onClick={() => toggleWaste(w.id)}
                          style={{
                            padding: "8px 16px", borderRadius: radius.pill,
                            fontFamily: fonts.body, fontSize: 13, fontWeight: 500,
                            cursor: "pointer", transition: "all 0.2s",
                            background: selected ? "rgba(16,217,126,0.12)" : "rgba(255,255,255,0.03)",
                            border: `1px solid ${selected ? T.emerald : T.border}`,
                            color: selected ? T.emeraldMid : T.textMuted,
                          }}
                        >
                          {w.icon} {w.label}
                        </button>
                      );
                    })}
                  </div>
                  <FieldError msg={errors.wasteTypes} />
                </div>

                {/* Date */}
                <div>
                  <Field label="Preferred Date" error={errors.date}>
                    <input
                      type="date"
                      min={TODAY}
                      value={form.date}
                      onChange={e => set("date", e.target.value)}
                      onFocus={focusOn}
                      onBlur={e => focusOff("date", e)}
                      style={inputStyle(errors.date)}
                    />
                  </Field>
                </div>

                {/* Time slot */}
                <div>
                  <Field label="Preferred Time Slot" error={errors.time}>
                    <select
                      value={form.time}
                      onChange={e => set("time", e.target.value)}
                      onFocus={focusOn}
                      onBlur={e => focusOff("time", e)}
                      style={{ ...inputStyle(errors.time), cursor: "pointer" }}
                    >
                      <option value="">Select a slot</option>
                      {TIME_SLOTS.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Notes */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field label="Additional Notes (optional)">
                    <textarea
                      placeholder="Any special instructions for our team..."
                      value={form.notes}
                      onChange={e => set("notes", e.target.value)}
                      style={{ ...inputStyle(false), minHeight: 64, resize: "vertical" }}
                    />
                  </Field>
                </div>

                {/* Submit */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <Btn
                    size="lg" variant="amber" onClick={handleSubmit}
                    style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? "Scheduling…" : "Confirm Pickup — Earn 50 Points 🏆"}
                  </Btn>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Why us */}
          <Card hover={false}>
            <h3 style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 16, letterSpacing: "-0.01em" }}>
              Why schedule with us?
            </h3>
            {[
              { icon: "🎁", t: "Earn 50 points per pickup",       s: "Redeem for real rewards" },
              { icon: "⏱️", t: "Same-week scheduling",            s: "Quick turnaround" },
              { icon: "🌍", t: "Certified recycling partners",    s: "Responsible disposal" },
              { icon: "📊", t: "Track your environmental impact", s: "CO₂ and tree data" },
            ].map(({ icon, t, s }) => (
              <div key={t} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: "rgba(16,217,126,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>
                  {icon}
                </div>
                <div>
                  <p style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 14, color: T.text }}>{t}</p>
                  <p style={{ fontFamily: fonts.body, fontSize: 12, color: T.textMuted }}>{s}</p>
                </div>
              </div>
            ))}
          </Card>

          {/* Recent pickups */}
          {pickups.length > 0 && (
            <Card hover={false}>
              <h3 style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 16, color: T.text, marginBottom: 16, letterSpacing: "-0.01em" }}>
                Recent Pickups
              </h3>
              {pickups.slice(0, 3).map(p => (
                <div key={p.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
                  <p style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 13, color: T.text }}>{p.type}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontFamily: fonts.body, fontSize: 12, color: T.textMuted }}>{p.date}</span>
                    <span style={{
                      fontFamily: fonts.body, fontSize: 12, fontWeight: 600,
                      color: p.status === "Completed" ? T.emeraldMid : T.amber,
                    }}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
