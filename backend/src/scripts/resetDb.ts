import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Resets the database by clearing all collections and removing indexes
 */
async function resetDatabase() {
    try {
        console.log('Starting database reset...');

        // Delete all documents from collections
        await prisma.userPreferences.deleteMany({});
        console.log('✓ Cleared UserPreferences');

        await prisma.job.deleteMany({});
        console.log('✓ Cleared Job');

        await prisma.user.deleteMany({});
        console.log('✓ Cleared User');

        // Drop and recreate indexes
        try {
            await prisma.$executeRawUnsafe('db.User.dropIndex("User_googleId_key")');
            console.log('✓ Dropped User_googleId_key index');
        } catch {
            console.log('⚠ User_googleId_key index not found (already removed)');
        }

        console.log('✅ Database reset completed successfully!');
    } catch (error) {
        console.error('❌ Database reset failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetDatabase();
