import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Required env validation
const requiredEnvVars = [
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "DATABASE_URL",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(
      ", "
    )}`
  );
}

const config = {
  env: process.env.NODE_ENV || "development",

  port: process.env.PORT || 5000,

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    accessTokenExpiration:
      process.env.JWT_ACCESS_TOKEN_EXPIRATION || "15m",
    refreshTokenExpiration:
      process.env.JWT_REFRESH_TOKEN_EXPIRATION || "7d",
  },

  database: {
    url: process.env.DATABASE_URL as string,
  },

  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY as string,
  },

  cron: {
    schedule: process.env.SCRAPE_CRON_SCHEDULE || "0 */6 * * *",
  },

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

export default config;
