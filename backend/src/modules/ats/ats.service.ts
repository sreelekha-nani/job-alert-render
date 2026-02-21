import { AppError } from '../../utils/AppError';

interface AtsCheckInput {
    resume: string;
    jobDescription: string;
}

interface AtsCheckResult {
    score: number;
    missingKeywords: string[];
    matchedKeywords: string[];
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
}

// Extract keywords from text
const extractKeywords = (text: string): string[] => {
    const keywords = text
        .toLowerCase()
        .match(/\b[a-z][\w+#.\-]*\b/gi) || [];
    
    // Filter common words and keep technical terms
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
        'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
        'have', 'has', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
        'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i',
        'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'where',
        'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
        'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'same',
        'so', 'than', 'too', 'very', 'as', 'about', 'after', 'before'
    ]);
    
    return keywords
        .filter(kw => kw.length > 2 && !stopWords.has(kw))
        .map(kw => kw.trim())
        .filter((kw, idx, arr) => arr.indexOf(kw) === idx); // unique
};

// Extract technical skills from text
const extractSkills = (text: string): string[] => {
    const skillPatterns = [
        // Programming languages
        /\b(python|javascript|typescript|java|c#|c\+\+|rust|go|kotlin|swift|ruby|php|scala|r|matlab|nodejs|node\.?js)\b/gi,
        // Frameworks
        /\b(react|angular|vue|svelte|django|flask|fastapi|spring|express|nestjs|nest|laravel|dotnet|asp\.?net|next\.?js|webpack|vite)\b/gi,
        // Databases
        /\b(sql|nosql|mongodb|postgres|postgresql|mysql|redis|cassandra|dynamodb|elasticsearch|oracle|mariadb)\b/gi,
        // Cloud/DevOps
        /\b(aws|azure|gcp|docker|kubernetes|k8s|jenkins|gitlab|github|ci\/cd|terraform|ansible|devops)\b/gi,
        // Other technical skills
        /\b(rest|graphql|api|microservices|agile|git|linux|unix|windows|html|css|tailwind|bootstrap|testing|junit|jest|mocha|pytest|machine learning|ai|data science|web development|full stack|backend|frontend)\b/gi
    ];
    
    const skills: string[] = [];
    skillPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            skills.push(...matches.map(m => m.toLowerCase().replace(/\./g, '')));
        }
    });
    
    return [...new Set(skills)]; // unique
};

// Extract years of experience
const extractExperienceYears = (text: string): number => {
    const patterns = [
        /(\d+)\s*\+?\s*years?\s+of?\s+experience/gi,
        /experience:\s*(\d+)\s*\+?\s*years?/gi,
        /(\d+)\s+years?\s+in\s+/gi
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
    
    return 0;
};

// Check for education qualifications
const hasQualification = (text: string, level: 'bachelor' | 'master' | 'phd'): boolean => {
    const patterns = {
        'bachelor': /\b(b\.?a\.?|b\.?s\.?|bachelor|undergraduate|ba|bs)\b/gi,
        'master': /\b(m\.?a\.?|m\.?s\.?|mba|master|postgraduate|ma|ms)\b/gi,
        'phd': /\b(ph\.?d|phd|doctorate|doctor)\b/gi
    };
    
    return patterns[level].test(text);
};

export const checkAts = async (input: AtsCheckInput): Promise<AtsCheckResult> => {
    const { resume, jobDescription } = input;

    if (!resume || !jobDescription) {
        throw new AppError('Resume and Job Description are required', 400);
    }
    
    console.log('Performing ATS check with keyword matching...');

    // Extract skills from both documents
    const jobSkills = extractSkills(jobDescription);
    const resumeSkills = extractSkills(resume);
    
    console.log('Job skills:', jobSkills);
    console.log('Resume skills:', resumeSkills);
    
    // Extract keywords
    const jobKeywords = extractKeywords(jobDescription);
    const resumeKeywords = extractKeywords(resume);
    
    console.log('Job keywords count:', jobKeywords.length);
    console.log('Resume keywords count:', resumeKeywords.length);
    
    // Extract experience requirements
    const jobExpReqMatch = jobDescription.match(/(\d+)\s*\+?\s*years?\s+of?\s+experience/i);
    const requiredExperience = jobExpReqMatch ? parseInt(jobExpReqMatch[1]) : 0;
    const resumeExperience = extractExperienceYears(resume);
    
    console.log('Required experience:', requiredExperience, 'Resume experience:', resumeExperience);
    
    // Calculate skills match - use better matching logic
    const matchedSkills = resumeSkills.filter(skill => 
        jobSkills.some(jobSkill => 
            skill.toLowerCase() === jobSkill.toLowerCase() || 
            skill.toLowerCase().includes(jobSkill.toLowerCase()) || 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
    );
    const skillsMatch = jobSkills.length > 0 
        ? Math.round((matchedSkills.length / jobSkills.length) * 100) 
        : 80; // If no skills specified, give high score
    
    console.log('Skills match:', skillsMatch, 'Matched:', matchedSkills.length, 'Required:', jobSkills.length);
    
    // Calculate keyword match - case insensitive
    const matchedKeywords = resumeKeywords.filter(kw => 
        jobKeywords.some(jobKw => 
            kw.toLowerCase() === jobKw.toLowerCase() ||
            kw.toLowerCase().includes(jobKw.toLowerCase()) || 
            jobKw.toLowerCase().includes(kw.toLowerCase())
        )
    );
    const keywordMatch = jobKeywords.length > 0
        ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
        : 80;
    
    console.log('Keyword match:', keywordMatch, 'Matched:', matchedKeywords.length, 'Required:', jobKeywords.length);
    
    // Calculate experience match
    let experienceMatch = 0;
    if (requiredExperience > 0) {
        experienceMatch = Math.min(100, Math.round((resumeExperience / requiredExperience) * 100));
    } else {
        experienceMatch = resumeExperience > 0 ? 90 : 70;
    }
    
    console.log('Experience match:', experienceMatch);
    
    // Check education requirements
    let educationMatch = 70;
    if (jobDescription.toLowerCase().includes('bachelor') || jobDescription.toLowerCase().includes('b.s') || jobDescription.toLowerCase().includes('b.a')) {
        if (hasQualification(resume, 'bachelor') || hasQualification(resume, 'master') || hasQualification(resume, 'phd')) {
            educationMatch = 100;
        } else {
            educationMatch = 30;
        }
    } else if (jobDescription.toLowerCase().includes('master') || jobDescription.toLowerCase().includes('m.s')) {
        if (hasQualification(resume, 'master') || hasQualification(resume, 'phd')) {
            educationMatch = 100;
        } else if (hasQualification(resume, 'bachelor')) {
            educationMatch = 70;
        } else {
            educationMatch = 30;
        }
    }
    
    console.log('Education match:', educationMatch);
    
    // Calculate final score (weighted average)
    const score = Math.round(
        skillsMatch * 0.45 + 
        keywordMatch * 0.30 + 
        experienceMatch * 0.15 + 
        educationMatch * 0.10
    );
    
    console.log('Final score breakdown:', { skillsMatch, keywordMatch, experienceMatch, educationMatch, score });
    
    // Get missing keywords (top 5 from job description not in resume)
    const missingKeywords = jobKeywords
        .filter(kw => !resumeKeywords.some(rKw => 
            rKw.toLowerCase() === kw.toLowerCase() ||
            rKw.toLowerCase().includes(kw.toLowerCase()) || 
            kw.toLowerCase().includes(rKw.toLowerCase())
        ))
        .slice(0, 5);
    
    return {
        score: Math.max(0, Math.min(100, score)), // Ensure 0-100
        missingKeywords: missingKeywords.length > 0 ? missingKeywords : [],
        matchedKeywords: matchedSkills.slice(0, 5),
        skillsMatch,
        experienceMatch,
        educationMatch
    };
};
