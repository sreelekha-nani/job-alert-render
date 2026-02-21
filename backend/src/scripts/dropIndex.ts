import { MongoClient } from 'mongodb';

const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/ai_job_alerts';

async function dropIndex() {
    const client = new MongoClient(MONGODB_URL);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db();
        const collection = db.collection('User');
        
        // List all indexes
        const indexes = await collection.listIndexes().toArray();
        console.log('Current indexes:', indexes.map((i: any) => i.name));
        
        // Try to drop the problematic index
        try {
            await collection.dropIndex('User_googleId_key');
            console.log('✅ Successfully dropped User_googleId_key index');
        } catch (error: any) {
            if (error.message.includes('index not found')) {
                console.log('ℹ️ Index not found (already removed)');
            } else {
                console.error('Error dropping index:', error.message);
            }
        }
        
        // List indexes again
        const indexesAfter = await collection.listIndexes().toArray();
        console.log('Indexes after cleanup:', indexesAfter.map((i: any) => i.name));
        
    } catch (error) {
        console.error('❌ Error:', (error as any).message);
    } finally {
        await client.close();
    }
}

dropIndex();

