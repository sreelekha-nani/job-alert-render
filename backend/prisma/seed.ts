import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const jobsData = [
  {
    title: 'Senior Frontend Developer',
    company: 'Vercel',
    location: 'Remote',
    experienceLevel: '5-8 years',
    salary: '180-220k USD',
    keywords: ['react', 'nextjs', 'typescript'],
    descriptionEmbedding: [],
    url: 'https://vercel.com/careers/senior-frontend-engineer',
    description: 'Lead our frontend team and build beautiful, high-performance web applications.',
  },
  {
    title: 'Backend Engineer (Node.js)',
    company: 'Stripe',
    location: 'USA',
    experienceLevel: '3-5 years',
    salary: '160-200k USD',
    keywords: ['nodejs', 'api', 'postgres'],
    descriptionEmbedding: [],
    url: 'https://stripe.com/jobs/listing/backend-engineer/12345',
    description: 'Design and implement robust APIs and backend services for our payment infrastructure.',
  },
  {
    title: 'Full Stack Engineer',
    company: 'OpenAI',
    location: 'Remote',
    experienceLevel: '3-5 years',
    salary: '200-250k USD',
    keywords: ['react', 'python', 'ai'],
    descriptionEmbedding: [],
    url: 'https://openai.com/careers/full-stack-engineer',
    description: 'Work across the stack to build products powered by our cutting-edge AI models.',
  },
  {
    title: 'Junior React Developer',
    company: 'Meta',
    location: 'Hyderabad',
    experienceLevel: '0-1 years',
    salary: '8-12 LPA',
    keywords: ['react', 'javascript', 'css'],
    descriptionEmbedding: [],
    url: 'https://www.metacareers.com/jobs/12345/',
    description: 'An exciting internship opportunity to work on the React core team.',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const job of jobsData) {
    // Use upsert to avoid creating duplicate jobs if the seed script is run multiple times.
    // It finds a job by its unique URL and creates it only if it doesn't exist.
    const createdJob = await prisma.job.upsert({
      where: { url: job.url },
      update: {},
      create: job,
    });
    console.log(`Created or found job with id: ${createdJob.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });