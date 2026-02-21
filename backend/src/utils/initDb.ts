import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Initialize database
 * Note: Index cleanup is handled in user.service.ts when needed
 */
export async function initializeDatabase() {
    try {
        console.log('🔧 Initializing database...');
        
        // Just verify we can query the database
        const userCount = await prisma.user.count();
        console.log(`✅ Database initialized. Current users: ${userCount}`);
        
        return true;
    } catch (error) {
        console.error('⚠️ Database initialization warning:', (error as any).message);
        // Don't fail startup even if there's an issue
        return true;
    }
}

export default initializeDatabase;
