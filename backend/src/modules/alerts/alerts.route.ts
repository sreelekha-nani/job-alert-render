import express from "express";
import { sendApplicationEmailHandler } from "./alerts.controller";

const router = express.Router();

/**
 * TEMP SAFE ROUTE
 * GET /api/alerts
 */
router.get("/", (req, res) => {
  res.status(200).json({
    data: [],
    message: "Alerts system operational",
  });
});

/**
 * Send application email to HR
 * POST /api/alerts/send-application-email
 */
router.post("/send-application-email", sendApplicationEmailHandler);

export default router;
