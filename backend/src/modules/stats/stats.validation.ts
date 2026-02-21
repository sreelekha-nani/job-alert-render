import { z } from 'zod';

export const getStatsSchema = z.object({
    query: z.object({
        hours: z.string().regex(/^\d+$/).transform(Number).optional().default('24'),
    }),
});
