import express from 'express';
import { getJobsHandler, searchJobsHandler, filterBySkillsHandler, filterByExperienceHandler } from './job.controller';

const router = express.Router();

// Get all jobs with pagination
// Usage: GET /api/jobs?page=1&limit=100
router.get('/', getJobsHandler);

// Search jobs
// Usage: GET /api/jobs/search?q=react&page=1&limit=50
router.get('/search', searchJobsHandler);

// Filter jobs by technical skills
// Usage: POST /api/jobs/filter/skills
// Body: { "skills": ["react", "nodejs", "mongodb"] }
router.post('/filter/skills', filterBySkillsHandler);

// Filter jobs by experience level
// Usage: POST /api/jobs/filter/experience
// Body: { "minExperience": 2, "maxExperience": 5 }
router.post('/filter/experience', filterByExperienceHandler);

export default router;