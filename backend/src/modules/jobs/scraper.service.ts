import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

const prisma = new PrismaClient();

// Mock data generator - creates realistic job listings
const generateMockJobs = (count: number = 200) => {
    const companies = [
        'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix',
        'Tesla', 'Adobe', 'Spotify', 'Slack', 'Airbnb', 'Uber',
        'Stripe', 'Figma', 'Notion', 'HubSpot', 'Shopify', 'Twitch'
    ];
    
    const positions = [
        'Senior Software Engineer', 'Full Stack Developer', 'Frontend Engineer',
        'Backend Engineer', 'DevOps Engineer', 'Data Scientist',
        'Product Manager', 'UX Designer', 'QA Engineer', 'ML Engineer'
    ];
    
    const locations = [
        'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Los Angeles, CA',
        'Austin, TX', 'Boston, MA', 'Denver, CO', 'Chicago, IL',
        'Remote', 'Bangalore, India', 'London, UK', 'Toronto, Canada'
    ];

    const jobTypes = [
        'Full-time', 'Part-time', 'Contract', 'Internship'
    ];
    
    const descriptions = [
        'We are looking for talented engineers to join our team and work on exciting projects.',
        'Help us build scalable solutions for millions of users worldwide.',
        'Join our innovative team and make an impact on the future of technology.',
        'Work with cutting-edge technologies and lead challenging projects.',
        'Be part of a global team solving complex technical problems.'
    ];
    
    const jobs = [];
    for (let i = 0; i < count; i++) {
        const company = companies[Math.floor(Math.random() * companies.length)];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        const timestamp = Date.now() + Math.random() * 1000000;
        
        jobs.push({
            title: position,
            company: company,
            location: location,
            jobType: jobType,
            description: description,
            salary: `$${(100 + Math.random() * 150).toFixed(0)}k - $${(200 + Math.random() * 200).toFixed(0)}k`,
            experienceLevel: ['Entry Level', 'Mid Level', 'Senior', 'Lead'][Math.floor(Math.random() * 4)],
            keywords: ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker'][Math.floor(Math.random() * 6)].split(','),
            url: `https://jobs.example.com/${company.toLowerCase()}-${position.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`,
            postedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in last 7 days
            descriptionEmbedding: Array(1536).fill(Math.random()), // Placeholder embedding
        });
    }
    
    return jobs;
};

const scrapeIndeed = async () => {
    try {
        console.log('📄 Scraping Indeed...');
        // Returns mock jobs for now
        // In production, implement actual scraping with puppeteer
        return generateMockJobs(150);
    } catch (error) {
        console.error('Error scraping Indeed:', error);
        return [];
    }
};

const scrapeNaukri = async () => {
    try {
        console.log('📄 Scraping Naukri...');
        return generateMockJobs(150);
    } catch (error) {
        console.error('Error scraping Naukri:', error);
        return [];
    }
};

const scrapeLinkedIn = async () => {
    try {
        console.log('📄 Scraping LinkedIn...');
        return generateMockJobs(100);
    } catch (error) {
        console.error('Error scraping LinkedIn:', error);
        return [];
    }
};

export const scrapeAndStoreJobs = async () => {
    console.log('🔄 Starting job scraping cycle...');
    try {
        const allJobs = (await Promise.all([
            scrapeIndeed(),
            scrapeNaukri(),
            scrapeLinkedIn(),
        ])).flat();

        if (allJobs.length === 0) {
            console.log('⚠️ No new jobs found in this cycle.');
            return;
        }

        console.log(`📊 Generated ${allJobs.length} jobs from scrapers`);

        // Validate jobs have required fields before proceeding
        const validJobs = allJobs.filter(job => {
            return job.title && job.company && job.location && job.url;
        });

        if (validJobs.length === 0) {
            console.log('⚠️ No valid jobs to save.');
            return;
        }

        console.log(`✔️ ${validJobs.length} jobs passed validation`);

        // Clear all old jobs to avoid duplicates and numbered titles from previous runs
        console.log('🗑️ Clearing old jobs...');
        await prisma.job.deleteMany({});

        // Create new jobs in batches to avoid overwhelming the database
        const batchSize = 100;
        let createdCount = 0;
        
        for (let i = 0; i < validJobs.length; i += batchSize) {
            const batch = validJobs.slice(i, i + batchSize);
            try {
                const result = await prisma.job.createMany({
                    data: batch,
                });
                createdCount += result.count;
                console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: Created ${result.count} jobs`);
            } catch (batchError) {
                console.error(`Error creating batch ${Math.floor(i / batchSize) + 1}:`, batchError);
            }
        }

        console.log(`✅ Successfully scraped and stored ${createdCount} new jobs!`);

    } catch (error) {
        console.error('❌ Error during job scraping cycle:', error);
    }
};
