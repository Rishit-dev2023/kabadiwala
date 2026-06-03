import { useState, useRef, useCallback, useEffect } from "react";
import { T, fonts, radius } from "../constants/tokens";
import { useApp } from "../context/AppContext";
import { Btn, Tag, Card, GlowDot, FadeUp } from "../components/UI";

// ─── Constants ────────────────────────────────────────────────────────────────

const WASTE_CATEGORIES = ["dry", "wet", "hazardous", "e-waste", "recyclable", "organic"];

const CATEGORY_COLORS = {
  dry: "#38bdf8",
  wet: "#34d399",       // T.emerald equivalent
  hazardous: "#f87171",
  "e-waste": "#a78bfa",
  recyclable: "#fbbf24", // T.amber equivalent
  organic: "#86efac",
};

const CATEGORY_ICONS = {
  dry: "📦",
  wet: "💧",
  hazardous: "☢️",
  "e-waste": "💻",
  recyclable: "♻️",
  organic: "🌿",
};

// ─── Gemini API ───────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the Kabadiwala AI Waste Scanner for an Indian recycling platform.
Analyze the provided image for waste items and classify them into exactly these 6 categories:
dry | wet | hazardous | e-waste | recyclable | organic

Respond ONLY with a valid JSON object and absolutely nothing else — no markdown, no backticks, no explanation:
{
  "items": [
    {"name": "item name in English", "category": "dry|wet|hazardous|e-waste|recyclable|organic", "confidence": 0-100}
  ],
  "segregation_score": 0-100,
  "segregation_quality": "excellent|good|fair|poor",
  "is_mixed": true,
  "points_awarded": 0,
  "breakdown": {
    "base_points": 0,
    "segregation_bonus": 0,
    "category_bonus": 0,
    "mixed_penalty": 0
  },
  "recommendation": "1-2 sentence actionable tip for better waste management",
  "environmental_impact": "Saves X trees or reduces Y kg CO2"
}

SCORING RULES (apply exactly):
- Base: 20 points per correctly identified waste item
- Segregated e-waste (only e-waste in frame): +30 bonus
- Segregated hazardous (only hazardous in frame): +25 bonus
- AI confidence >= 85% on any item: +5 bonus per such item
- Proper segregation (all items same category): +10 bonus
- Mixed contaminated waste (2+ incompatible categories): -15 penalty
- Minimum points_awarded is 0 (never negative)

If no waste items are visible, return: items=[], segregation_score=0, segregation_quality="poor", is_mixed=false, points_awarded=0, breakdown all zeros, recommendation="No waste detected. Please ensure items are clearly visible in the frame.", environmental_impact="No impact calculated"`;

async function callGemini(base64Data, mimeType = "image/jpeg") {
  const key = import.meta.env.VITE_GEMINI_KEY;

  if (!key) {
    throw new Error("VITE_GEMINI_KEY environment variable is not set. Add it to your .env file.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data,
            },
          },
          { text: SYSTEM_PROMPT },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };

  let res;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    throw new Error("Network error — check your internet connection and try again.");
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const msg = errBody?.error?.message || `API error ${res.status}`;
    if (res.status === 400) throw new Error(`Invalid request: ${msg}`);
    if (res.status === 403) throw new Error("Invalid Gemini API key. Check VITE_GEMINI_KEY.");
    if (res.status === 429) throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    throw new Error(`Gemini API error: ${msg}`);
  }

  const data = await res.json();

  // Handle safety blocks
  const candidate = data.candidates?.[0];
  if (!candidate) {
    throw new Error("No response from Gemini. The image may have been blocked by safety filters.");
  }
  if (candidate.finishReason === "SAFETY") {
    throw new Error("Image was blocked by Gemini safety filters. Try a different photo.");
  }
  if (candidate.finishReason === "RECITATION") {
    throw new Error("Gemini refused to process this image. Try a different photo.");
  }

  // Extract text from all parts
  const rawText = (candidate.content?.parts || [])
    .filter((p) => p.type === "text" || typeof p.text === "string")
    .map((p) => p.text || "")
    .join("")
    .trim();

  if (!rawText) {
    throw new Error("Empty response from Gemini API.");
  }

  // Strip markdown fences robustly
  const clean = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Find the JSON object — handle cases where model prepends/appends text
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Gemini returned an unexpected response format. Please try again.");
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Failed to parse Gemini's response. Please try again.");
  }

  // Validate and sanitize the response
  return sanitizeResult(parsed);
}

function sanitizeResult(raw) {
  const items = Array.isArray(raw.items)
    ? raw.items.map((item) => ({
        name: String(item.name || "Unknown item"),
        category: WASTE_CATEGORIES.includes(item.category) ? item.category : "dry",
        confidence: Math.min(100, Math.max(0, Number(item.confidence) || 0)),
      }))
    : [];

  const breakdown = {
    base_points: Math.max(0, Number(raw.breakdown?.base_points) || 0),
    segregation_bonus: Math.max(0, Number(raw.breakdown?.segregation_bonus) || 0),
    category_bonus: Math.max(0, Number(raw.breakdown?.category_bonus) || 0),
    mixed_penalty: Math.min(0, Number(raw.breakdown?.mixed_penalty) || 0),
  };

  return {
    items,
    segregation_score: Math.min(100, Math.max(0, Number(raw.segregation_score) || 0)),
    segregation_quality: ["excellent", "good", "fair", "poor"].includes(raw.segregation_quality)
      ? raw.segregation_quality
      : "fair",
    is_mixed: Boolean(raw.is_mixed),
    points_awarded: Math.max(0, Number(raw.points_awarded) || 0),
    breakdown,
    recommendation: String(raw.recommendation || "Keep segregating your waste — every item counts!"),
    environmental_impact: String(raw.environmental_impact || "Environmental impact calculated."),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const color = score >= 80 ? "#10d97e" : score >= 50 ? "#fbbf24" : "#f87171";
  const circumference = 2 * Math.PI * 34;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
      <svg width="88" height="88" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="44" cy="44" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <circle
          cx="44"
          cy="44"
          r="34"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: 22,
            color,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span style={{ fontFamily: fonts.body, fontSize: 10, color: T.textMuted, marginTop: 2 }}>
          / 100
        </span>
      </div>
    </div>
  );
}

function QualityBadge({ quality }) {
  const config = {
    excellent: { bg: "rgba(16,217,126,0.12)", border: "rgba(16,217,126,0.3)", color: "#10d97e", icon: "🌟" },
    good: { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.3)", color: "#fbbf24", icon: "✅" },
    fair: { bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.3)", color: "#fb923c", icon: "⚠️" },
    poor: { bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", color: "#f87171", icon: "❌" },
  };
  const c = config[quality] || config.fair;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 100,
        background: c.bg,
        border: `1px solid ${c.border}`,
        fontFamily: fonts.body,
        fontSize: 11,
        fontWeight: 600,
        color: c.color,
      }}
    >
      {c.icon} {quality.charAt(0).toUpperCase() + quality.slice(1)}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ScannerPage() {
  const { addPickup } = useApp();
  const [phase, setPhase] = useState("idle"); // idle | camera | analyzing | result | error
  const [previewSrc, setPreviewSrc] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const streamRef = useRef(null); // Use ref instead of state to avoid stale closures
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const openCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setPhase("camera");
      // RAF ensures the video element has mounted before we assign srcObject
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {}); // autoplay policy — safe to swallow
          }
        });
      });
    } catch (err) {
      const msg =
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera permission denied. Please allow camera access in your browser settings and try again."
          : err.name === "NotFoundError"
          ? "No camera found on this device. Try uploading a photo instead."
          : err.name === "NotReadableError"
          ? "Camera is in use by another app. Close other apps and try again."
          : "Camera unavailable. Try uploading a photo instead.";
      setError(msg);
      setPhase("idle");
    }
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(video, 0, 0, w, h);

    // Stop stream BEFORE converting — releases camera indicator sooner
    stopStream();

    const fullDataUrl = canvas.toDataURL("image/jpeg", 0.85);
    const base64 = fullDataUrl.split(",")[1];
    setPreviewSrc(fullDataUrl);
    analyze(base64, "image/jpeg");
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WEBP, etc.)");
      return;
    }
    // Validate file size (max 10MB for Gemini)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large. Please use an image under 10MB.");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const full = ev.target.result;
      const base64 = full.split(",")[1];
      setPreviewSrc(full);
      analyze(base64, file.type);
    };
    reader.onerror = () => setError("Failed to read the image file. Please try again.");
    reader.readAsDataURL(file);
  };

  const analyze = async (base64, mimeType = "image/jpeg") => {
    setPhase("analyzing");
    setResult(null);
    setError(null);

    try {
      const json = await callGemini(base64, mimeType);

      // Award points via AppContext
      if (json.points_awarded > 0) {
        addPickup({
          type: json.items?.map((i) => i.name).join(", ") || "Scanned Waste",
          source: "ai-scanner",
          segregationScore: json.segregation_score,
          points: json.points_awarded,           // primary field
          pointsAwarded: json.points_awarded,    // backward compat alias
          items: json.items,
          timestamp: new Date().toISOString(),
        });
      }

      setResult(json);
      setPhase("result");
    } catch (err) {
      console.error("[Kabadiwala Scanner]", err);
      setError(err.message || "Analysis failed. Please try again.");
      setPhase("error");
    }
  };

  const reset = () => {
    stopStream();
    setPhase("idle");
    setPreviewSrc(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      {/* Spinner keyframe injected once */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes scanline {
          0% { transform: translateY(0); opacity: 0.6; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section
        style={{
          background: T.bgCard,
          borderBottom: `1px solid ${T.border}`,
          padding: "100px 24px 60px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GlowDot top="0" left="30%" size={400} opacity={0.08} color={T.purple} />
        <FadeUp>
          <Tag color="purple">🔬 AI Feature</Tag>
          <h1
            style={{
              fontFamily: fonts.heading,
              fontSize: "clamp(32px,5vw,52px)",
              fontWeight: 800,
              color: T.text,
              marginTop: 16,
              marginBottom: 12,
              letterSpacing: "-0.03em",
            }}
          >
            WasteVision Scanner
          </h1>
          <p
            style={{
              fontFamily: fonts.body,
              fontSize: 16,
              color: T.textMuted,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Point your camera at any waste item. AI identifies it across 6 categories, scores
            your segregation, and awards points instantly.
          </p>
        </FadeUp>
      </section>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── IDLE ──────────────────────────────────────────────────── */}
        {phase === "idle" && (
          <FadeUp>
            <Card hover={false} style={{ textAlign: "center", padding: "48px 32px" }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🗑️</div>
              <h2
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 700,
                  fontSize: 22,
                  color: T.text,
                  marginBottom: 12,
                }}
              >
                Scan your waste
              </h2>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: 14,
                  color: T.textMuted,
                  lineHeight: 1.75,
                  marginBottom: 32,
                }}
              >
                Place waste items in a clear, well-lit area, then scan to get your segregation
                score and earn reward points.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Btn
                  size="lg"
                  variant="primary"
                  onClick={openCamera}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  📷 Open Camera
                </Btn>
                <Btn
                  size="lg"
                  variant="ghost"
                  onClick={() => fileRef.current?.click()}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  📤 Upload a Photo
                </Btn>
                {/* No capture="environment" — that would open camera, not gallery */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/*"
                  style={{ display: "none" }}
                  onChange={handleFile}
                />
              </div>
            </Card>

            {/* Category legend */}
            <div style={{ marginTop: 20 }}>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                6 Waste Categories
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {WASTE_CATEGORIES.map((cat) => (
                  <div
                    key={cat}
                    style={{
                      padding: "10px 12px",
                      background: (CATEGORY_COLORS[cat] || "#10d97e") + "0d",
                      border: `1px solid ${CATEGORY_COLORS[cat] || "#10d97e"}30`,
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{CATEGORY_ICONS[cat]}</span>
                    <span
                      style={{
                        fontFamily: fonts.body,
                        fontSize: 12,
                        fontWeight: 600,
                        color: CATEGORY_COLORS[cat] || "#10d97e",
                        textTransform: "capitalize",
                      }}
                    >
                      {cat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: "💡", tip: "Good lighting gives better results" },
                { icon: "📦", tip: "Separate items before scanning" },
                { icon: "🎯", tip: "Fill the frame with waste items" },
                { icon: "🏆", tip: "E-waste earns the most points" },
              ].map(({ icon, tip }) => (
                <div
                  key={tip}
                  style={{
                    padding: "12px 14px",
                    background: "rgba(16,217,126,0.03)",
                    border: `1px solid ${T.border}`,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <p style={{ fontFamily: fonts.body, fontSize: 12, color: T.textMuted }}>
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        )}

        {/* ── CAMERA ────────────────────────────────────────────────── */}
        {phase === "camera" && (
          <FadeUp>
            <div
              style={{
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                background: "#000",
                marginBottom: 20,
                aspectRatio: "4/3",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  objectFit: "cover",
                }}
              />
              {/* Scanner overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                }}
              >
                {/* Corner brackets */}
                {[
                  { top: 16, left: 16, borderTop: `3px solid #10d97e`, borderLeft: `3px solid #10d97e` },
                  { top: 16, right: 16, borderTop: `3px solid #10d97e`, borderRight: `3px solid #10d97e` },
                  { bottom: 60, left: 16, borderBottom: `3px solid #10d97e`, borderLeft: `3px solid #10d97e` },
                  { bottom: 60, right: 16, borderBottom: `3px solid #10d97e`, borderRight: `3px solid #10d97e` },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{ position: "absolute", width: 28, height: 28, ...s }}
                  />
                ))}
                {/* Animated scan line */}
                <div
                  style={{
                    position: "absolute",
                    top: "20%",
                    left: 16,
                    right: 16,
                    height: 2,
                    background: "linear-gradient(90deg, transparent, #10d97e, transparent)",
                    animation: "scanline 2s ease-in-out infinite",
                  }}
                />
                {/* Bottom label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 100,
                    padding: "6px 16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <p style={{ fontFamily: fonts.body, fontSize: 12, color: "#10d97e" }}>
                    Point camera at waste items
                  </p>
                </div>
              </div>
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div style={{ display: "flex", gap: 12 }}>
              <Btn
                size="lg"
                variant="primary"
                onClick={capture}
                style={{ flex: 1, justifyContent: "center" }}
              >
                📸 Capture & Analyze
              </Btn>
              <Btn
                size="lg"
                variant="ghost"
                onClick={reset}
                style={{ padding: "13px 22px", aspectRatio: "1" }}
              >
                ✕
              </Btn>
            </div>
          </FadeUp>
        )}

        {/* ── ANALYZING ─────────────────────────────────────────────── */}
        {phase === "analyzing" && (
          <FadeUp>
            {previewSrc && (
              <img
                src={previewSrc}
                alt="Analyzing…"
                style={{
                  width: "100%",
                  borderRadius: 24,
                  marginBottom: 20,
                  opacity: 0.5,
                  maxHeight: "40vh",
                  objectFit: "cover",
                }}
              />
            )}
            <Card hover={false} style={{ textAlign: "center", padding: "40px 32px" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: `4px solid #10d97e`,
                  borderTopColor: "transparent",
                  animation: "spin 0.9s linear infinite",
                  margin: "0 auto 20px",
                }}
              />
              <h3
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 700,
                  fontSize: 18,
                  color: T.text,
                  marginBottom: 10,
                }}
              >
                AI analyzing your waste…
              </h3>
              <p style={{ fontFamily: fonts.body, fontSize: 14, color: T.textMuted }}>
                Detecting items · Scoring segregation · Calculating points
              </p>
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 6 }}>
                {[0, 0.2, 0.4].map((delay) => (
                  <div
                    key={delay}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#10d97e",
                      animation: `pulse 1.2s ease-in-out ${delay}s infinite`,
                    }}
                  />
                ))}
              </div>
            </Card>
          </FadeUp>
        )}

        {/* ── ERROR ─────────────────────────────────────────────────── */}
        {phase === "error" && (
          <FadeUp>
            {previewSrc && (
              <img
                src={previewSrc}
                alt="Error"
                style={{
                  width: "100%",
                  borderRadius: 24,
                  marginBottom: 20,
                  opacity: 0.3,
                  maxHeight: "30vh",
                  objectFit: "cover",
                  filter: "grayscale(100%)",
                }}
              />
            )}
            <Card
              hover={false}
              style={{
                background: "rgba(239,68,68,0.05)",
                borderColor: "rgba(239,68,68,0.2)",
                textAlign: "center",
                padding: "36px 28px",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
              <h3
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 700,
                  fontSize: 18,
                  color: T.text,
                  marginBottom: 10,
                }}
              >
                Analysis Failed
              </h3>
              <p
                style={{
                  fontFamily: fonts.body,
                  fontSize: 14,
                  color: "#f87171",
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                {error}
              </p>
              <Btn
                size="lg"
                variant="primary"
                onClick={reset}
                style={{ width: "100%", justifyContent: "center" }}
              >
                🔄 Try Again
              </Btn>
            </Card>
          </FadeUp>
        )}

        {/* ── RESULT ────────────────────────────────────────────────── */}
        {phase === "result" && result && (
          <FadeUp>
            {previewSrc && (
              <img
                src={previewSrc}
                alt="Scanned waste"
                style={{
                  width: "100%",
                  borderRadius: 24,
                  marginBottom: 20,
                  maxHeight: "35vh",
                  objectFit: "cover",
                }}
              />
            )}

            {/* Score card */}
            <Card
              hover={false}
              style={{
                marginBottom: 16,
                background: `linear-gradient(135deg, rgba(16,217,126,0.06), rgba(16,217,126,0.02))`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <ScoreRing score={result.segregation_score} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <QualityBadge quality={result.segregation_quality} />
                    {result.is_mixed && (
                      <span
                        style={{
                          fontFamily: fonts.body,
                          fontSize: 11,
                          color: "#f87171",
                          background: "rgba(248,113,113,0.1)",
                          border: "1px solid rgba(248,113,113,0.25)",
                          borderRadius: 100,
                          padding: "2px 8px",
                        }}
                      >
                        Mixed waste
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontFamily: fonts.heading,
                      fontWeight: 700,
                      fontSize: 24,
                      color: T.amber || "#fbbf24",
                      marginTop: 6,
                    }}
                  >
                    +{result.points_awarded} pts 🏆
                  </p>
                  <p style={{ fontFamily: fonts.body, fontSize: 13, color: T.textMuted, marginTop: 4 }}>
                    🌍 {result.environmental_impact}
                  </p>
                </div>
              </div>

              {/* Points breakdown */}
              {result.breakdown && (
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 16,
                    borderTop: `1px solid ${T.border}`,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                    gap: 8,
                  }}
                >
                  {[
                    { label: "Base", val: result.breakdown.base_points, color: "#38bdf8" },
                    {
                      label: "Bonus",
                      val: result.breakdown.segregation_bonus + result.breakdown.category_bonus,
                      color: "#10d97e",
                    },
                    ...(result.breakdown.mixed_penalty < 0
                      ? [{ label: "Penalty", val: result.breakdown.mixed_penalty, color: "#f87171" }]
                      : []),
                  ].map(({ label, val, color }) => (
                    <div
                      key={label}
                      style={{
                        textAlign: "center",
                        padding: "10px 8px",
                        background: color + "10",
                        border: `1px solid ${color}25`,
                        borderRadius: 12,
                      }}
                    >
                      <p style={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: 17, color }}>
                        {val >= 0 ? "+" : ""}{val}
                      </p>
                      <p style={{ fontFamily: fonts.body, fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Detected items */}
            {result.items?.length > 0 ? (
              <Card hover={false} style={{ marginBottom: 16 }}>
                <p
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 12,
                  }}
                >
                  Detected Items ({result.items.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.items.map((item, i) => {
                    const catColor = CATEGORY_COLORS[item.category] || "#10d97e";
                    const catIcon = CATEGORY_ICONS[item.category] || "🗑️";
                    const confidenceColor =
                      item.confidence >= 85 ? "#10d97e" : item.confidence >= 60 ? "#fbbf24" : "#f87171";
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: 12,
                          background: catColor + "0d",
                          border: `1px solid ${catColor}25`,
                          gap: 10,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 18, flexShrink: 0 }}>{catIcon}</span>
                          <div style={{ minWidth: 0 }}>
                            <span
                              style={{
                                fontFamily: fonts.body,
                                fontWeight: 600,
                                fontSize: 14,
                                color: T.text,
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.name}
                            </span>
                            <span
                              style={{
                                fontFamily: fonts.body,
                                fontSize: 11,
                                color: catColor,
                                background: catColor + "15",
                                padding: "1px 7px",
                                borderRadius: 100,
                                display: "inline-block",
                                marginTop: 2,
                              }}
                            >
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <span
                            style={{
                              fontFamily: fonts.body,
                              fontSize: 14,
                              fontWeight: 700,
                              color: confidenceColor,
                            }}
                          >
                            {item.confidence}%
                          </span>
                          <p style={{ fontFamily: fonts.body, fontSize: 10, color: T.textMuted }}>
                            confidence
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ) : (
              <Card hover={false} style={{ marginBottom: 16, textAlign: "center", padding: "24px" }}>
                <p style={{ fontFamily: fonts.body, fontSize: 14, color: T.textMuted }}>
                  🔍 No waste items detected. Try a clearer photo with better lighting.
                </p>
              </Card>
            )}

            {/* Recommendation */}
            {result.recommendation && (
              <Card
                hover={false}
                style={{
                  marginBottom: 20,
                  background: "rgba(56,189,248,0.04)",
                  borderColor: "rgba(56,189,248,0.2)",
                }}
              >
                <p
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 14,
                    color: T.textMuted,
                    lineHeight: 1.75,
                  }}
                >
                  💡 {result.recommendation}
                </p>
              </Card>
            )}

            <Btn
              size="lg"
              variant="primary"
              onClick={reset}
              style={{ width: "100%", justifyContent: "center" }}
            >
              🔄 Scan Again
            </Btn>
          </FadeUp>
        )}
      </div>
    </div>
  );
}
