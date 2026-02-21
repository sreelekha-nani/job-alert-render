import { z } from 'zod';

export const checkAtsSchema = z.object({
    body: z.object({
        resume: z.string().min(100, 'Resume must be at least 100 characters long'),
        jobDescription: z.string().min(100, 'Job description must be at least 100 characters long'),
    }),
});
