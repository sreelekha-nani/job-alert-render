import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extract technical skills from job description
function extractTechnicalSkills(text: string): string[] {
    const skillPatterns = [
        // Programming languages
        /\b(python|javascript|typescript|java|c#|c\+\+|rust|go|kotlin|swift|ruby|php|scala|r|matlab|nodejs|node\.?js)\b/gi,
        // Frameworks
        /\b(react|angular|vue|svelte|django|flask|fastapi|spring|express|nestjs|nest|laravel|dotnet|asp\.?net|next\.?js|webpack|vite)\b/gi,
        // Databases
        /\b(sql|nosql|mongodb|postgres|postgresql|mysql|redis|cassandra|dynamodb|elasticsearch|oracle|mariadb)\b/gi,
        // Cloud/DevOps
        /\b(aws|azure|gcp|docker|kubernetes|k8s|jenkins|gitlab|github|ci\/cd|terraform|ansible|devops)\b/gi,
    ];
    
    const skills: string[] = [];
    skillPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            skills.push(...matches.map(m => m.toLowerCase().replace(/\./g, '')));
        }
    });
    
    return [...new Set(skills)];
}

// Extract soft skills from job description
function extractSoftSkills(text: string): string[] {
    const softSkillPatterns = [
        /\b(communication|teamwork|leadership|problem.?solving|critical.?thinking|time.?management|collaboration|adaptability|creativity|analytical|strategic|organizational|interpersonal)\b/gi,
        /\b(agile|scrum|kanban|project.?management|stakeholder.?management|customer.?service|attention.?to.?detail)\b/gi,
    ];
    
    const skills: string[] = [];
    softSkillPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            skills.push(...matches.map(m => m.toLowerCase()));
        }
    });
    
    return [...new Set(skills)];
}

// Extract required experience years
function extractRequiredExperience(text: string): number | null {
    const patterns = [
        /(\d+)\s*\+?\s*years?\s+of?\s+experience/gi,
        /experience:\s*(\d+)\s*\+?\s*years?/gi,
        /(\d+)\s+years?\s+in\s+/gi,
    ];
    
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            const yearMatch = match[0].match(/\d+/);
            if (yearMatch) {
                return parseInt(yearMatch[0]);
            }
        }
    }
    
    return null;
}

// Extract education level
function extractEducationLevel(text: string): string | null {
    if (/\bphd|doctorate|doctor\b/i.test(text)) return 'PhD';
    if (/\bmaster|m\.?s\.?|mba\b/i.test(text)) return 'Master';
    if (/\bbachelor|b\.?s\.?|b\.?a\.?\b/i.test(text)) return 'Bachelor';
    return null;
}

// Extract all keywords (general terms)
function extractAllKeywords(text: string): string[] {
    const keywords = text
        .toLowerCase()
        .match(/\b[a-z][\w+#.\-]*\b/gi) || [];
    
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
        'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
        'have', 'has', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
        'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i',
        'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'where',
        'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
        'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'same',
        'so', 'than', 'too', 'very', 'as', 'about', 'after', 'before', 'job',
        'position', 'role', 'we', 'are', 'looking', 'seeking', 'hiring'
    ]);
    
    return keywords
        .filter(kw => kw.length > 2 && !stopWords.has(kw))
        .map(kw => kw.trim())
        .filter((kw, idx, arr) => arr.indexOf(kw) === idx)
        .slice(0, 30); // Top 30 keywords
}

// Main migration function
async function migrateJobKeywords() {
    try {
        console.log('Starting job keyword migration...');
        
        const jobs = await prisma.job.findMany({
            select: { id: true, description: true, title: true },
        });
        
        console.log(`Found ${jobs.length} jobs to process`);
        
        for (const job of jobs) {
            const fullText = `${job.title} ${job.description}`;
            
            const technicalSkills = extractTechnicalSkills(fullText);
            const softSkills = extractSoftSkills(fullText);
            const requiredExperience = extractRequiredExperience(fullText);
            const educationLevel = extractEducationLevel(fullText);
            const keywords = extractAllKeywords(fullText);
            
            await prisma.job.update({
                where: { id: job.id },
                data: {
                    technicalSkills,
                    softSkills,
                    requiredExperience,
                    educationLevel,
                    keywords,
                    scrapedAt: new Date(), // Set to current date if null
                },
            });
            
            console.log(`✓ Updated ${job.title} - Skills: ${technicalSkills.length}, Experience: ${requiredExperience}`);
        }
        
        console.log('✓ Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run migration
migrateJobKeywords();
