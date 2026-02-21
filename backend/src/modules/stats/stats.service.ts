import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();

export const getDashboardStats = async (userId: string, hours: number) => {
    // In a real implementation, you would query the Stat model
    // filtering by userId and a date range based on the 'hours' parameter.
    
    console.log(`Fetching mock stats for user ${userId} for the last ${hours} hours.`);

    return {
        totalJobsApplied: Math.floor(Math.random() * 50) + 100, // 100-149
        matchesToday: Math.floor(Math.random() * 10) + 5, // 5-14
        autoApplied: Math.floor(Math.random() * 20) + 30, // 30-49
    };
};
