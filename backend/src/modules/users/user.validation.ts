import { z } from 'zod';

export const updatePreferencesSchema = z.object({
    body: z.object({
        keywords: z.array(z.string()).optional(),
        locations: z.array(z.string()).optional(),
        experienceLevels: z.array(z.string()).optional(),
        minSalary: z.number().int().positive().optional(),
        autoApplyThreshold: z.number().int().min(0).max(100).optional(),
        // resumeEmbedding is handled server-side, not taken from user input
    }),
});

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(3, 'Name must be at least 3 characters long').optional(),
        email: z.string().email('Invalid email address').optional(),
    }),
});
