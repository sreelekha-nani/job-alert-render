import http from "http";
import app from "./app";
import config from "./config";

import { PrismaClient } from "@prisma/client";

import { Server as SocketIOServer } from "socket.io";
import { initSocket } from "./sockets";

import passport from "passport";
import { setupPassport } from "./middlewares/passport";

import { initCronJobs } from "./cron";
import initializeDatabase from "./utils/initDb";

/* ================= PRISMA ================= */

const prisma = new PrismaClient();

/* ================= HTTP SERVER ================= */

const server = http.createServer(app);

/* ================= SOCKET.IO ================= */

const io = new SocketIOServer(server, {
  cors: {
    origin: config.clientUrl,
    methods: ["GET", "POST"],
  },
});

initSocket(io);

/* ================= PASSPORT ================= */

app.use(passport.initialize());
setupPassport();

/* ================= START SERVER ================= */

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("🚀 Connected to MongoDB via Prisma");

    // Initialize database (drop legacy indexes)
    await initializeDatabase();

    server.listen(config.port, async () => {
      console.log(`🚀 Server listening on http://localhost:${config.port}`);
      // Initialize cron jobs (including initial scrape) unless disabled
      if (process.env.SKIP_CRON !== 'true') {
        await initCronJobs();
      } else {
        console.log('⚠️ SKIP_CRON=true — skipping cron job initialization');
      }
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();

/* ================= GRACEFUL SHUTDOWN ================= */

const shutdown = async () => {
  console.log("🛑 Shutting down gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("✅ Server shut down.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
// process.on("SIGINT", shutdown);
// process.on("SIGTERM", shutdown);
// initCronJobs();
