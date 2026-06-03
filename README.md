# ♻️ Kabadiwala — India's Smart Recycling Platform

> **Purani Cheezein, Nayi Soch** — Schedule waste pickups, earn rewards, track your impact.

---

## 🚀 Quick Start

```bash
git clone https://github.com/your-username/kabadiwala.git
cd kabadiwala
npm install
cp .env.example .env    # fill in your credentials
npm run dev
```

---

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → **APIs & Services → Credentials**
3. Click **Create Credentials → OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Add **Authorized JavaScript Origins**:
   - `http://localhost:5173` (development)
   - `https://your-app.vercel.app` (production)
6. Copy the **Client ID** (not the secret) into your `.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
   ```
7. Also add the Client ID to Vercel → Project → Settings → Environment Variables

> **Note:** The Client ID is safe to expose publicly (it's prefixed with `VITE_`). Never expose the Client Secret — it's not needed in this frontend OAuth flow.

---

## 🍃 MongoDB Setup

### Option A: MongoDB Atlas (Recommended — Free Tier Available)

1. Sign up at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a **Free Cluster** (M0)
3. **Database Access** → Create user with password
4. **Network Access** → Add IP:
   - `0.0.0.0/0` for Vercel (easiest)
   - Or add Vercel's specific egress IPs
5. **Connect → Drivers** → copy the URI:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kabadiwala
   ```
6. Add to `.env` (local) and Vercel Environment Variables (production):
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/kabadiwala
   MONGODB_DB=kabadiwala
   ```

### Collections

| Collection | Description |
|------------|-------------|
| `pickups`  | Pickup form submissions from users |

The `pickups` collection is auto-created on first submission.

---

## ☁️ Vercel Deployment

```bash
npm install -g vercel
vercel login
vercel --prod
```

**Set environment variables in Vercel dashboard:**

| Variable | Value |
|----------|-------|
| `VITE_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `MONGODB_DB` | `kabadiwala` |

The project includes a `vercel.json` that:
- Routes `/api/*` requests to serverless functions in `api/`
- Rewrites all other routes to `index.html` (SPA routing)

---

## 📁 Project Structure

```
kabadiwala/
├── api/
│   └── pickup.js          # Vercel serverless — MongoDB pickup storage
├── src/
│   ├── components/
│   │   ├── LoadingScreen.jsx  # Indian flag animation
│   │   ├── Navbar.jsx         # Google OAuth sign-in
│   │   ├── UI.jsx             # Shared components
│   │   └── Footer.jsx
│   ├── context/
│   │   └── AppContext.jsx     # Auth state + session persistence
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── PickupPage.jsx     # MongoDB-connected form
│   │   ├── EducationPage.jsx
│   │   ├── RewardsPage.jsx
│   │   └── AboutPage.jsx
│   ├── constants/
│   │   ├── tokens.js          # Design system tokens
│   │   └── data.js
│   └── index.css
├── .env.example               # Environment variable template
├── vercel.json                # Vercel routing config
└── package.json
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Animation | Framer Motion |
| Styling | CSS-in-JS + design tokens |
| Auth | Google OAuth via `@react-oauth/google` |
| Database | MongoDB Atlas via Vercel serverless |
| Deployment | Vercel |

---

## 🧪 Scripts

```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint check
```
