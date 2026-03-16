# ExamVault

> A platform for students to upload and access exam question papers — Slot Papers, PYQs, and a built-in GPA/CGPA calculator.

---

## Tech Stack

| Layer       | Technology                          |
|------------|--------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS       |
| Backend    | Node.js + Express                    |
| Database   | MongoDB Atlas (Mongoose)             |
| Storage    | Cloudinary (PDF + Images)            |

---

## Project Structure

```
ExamVault/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Navbar, PaperCard, FilterBar
│   │   ├── pages/           # HomePage, UploadPage, SlotPapersPage, PYQsPage, CalculatorPage
│   │   ├── services/api.js  # Axios API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                  # Express backend
    ├── config/              # db.js, cloudinary.js
    ├── controllers/         # paperController.js
    ├── middleware/          # upload.js (Multer + Cloudinary)
    ├── models/              # Paper.js
    ├── routes/              # papers.js
    ├── index.js
    ├── .env.example
    └── package.json
```

---

## Setup Instructions

### 1. Prerequisites

- **Node.js** ≥ 18.x
- A **MongoDB Atlas** account and cluster
- A **Cloudinary** account

---

### 2. MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → create a free cluster
2. In **Database Access**, create a user with read/write access
3. In **Network Access**, allow your IP (or `0.0.0.0/0` for development)
4. Click **Connect → Drivers** → copy the connection string
   - Replace `<password>` with your DB user password
   - Replace `myFirstDatabase` with `examvault`

Connection string format:
```
mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/examvault?retryWrites=true&w=majority
```

---

### 3. Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to your **Dashboard**
3. Copy: **Cloud Name**, **API Key**, **API Secret**

---

### 4. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Copy env example and fill in your credentials
copy .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Start the server:
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The API runs at `http://localhost:5000`

---

### 5. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app runs at `http://localhost:5173`

> The Vite dev proxy automatically forwards `/api/*` requests to `http://localhost:5000`, so no CORS issues during development.

---

## API Reference

| Method | Route                  | Description                        |
|--------|------------------------|------------------------------------|
| POST   | `/api/papers/upload`   | Upload a paper (multipart/form-data) |
| GET    | `/api/papers`          | Get all papers (with filters)       |
| GET    | `/api/papers/slot`     | Get slot papers (with filters)      |
| GET    | `/api/papers/pyq`      | Get PYQs (with filters)             |
| DELETE | `/api/papers/:id`      | Delete a paper                      |
| GET    | `/api/health`          | Health check                        |

**Query params for GET endpoints:** `?courseCode=CSE2007&slot=A1&examType=CAT1`

---

## GPA / CGPA Formulas

**GPA:**
```
GPA = Σ(credits_i × grade_points_i) / Σ(credits_i)
```

**CGPA:**
```
CGPA = Σ(semester_credits_i × GPA_i) / Σ(semester_credits_i)
```

**Grade → Points mapping (VIT-AP):**
| Grade | Points |
|-------|--------|
| S     | 10     |
| A     | 9      |
| B     | 8      |
| C     | 7      |
| D     | 6      |
| E     | 5      |
| F     | 0      |

---

## Deployment

### Render (Backend)

1. Push `server/` to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node index.js`
5. Add all env variables from `.env`

### Vercel (Frontend)

1. Push `client/` to GitHub
2. Import on [vercel.com](https://vercel.com), set framework to **Vite**
3. Add env variable: `VITE_API_URL=https://your-render-api.onrender.com`
4. Update `vite.config.js` proxy target to use `process.env.VITE_API_URL` (or configure `api.js` baseURL for production)

> See `client/src/services/api.js` — change `baseURL` from `/api` to `https://your-backend.onrender.com/api` for production builds.
