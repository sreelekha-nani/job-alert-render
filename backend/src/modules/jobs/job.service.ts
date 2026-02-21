import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetches all jobs from the database with pagination.
 * @param page - Page number (default: 1)
 * @param limit - Jobs per page (default: 100)
 * @returns A promise that resolves to an object with jobs array and total count.
 */
export const getAllJobs = async (page: number = 1, limit: number = 100) => {
  try {
    const skip = (page - 1) * limit;
    
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          postedAt: 'desc', // Show newest jobs first
        },
      }),
      prisma.job.count(),
    ]);

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Searches jobs by keywords, location, company or technical skills.
 * @param query - Search query
 * @param page - Page number
 * @param limit - Jobs per page
 */
export const searchJobs = async (
  query: string,
  page: number = 1,
  limit: number = 100
) => {
  try {
    const skip = (page - 1) * limit;
    const queryLower = query.toLowerCase();

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { technicalSkills: { has: queryLower } },
            { softSkills: { has: queryLower } },
            { keywords: { has: queryLower } },
          ],
        },
        skip: skip,
        take: limit,
        orderBy: {
          postedAt: 'desc',
        },
      }),
      prisma.job.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { technicalSkills: { has: queryLower } },
            { softSkills: { has: queryLower } },
            { keywords: { has: queryLower } },
          ],
        },
      }),
    ]);

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};

/**
 * Filter jobs by technical skills
 * @param skills - Array of technical skills to filter by
 * @param page - Page number
 * @param limit - Jobs per page
 */
export const filterJobsBySkills = async (
  skills: string[],
  page: number = 1,
  limit: number = 100
) => {
  try {
    const skip = (page - 1) * limit;
    const skillsLower = skills.map(s => s.toLowerCase());

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: {
          technicalSkills: {
            hasSome: skillsLower,
          },
        },
        skip: skip,
        take: limit,
        orderBy: {
          postedAt: 'desc',
        },
      }),
      prisma.job.count({
        where: {
          technicalSkills: {
            hasSome: skillsLower,
          },
        },
      }),
    ]);

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error filtering jobs by skills:', error);
    throw error;
  }
};

/**
 * Filter jobs by experience level required
 * @param minExperience - Minimum years of experience
 * @param maxExperience - Maximum years of experience
 * @param page - Page number
 * @param limit - Jobs per page
 */
export const filterJobsByExperience = async (
  minExperience: number,
  maxExperience?: number,
  page: number = 1,
  limit: number = 100
) => {
  try {
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: {
          requiredExperience: {
            gte: minExperience,
            ...(maxExperience && { lte: maxExperience }),
          },
        },
        skip: skip,
        take: limit,
        orderBy: {
          postedAt: 'desc',
        },
      }),
      prisma.job.count({
        where: {
          requiredExperience: {
            gte: minExperience,
            ...(maxExperience && { lte: maxExperience }),
          },
        },
      }),
    ]);

    return {
      jobs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error filtering jobs by experience:', error);
    throw error;
  }
};