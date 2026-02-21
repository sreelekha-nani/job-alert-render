import { Request, Response, NextFunction } from 'express';
import * as jobService from './job.service';

/**
 * Controller to handle fetching all jobs with pagination.
 */
export const getJobsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log('✅ GET /api/jobs route was hit');

        // Get pagination parameters from query
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;

        const result = await jobService.getAllJobs(page, limit);

                // Debug: log how many jobs we fetched before responding
                console.log(`✅ GET /api/jobs — fetched ${Array.isArray(result.jobs) ? result.jobs.length : 0} jobs (total: ${result.pagination?.total ?? 'unknown'})`);

                // Return just the jobs array for easier frontend consumption
                // Include pagination info in headers for potential future use
                res.status(200)
                    .set('X-Total-Count', result.pagination.total.toString())
                    .set('X-Page', page.toString())
                    .set('X-Limit', limit.toString())
                    .json(result.jobs);
    } catch (error) {
        // Pass any errors to the central error handler.
        next(error);
    }
};

/**
 * Controller to handle searching jobs.
 */
export const searchJobsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const query = req.query.q as string;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;

        const result = await jobService.searchJobs(query, page, limit);

                // Debug: log how many jobs matched the search
                console.log(`🔎 GET /api/jobs/search?q=${query} — found ${Array.isArray(result.jobs) ? result.jobs.length : 0} jobs (total: ${result.pagination?.total ?? 'unknown'})`);

                // Return just the jobs array for easier frontend consumption
                res.status(200)
                    .set('X-Total-Count', result.pagination.total.toString())
                    .set('X-Page', page.toString())
                    .set('X-Limit', limit.toString())
                    .json(result.jobs);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to handle filtering jobs by technical skills.
 */
export const filterBySkillsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { skills } = req.body;
        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: 'Skills array is required' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;

        const result = await jobService.filterJobsBySkills(skills, page, limit);

        res.status(200)
          .set('X-Total-Count', result.pagination.total.toString())
          .set('X-Page', page.toString())
          .set('X-Limit', limit.toString())
          .json(result.jobs);
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to handle filtering jobs by experience level.
 */
export const filterByExperienceHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { minExperience, maxExperience } = req.body;
        if (minExperience === undefined || minExperience === null) {
            return res.status(400).json({ message: 'minExperience is required' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;

        const result = await jobService.filterJobsByExperience(
            minExperience,
            maxExperience,
            page,
            limit
        );

        res.status(200)
          .set('X-Total-Count', result.pagination.total.toString())
          .set('X-Page', page.toString())
          .set('X-Limit', limit.toString())
          .json(result.jobs);
    } catch (error) {
        next(error);
    }
};