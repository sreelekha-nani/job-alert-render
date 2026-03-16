import cron from "node-cron";
import config from "../config";
import { scrapeAndStoreJobs } from "../modules/jobs/scraper.service";

let isRunning = false; // prevent overlapping runs

export const initCronJobs = async () => {
  try {
    console.log("🕒 Initializing cron jobs...");

    // Run scraper once in background after a short delay
    setTimeout(async () => {
      console.log("🚀 Running initial job scrape (background) on startup...");
      isRunning = true;
      try {
        await scrapeAndStoreJobs();
        console.log("✅ Initial job scraping completed successfully");
      } catch (err) {
        console.error("⚠️ Initial job scraping failed:", err);
      } finally {
        isRunning = false;
      }
    }, 5000); // 5 second delay to let server settle

    // Schedule regular scraping based on cron pattern
    cron.schedule(config.cron.schedule, async () => {
      if (isRunning) {
        console.log("⏳ Previous cron still running. Skipping this cycle.");
        return;
      }

      isRunning = true;
      console.log(
        `🚀 Running scheduled job scrape at ${new Date().toISOString()}`
      );

      try {
        await scrapeAndStoreJobs();
        console.log("✅ Job scraping completed successfully");
      } catch (err) {
        console.error("❌ Job scraping failed:", err);
      } finally {
        isRunning = false;
      }
    });

    console.log(`✅ Job scraping scheduled with pattern: ${config.cron.schedule}`);
  } catch (err) {
    console.error("❌ Cron initialization failed:", err);
  }
};
