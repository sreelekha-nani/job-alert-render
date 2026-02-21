import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const API_URL = 'http://localhost:5000/api/ats/check';

// Read test files
const resumePath = path.join(__dirname, 'test-resume-high-score.txt');
const jobDescPath = path.join(__dirname, 'test-job-description.txt');

const resume = fs.readFileSync(resumePath, 'utf-8');
const jobDescription = fs.readFileSync(jobDescPath, 'utf-8');

console.log('🚀 Testing ATS scoring with test data...\n');

(async () => {
    try {
        const response = await axios.post(API_URL, {
            resume,
            jobDescription,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('✅ ATS Check Result:\n');
        console.log(JSON.stringify(response.data, null, 2));
        
        const score = response.data.data?.score || response.data.score;
        console.log(`\n📊 Final Score: ${score}%`);
        
        if (score >= 80) {
            console.log('✨ Excellent match!');
        } else if (score >= 70) {
            console.log('🎯 Good match');
        } else if (score >= 60) {
            console.log('👍 Moderate match');
        } else {
            console.log('⚠️ Low match - consider improving skills');
        }
        
    } catch (error: any) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
})();
