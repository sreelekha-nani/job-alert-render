import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { rateLimit } from "express-rate-limit";
import config from "./config";
import passport from "passport";
import { setupPassport } from "./middlewares/passport";
import cookieParser from "cookie-parser";

/* ================= APP INIT ================= */
const app = express();

/* ================= PASSPORT ================= */
setupPassport();
app.use(passport.initialize());

/* ================= SECURITY & MIDDLEWARES ================= */
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================= ✅ CORS CONFIG (PRODUCTION READY) ================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local Vite frontend
      "http://localhost:3000", // Optional local
      "https://job-alert-render-2.onrender.com", // ✅ Production frontend
    ],
    credentials: true,
  })
);

/* ================= RATE LIMIT ================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(limiter);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

/* ================= ROUTES ================= */
import authRoutes from "./modules/auth/auth.route";
import userRoutes from "./modules/users/user.route";
import jobRoutes from "./modules/jobs/job.route";
import atsRoutes from "./modules/ats/ats.route";
import dashboardRoutes from "./modules/stats/stats.route";
import alertRoutes from "./modules/alerts/alerts.route";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/alerts", alertRoutes);

/* ================= ERROR HANDLER ================= */
import { errorHandler } from "./middlewares/errorHandler";
app.use(errorHandler);

export default app;