# Impact Pulse - Social Impact Analytics Dashboard

A **production-ready MERN stack** social media analytics dashboard designed for social impact organizations. Built with the visual refinement and precision of luxury automotive brand websites.

![Impact Pulse](https://via.placeholder.com/1200x600/0f172a/6366f1?text=Impact+Pulse+Dashboard)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (JSON Web Tokens) |
| **Deployment** | Vercel / Netlify (Frontend), Render (Backend) |

### Languages Used
- **JavaScript (ES6+)** - Primary language for frontend and backend
- **JSX** - React component syntax
- **HTML5** - Page structure
- **CSS3** - Styling (via Tailwind CSS)
- **JSON** - Configuration and data exchange

## 🚀 Features

### Dashboard
- **Real-time Analytics** - Track reach, impressions, engagement across all platforms
- **Multi-platform Support** - Twitter, Instagram, LinkedIn, Facebook integration
- **KPI Cards** - Animated performance metrics with trend indicators
- **Engagement Trends** - Interactive charts with smooth animations
- **Impact Feed** - Timeline of milestones, viral posts, partnerships

### Campaigns
- **Campaign Management** - Create and track social impact campaigns
- **Progress Tracking** - Goal setting with visual progress indicators
- **Impact Scoring** - Automated impact score calculation
- **Multi-cause Support** - Environment, education, health, equality, and more

### Authentication
- **JWT Authentication** - Secure token-based auth
- **Role-based Access** - User, Analyst, Admin roles
- **Profile Management** - User preferences and settings

## 📁 Project Structure

```
Impact Pulse/
├── Frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context (Auth)
│   │   ├── pages/            # Route pages
│   │   ├── services/         # API service layer
│   │   └── styles/           # Global CSS
│   ├── vercel.json           # Vercel deployment config
│   ├── netlify.toml          # Netlify deployment config
│   └── package.json
│
├── Backend/                  # Node.js + Express Backend
│   ├── config/               # Database connection
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth & validation
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── seed/                 # Demo data seeder
│   ├── render.yaml           # Render deployment config
│   ├── Procfile              # Heroku/Render process file
│   └── package.json
│
└── README.md
```

<!-- ## 🚀 Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- npm or yarn

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/impact-pulse?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file (optional for local dev):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev
```

Open http://localhost:5173

### Seed Demo Data

```bash
cd Backend
npm run seed
```

**Demo Credentials:**
- Email: `demo@impactpulse.com`
- Password: `Demo@2024`

---

## 🌐 Deployment Guide

### Option 1: Deploy Frontend to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set the **Root Directory** to `Frontend`

3. **Configure Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Deploy!** Vercel auto-detects Vite and builds automatically.

5. **Update `vercel.json`** with your backend URL:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/(.*)",
         "destination": "https://your-backend-url.onrender.com/api/$1"
       }
     ]
   }
   ```

---

### Option 2: Deploy Frontend to Netlify

1. **Push your code to GitHub**

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository

3. **Build Settings:**
   - **Base directory:** `Frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `Frontend/dist`

4. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

5. **Update `netlify.toml`** or `_redirects` with your backend URL:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-backend-url.onrender.com/api/:splat"
     status = 200
   ```

---

### Deploy Backend to Render

1. **Push your code to GitHub**

2. **Create a Render Web Service:**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure the Service:**
   - **Name:** `impact-pulse-api`
   - **Root Directory:** `Backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Environment Variables (add in Render dashboard):**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/impact-pulse
   JWT_SECRET=your_production_jwt_secret_at_least_32_chars
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://your-frontend.vercel.app
   ```

5. **Deploy!** Render will build and deploy automatically.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update profile |
| PUT | `/api/auth/password` | Change password |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Dashboard summary |
| GET | `/api/analytics/trends` | Trend data for charts |
| GET | `/api/analytics/platforms` | Platform breakdown |
| GET | `/api/analytics/kpis` | KPI card data |

### Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | List campaigns |
| POST | `/api/campaigns` | Create campaign |
| GET | `/api/campaigns/:id` | Get campaign |
| PUT | `/api/campaigns/:id` | Update campaign |
| DELETE | `/api/campaigns/:id` | Delete campaign |

### Feed
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/feed` | Get impact feed |
| POST | `/api/feed` | Create impact event |

---

## 🔧 MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free cluster (M0 Sandbox)
3. Create a database user with password
4. Add IP addresses to whitelist:
   - For development: Your IP or `0.0.0.0/0` (allow all)
   - For production: Render's IP ranges
5. Get connection string and add to `.env`:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/impact-pulse
   ```

---

## 🎨 Design System

### Colors
- **Ink** (Neutral): Slate-based scale for text and backgrounds
- **Accent** (Indigo): Primary brand color `#6366f1`
- **Teal**: Secondary accent `#14b8a6`

### Typography
- **Font:** Plus Jakarta Sans
- **Weights:** 400, 500, 600, 700

### Animation Philosophy
- ✅ Subtle motion with natural easing
- ✅ GPU-friendly transforms
- ✅ `prefers-reduced-motion` support
- ❌ No flashy or distracting effects

---

## 🔒 Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing tokens | `my-super-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `production` |
| `CLIENT_URL` | Frontend URL for CORS | `https://app.vercel.app` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.onrender.com/api` |

---

## 📝 License

MIT License - free to use for social impact projects!

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

Built with ❤️ for social impact organizations

**Tech Stack:** React • Node.js • Express.js • MongoDB Atlas • Vercel • Netlify • Render -->
