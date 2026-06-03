/**
 * Kabadiwala — Static Data Constants
 */

export const NAV_ITEMS = [
  { label: "Home", page: "home" },
  { label: "Scanner", page: "scanner" },
  { label: "Education", page: "education" },
  { label: "Pickup", page: "pickup" },
  { label: "Rewards", page: "rewards" },
  { label: "About", page: "about" },
];

export const WASTE_TYPES = [
  { id: "paper",   label: "Paper & Cardboard", icon: "📄" },
  { id: "plastic", label: "Plastic",            icon: "🧴" },
  { id: "ewaste",  label: "E-Waste",            icon: "💻" },
  { id: "metal",   label: "Metal / Scrap",      icon: "🔩" },
  { id: "glass",   label: "Glass",              icon: "🫙" },
  { id: "organic", label: "Organic",            icon: "🌿" },
];

export const LOADING_FACTS = [
  "India generates 62 million tonnes of waste annually — only 9% is properly recycled.",
  "The Kabadiwala network processes ₹3,000 crore worth of scrap every year.",
  "Recycling 1 tonne of paper saves 17 trees and 26,500 litres of water.",
  "E-waste is India's fastest-growing waste stream — and 95% goes unrecycled.",
  "Your single pickup today could save a tree. That's the math. Let's do it.",
];

export const INITIAL_PICKUPS = [
  { id: 1, type: "Paper & Cardboard", date: "15 May 2026", status: "Completed", pointsAwarded: 50 },
  { id: 2, type: "Plastic",           date: "10 May 2026", status: "Completed", pointsAwarded: 50 },
  { id: 3, type: "E-Waste",           date: "3 May 2026",  status: "Scheduled", pointsAwarded: 20 },
];

export const BADGES = (points, pickupsLen) => [
  { id: "green_starter",  name: "Green Starter",     emoji: "🌱", desc: "Earned your first points",  threshold: 1,    earned: points >= 1 },
  { id: "eco_warrior",    name: "Eco Warrior",       emoji: "♻️", desc: "Reached 100 points",        threshold: 100,  earned: points >= 100 },
  { id: "pickup_pro",     name: "Pickup Pro",        emoji: "🚛", desc: "Completed 3 pickups",       threshold: 3,    earned: pickupsLen >= 3 },
  { id: "recycling_hero", name: "Recycling Hero",    emoji: "🦸", desc: "Reached 300 points",        threshold: 300,  earned: points >= 300 },
  { id: "planet_saver",   name: "Planet Saver",      emoji: "🌍", desc: "Reached 500 points",        threshold: 500,  earned: points >= 500 },
  { id: "legend",         name: "Kabadiwala Legend", emoji: "👑", desc: "Reached 1000 points",       threshold: 1000, earned: points >= 1000 },
];

export const TIME_SLOTS = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
];
