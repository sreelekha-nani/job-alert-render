const STOP_WORDS = new Set(['and', 'or', 'in', 'of', 'a', 'the', 'with', 'for', 'on', 'required', 'range', 'description', 'we', 'are', 'is', 'to', 'experience', 'years', 'you', 'your', 'our', 'will', 'can', 'must', 'should', 'have', 'has', 'had', 'at', 'by', 'from', 'if', 'be', 'as', 'job', 'position', 'role', 'team', 'company', 'us', 'them', 'etc', 'including', 'such', 'including', 'like', 'including', 'but', 'this', 'that', 'which', 'what', 'where', 'when', 'how', 'why', 'no', 'not', 'about', 'more', 'most', 'some', 'any', 'all', 'an']);

// Keyword synonyms and variations for better matching
const KEYWORD_SYNONYMS: Record<string, Set<string>> = {
  // Programming Languages
  'javascript': new Set(['js', 'typescript', 'ts', 'node', 'nodejs', 'node.js', 'ecmascript', 'es6', 'es2015']),
  'typescript': new Set(['ts', 'javascript', 'js', 'strict-typing']),
  'python': new Set(['py', 'django', 'flask', 'fastapi', 'pytest', 'numpy', 'pandas']),
  'java': new Set(['spring', 'springboot', 'spring-boot', 'maven', 'gradle', 'jvm']),
  'cpp': new Set(['c++', 'c', 'cplusplus', 'cxx', 'c-plus-plus']),
  'csharp': new Set(['c#', '.net', 'dotnet', 'asp.net', 'asp', 'dot-net', 'asp-core']),
  'go': new Set(['golang', 'gin', 'echo', 'go-lang']),
  'rust': new Set(['cargo', 'tokio', 'actix']),
  'php': new Set(['laravel', 'symfony', 'wordpress', 'composer', 'php-version']),
  'ruby': new Set(['rails', 'rails.js', 'ruby-on-rails', 'bundler', 'rspec']),
  'scala': new Set(['play-framework', 'akka']),
  'kotlin': new Set(['android', 'spring-kotlin']),
  'swift': new Set(['ios', 'macos', 'cocoapods']),
  'objective-c': new Set(['ios', 'macos']),
  
  // Frontend Frameworks & Libraries
  'react': new Set(['reactjs', 'react.js', 'jsx', 'nextjs', 'next.js', 'next', 'remix', 'react-hooks', 'redux']),
  'vue': new Set(['vuejs', 'vue.js', 'nuxt', 'nuxtjs', 'nuxt.js', 'vuex']),
  'angular': new Set(['ng', 'angularjs', 'angular.js', 'rxjs', 'typescript']),
  'svelte': new Set(['sveltekit']),
  'ember': new Set(['ember.js']),
  'html': new Set(['html5', 'markup', 'semantic-html']),
  'css': new Set(['css3', 'scss', 'sass', 'less', 'tailwind', 'bootstrap', 'styled-components', 'css-in-js']),
  'tailwind': new Set(['tailwindcss', 'tailwind-css', 'utility-css']),
  'bootstrap': new Set(['bs', 'bootstrap-css']),
  'material': new Set(['material-ui', 'material-design']),
  'frontend': new Set(['ui', 'ux', 'client-side', 'web', 'browser', 'dom', 'web-development']),
  'jsx': new Set(['react', 'component']),
  'responsive': new Set(['mobile-first', 'mobile-responsive', 'adaptive']),
  'accessibility': new Set(['a11y', 'wcag', 'aria', 'a11y-compliance']),
  
  // Backend Frameworks & APIs
  'nodejs': new Set(['node', 'node.js', 'javascript', 'backend']),
  'express': new Set(['expressjs', 'express.js', 'middleware']),
  'fastapi': new Set(['python', 'asgi', 'starlette']),
  'django': new Set(['python', 'drf', 'django-rest-framework']),
  'flask': new Set(['python', 'werkzeug']),
  'spring': new Set(['java', 'springboot', 'spring-boot', 'spring-mvc']),
  'nestjs': new Set(['node', 'typescript', 'backend']),
  'backend': new Set(['server-side', 'api', 'rest', 'graphql', 'backend-development']),
  'rest': new Set(['restful', 'http', 'api', 'rest-api', 'rest-architecture', 'architectural-style']),
  'graphql': new Set(['apollo', 'relay', 'query-language']),
  'soap': new Set(['webservice', 'xml']),
  'microservices': new Set(['distributed', 'service-oriented', 'scalable', 'soa', 'architecture']),
  'monolith': new Set(['monolithic', 'traditional-architecture']),
  'serverless': new Set(['lambda', 'functions', 'faas', 'aws-lambda']),
  
  // Databases & Data Storage
  'mongodb': new Set(['mongo', 'nosql', 'document', 'mongodb-atlas']),
  'mysql': new Set(['sql', 'relational', 'mariadb']),
  'postgresql': new Set(['postgres', 'sql', 'relational', 'psql']),
  'sqlite': new Set(['sql', 'relational', 'embedded']),
  'redis': new Set(['cache', 'caching', 'in-memory', 'key-value']),
  'elasticsearch': new Set(['elastic', 'search', 'full-text-search']),
  'dynamodb': new Set(['aws', 'nosql', 'document', 'key-value']),
  'cassandra': new Set(['nosql', 'distributed', 'time-series']),
  'firestore': new Set(['firebase', 'google', 'nosql']),
  'sql': new Set(['database', 'relational', 'mysql', 'postgresql', 'sqlite', 'query', 'queries', 'data-retrieval']),
  'database': new Set(['db', 'mongodb', 'mysql', 'postgresql', 'data-storage']),
  'orm': new Set(['sqlalchemy', 'typeorm', 'sequelize', 'prisma', 'hibernate']),
  'prisma': new Set(['orm', 'database', 'node']),
  'sequelize': new Set(['orm', 'node', 'sql']),
  'typeorm': new Set(['orm', 'typescript', 'database']),
  
  // Cloud Platforms & Services
  'aws': new Set(['amazon', 'cloud', 'ec2', 's3', 'lambda', 'cloudformation', 'rds', 'dynamodb', 'sns', 'sqs']),
  'azure': new Set(['microsoft', 'cloud', 'cosmos', 'app-service', 'functions']),
  'gcp': new Set(['google', 'cloud', 'bigquery', 'dataflow', 'firestore', 'cloud-functions']),
  'heroku': new Set(['paas', 'cloud', 'deployment']),
  'vercel': new Set(['frontend', 'nextjs', 'deployment']),
  'netlify': new Set(['frontend', 'deployment', 'serverless']),
  'cloud': new Set(['aws', 'azure', 'gcp', 'heroku', 'cloud-computing']),
  'cloudformation': new Set(['infrastructure-as-code', 'iac', 'aws']),
  'terraform': new Set(['infrastructure-as-code', 'iac', 'infrastructure', 'automation']),
  
  // Containerization & Orchestration
  'docker': new Set(['containers', 'containerization', 'images', 'dockerfile']),
  'kubernetes': new Set(['k8s', 'orchestration', 'container', 'container-orchestration']),
  'docker-compose': new Set(['docker', 'multi-container', 'local-development']),
  'container': new Set(['docker', 'kubernetes', 'containerization']),
  
  // CI/CD & DevOps
  'devops': new Set(['ci/cd', 'cicd', 'jenkins', 'gitlab', 'github-actions', 'automation', 'continuous-integration', 'continuous-deployment']),
  'ci/cd': new Set(['jenkins', 'gitlab-ci', 'github-actions', 'circleci', 'travis-ci']),
  'jenkins': new Set(['ci', 'automation', 'pipeline', 'ci-cd']),
  'gitlab-ci': new Set(['ci', 'devops', 'gitlab']),
  'github-actions': new Set(['ci', 'automation', 'github']),
  'circleci': new Set(['ci', 'cloud', 'automation']),
  'ansible': new Set(['infrastructure', 'automation', 'configuration-management']),
  
  // Version Control & Tools
  'git': new Set(['github', 'gitlab', 'bitbucket', 'version-control', 'vcs', 'scm']),
  'github': new Set(['git', 'version-control', 'repository', 'coding']),
  'gitlab': new Set(['git', 'version-control', 'devops', 'cicd']),
  'bitbucket': new Set(['git', 'version-control', 'atlassian']),
  'svn': new Set(['version-control', 'subversion']),
  'jira': new Set(['agile', 'project-management', 'tracking', 'sprint']),
  'confluence': new Set(['documentation', 'wiki', 'knowledge-base']),
  'slack': new Set(['communication', 'team-collaboration']),
  'postman': new Set(['api-testing', 'rest', 'testing']),
  'swagger': new Set(['api-documentation', 'openapi', 'documentation']),
  
  // Testing & Quality Assurance
  'testing': new Set(['unit-test', 'integration-test', 'jest', 'junit', 'pytest', 'qa', 'quality-assurance', 'test-driven-development', 'tdd']),
  'jest': new Set(['testing', 'javascript', 'unit-testing']),
  'pytest': new Set(['testing', 'python', 'unit-testing']),
  'junit': new Set(['testing', 'java', 'unit-testing']),
  'mocha': new Set(['testing', 'javascript', 'bdd']),
  'selenium': new Set(['automation', 'browser-testing', 'e2e']),
  'cypress': new Set(['e2e-testing', 'javascript', 'testing']),
  'e2e': new Set(['end-to-end', 'testing', 'integration']),
  'qa': new Set(['quality-assurance', 'testing']),
  'code-coverage': new Set(['testing', 'metrics']),
  
  // Methodologies & Practices
  'agile': new Set(['scrum', 'kanban', 'sprint', 'flexible', 'iterative']),
  'scrum': new Set(['agile', 'sprint', 'team-based']),
  'kanban': new Set(['agile', 'workflow', 'continuous-flow']),
  'sprint': new Set(['agile', 'iteration', 'time-boxed']),
  'waterfall': new Set(['traditional', 'sequential']),
  'clean-code': new Set(['maintainable', 'readable', 'best-practices']),
  'solid': new Set(['design-principles', 'oop', 'maintainability']),
  'design-patterns': new Set(['architecture', 'solutions', 'best-practices']),
  'mvcarchitecture': new Set(['model-view-controller', 'design', 'separation-of-concerns']),
  
  // Data Science & Analytics
  'machine-learning': new Set(['ml', 'ai', 'artificial-intelligence', 'data-science', 'neural-networks']),
  'data-science': new Set(['analytics', 'machine-learning', 'statistics', 'data-analysis']),
  'tensorflow': new Set(['machine-learning', 'deep-learning', 'neural-networks']),
  'pytorch': new Set(['machine-learning', 'deep-learning', 'neural-networks']),
  'scikit-learn': new Set(['machine-learning', 'python']),
  'pandas': new Set(['data-analysis', 'python']),
  'numpy': new Set(['numerical-computing', 'python']),
  'analytics': new Set(['data-driven', 'insights', 'metrics']),
  'big-data': new Set(['hadoop', 'spark', 'large-scale']),
  
  // Soft Skills & Business
  'communication': new Set(['collaboration', 'teamwork', 'interpersonal', 'presentation']),
  'leadership': new Set(['management', 'mentoring', 'team-management']),
  'problem-solving': new Set(['analytical', 'critical-thinking', 'creativity']),
  'documentation': new Set(['technical-writing', 'knowledge-sharing']),
  'code-review': new Set(['collaboration', 'quality', 'feedback']),
  'mentoring': new Set(['leadership', 'coaching', 'knowledge-sharing']),
  'project-management': new Set(['planning', 'coordination', 'delivery']),
};

/**
 * Extracts keywords from a block of text.
 * @param text The text to parse (e.g., a resume or job description).
 * @returns A Set of unique, lowercased keywords.
 */
export const extractKeywords = (text: string): Set<string> => {
  if (!text) return new Set();
  // Match words, including those with special characters like C++ or Node.js
  const words = text.match(/[\w\-.+#]+/g) || [];
  const keywords = new Set(
    words
      .map(word => word.toLowerCase())
      .filter(word => !STOP_WORDS.has(word) && word.length > 1 && isNaN(parseInt(word)))
  );
  return keywords;
};

/**
 * Checks if two keywords match, considering synonyms and variations.
 */
const keywordsMatch = (keyword1: string, keyword2: string): boolean => {
  if (keyword1 === keyword2) return true;
  
  const normalized1 = keyword1.replace(/[-_.]/g, '');
  const normalized2 = keyword2.replace(/[-_.]/g, '');
  
  if (normalized1 === normalized2) return true;
  
  // Check direct synonyms
  if (KEYWORD_SYNONYMS[keyword1]?.has(keyword2)) return true;
  if (KEYWORD_SYNONYMS[keyword2]?.has(keyword1)) return true;
  
  // Check if keyword1 is a synonym of any entry, and keyword2 matches
  for (const [key, synonyms] of Object.entries(KEYWORD_SYNONYMS)) {
    if (synonyms.has(keyword1) && (key === keyword2 || synonyms.has(keyword2))) {
      return true;
    }
  }
  
  return false;
};

/**
 * Checks if resume contains a match for the job keyword.
 */
const findMatchInResume = (jobKeyword: string, resumeKeywords: Set<string>): boolean => {
  // Direct match
  if (resumeKeywords.has(jobKeyword)) return true;
  
  // Check synonyms
  for (const resumeKeyword of resumeKeywords) {
    if (keywordsMatch(jobKeyword, resumeKeyword)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Calculates the ATS score and finds missing keywords.
 * Uses an improved scoring algorithm that properly rewards high match percentages.
 * @param jobKeywords An array of keywords from the job description.
 * @param resumeKeywords A Set of keywords from the user's resume.
 * @returns An object with the score and an array of missing keywords.
 */
export const calculateAtsScore = (
  jobKeywords: string[] | undefined,
  resumeKeywords: Set<string>
): { score: number; missing: string[] } => {
  if (!jobKeywords || jobKeywords.length === 0) {
    return { score: 100, missing: [] }; // If job has no keywords, it's a perfect match by default
  }

  const requiredKeywords = new Set(jobKeywords.map(kw => kw.toLowerCase()).filter(kw => !STOP_WORDS.has(kw)));
  if (requiredKeywords.size === 0) {
    return { score: 100, missing: [] };
  }

  let matchedCount = 0;
  const missing: string[] = [];

  requiredKeywords.forEach(keyword => {
    if (findMatchInResume(keyword, resumeKeywords)) {
      matchedCount++;
    } else {
      missing.push(keyword);
    }
  });

  // Calculate match percentage
  const matchPercentage = (matchedCount / requiredKeywords.size);
  
  // Improved scoring algorithm:
  // - 0-50%: Linear scale from 20-50
  // - 50-80%: Linear scale from 50-75
  // - 80-90%: Linear scale from 75-85
  // - 90-100%: Exponential boost from 85-100 (rewards high match rates)
  let score: number;
  
  if (matchPercentage <= 0.5) {
    score = 20 + (matchPercentage * 60); // 20 to 50
  } else if (matchPercentage <= 0.8) {
    score = 50 + ((matchPercentage - 0.5) / 0.3 * 25); // 50 to 75
  } else if (matchPercentage <= 0.9) {
    score = 75 + ((matchPercentage - 0.8) / 0.1 * 10); // 75 to 85
  } else {
    // Exponential boost for 90-100% match
    score = 85 + ((matchPercentage - 0.9) / 0.1 * 15); // 85 to 100
  }
  
  // Cap between 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  return { score, missing };
};
