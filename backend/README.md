# AI-Powered Job Alerts - Backend

This is the backend for the AI-Powered Job Alerts platform. It's built with Node.js, Express, TypeScript, Prisma, and a host of other modern technologies to provide a scalable and robust service.

## Features

-   **Authentication**: Secure JWT-based authentication (access + refresh tokens) and Google OAuth.
-   **API Endpoints**: Full suite of APIs for managing users, preferences, jobs, alerts, and stats.
-   **AI-Powered Matching**: Placeholder services for integrating OpenAI embeddings and GPT-4o for semantic job matching and ATS scoring.
-   **Web Scraping**: Cron-based job scraping engine (using Puppeteer) to aggregate job listings.
-   **Real-time Notifications**: User-specific alerts via Socket.io.
-   **DevOps Ready**: Dockerized setup for consistent development and production environments.

## Tech Stack

-   **Framework**: Node.js, Express.js
-   **Language**: TypeScript
-   **ORM**: Prisma
-   **Database**: MongoDB
-   **Real-time**: Socket.io
-   **Caching**: Redis
-   **Authentication**: Passport.js (JWT & Google OAuth)
-   **Validation**: Zod
-   **Web Scraping**: Puppeteer, Cheerio, node-cron
-   **Containerization**: Docker, Docker Compose

---

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
-   A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for your database.

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd backend
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory by copying the example file:

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in the required values:

-   `DATABASE_URL`: Your MongoDB Atlas connection string.
-   `JWT_SECRET` & `JWT_REFRESH_SECRET`: Strong, random strings for signing tokens.
-   `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Your credentials from the Google Cloud Console.
-   `OPENAI_API_KEY`: Your API key from OpenAI.

### 3. Local Development (Docker)

The recommended way to run the project locally is using Docker Compose. This will spin up the backend service, a MongoDB instance, and a Redis instance.

```bash
# Build and start the containers in detached mode
docker-compose up --build -d
```

-   The backend will be available at `http://localhost:5000`.
-   The MongoDB database will be running on port `27017`.
-   Redis will be running on port `6379`.

To view logs:

```bash
docker-compose logs -f backend
```

### 4. Running Prisma Commands

With the Docker container running, you can run Prisma commands (like migrations or seeding) inside the `backend` container.

```bash
# Apply migrations
docker-compose exec backend npm run prisma:migrate

# Seed the database
docker-compose exec backend npm run seed

# Open Prisma Studio to view/edit data
docker-compose exec backend npm run prisma:studio
```

---

## ⚙️ API Endpoints

All endpoints are prefixed with `/api`.

-   **Auth**: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/google`
-   **Users**: `/users/profile`, `/users/prefs`
-   **Jobs**: `/jobs`
-   **ATS**: `/ats/check`
-   **Dashboard**: `/dashboard/stats`
-   **Alerts**: `/alerts`

---

## ☁️ Deployment

This application is designed to be easily deployable on platforms like [Render](https://render.com/) or Heroku.

### Deploying on Render

1.  **Create Services**:
    -   Create a **Web Service** connected to your GitHub repository.
        -   **Environment**: `Node`
        -   **Build Command**: `npm install && npm run build`
        -   **Start Command**: `npm start`
    -   Create a **MongoDB** database instance.
    -   Create a **Redis** instance.

2.  **Environment Variables**:
    -   In your Web Service settings, add all the environment variables from your `.env` file.
    -   Use the internal connection strings provided by Render for `DATABASE_URL` and Redis connection details.

3.  **Deploy**:
    -   Pushing to your main branch will trigger a new deployment automatically.

---

## 🧪 Testing

The project is set up for API and end-to-end testing.

-   **API Tests (Jest)**: `npm test`
-   **E2E Tests (Playwright)**: `npm run test:e2e` (Requires a running instance of the application).
