import { z } from 'zod';

export const getJobsSchema = z.object({
    query: z.object({
        loc: z.string().optional(),
        exp: z.string().optional(),
        package: z.string().optional(),
        search: z.string().optional(),
        page: z.string().regex(/^\d+$/).transform(Number).optional().default('1'),
        limit: z.string().regex(/^\d+$/).transform(Number).optional().default('20'),
    }),
});
