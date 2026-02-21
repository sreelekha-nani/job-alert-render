import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { fetchJobsAPI } from '../services/api';
import JobCard from '../components/jobs/JobCard';
import JobFilterSection, { JobFilters } from '../components/jobs/JobFilterSection';
import ATSModal from '../components/ats/ATSModal';
import { useAuth } from '../contexts/AuthContext';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string | null;
  experienceLevel?: string | null;
  jobType?: string;
  keywords?: string[];
  atsScore?: number;
}

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  
  // Master list of all jobs fetched from the API
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  
  // State for currently selected filters
  const [filters, setFilters] = useState<JobFilters>({
    jobTitle: 'All',
    jobType: 'All',
    location: 'All',
    experienceLevel: 'All',
    salaryRange: 'All',
  });
  
  // Loading state ONLY for the initial data fetch
  const [loading, setLoading] = useState(true);
  const [isATSModalOpen, setIsATSModalOpen] = useState(false);

  // This useEffect fetches all jobs ONCE on component mount.
  // The empty dependency array [] ensures it runs only one time.
  useEffect(() => {
    const loadAllJobs = async () => {
      setLoading(true);
      const jobsData = await fetchJobsAPI();
      setAllJobs(jobsData);
      setLoading(false);
    };
    
    loadAllJobs();
  }, []); // Empty array = runs once on mount

  // Client-side filtering logic.
  // `useMemo` ensures this only recalculates when `allJobs` or `filters` change.
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const { jobTitle, jobType, location, experienceLevel, salaryRange } = filters;
      
      const titleMatch = jobTitle === 'All' || job.title.toLowerCase().includes(jobTitle.toLowerCase());
      const typeMatch = jobType === 'All' || job.jobType === jobType;
      const locationMatch = location === 'All' || job.location === location;
      const experienceMatch = experienceLevel === 'All' || job.experienceLevel === experienceLevel;
      const salaryMatch = salaryRange === 'All' || job.salary === salaryRange;

      return titleMatch && typeMatch && locationMatch && experienceMatch && salaryMatch;
    });
  }, [allJobs, filters]);

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const welcomeMessage = authLoading ? 'Loading...' : `Welcome, ${user?.name || 'Guest'} 👋`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto p-4 md:p-8"
    >
      <h1 className="text-4xl font-bold text-white mb-6">{welcomeMessage}</h1>
      
      <button
        onClick={() => setIsATSModalOpen(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg mb-8"
      >
        Open ATS Job Scan
      </button>
      <ATSModal isOpen={isATSModalOpen} onClose={() => setIsATSModalOpen(false)} />

      <h2 className="text-3xl text-white mb-4">Job Filters</h2>
      <JobFilterSection onFilterChange={handleFilterChange} filters={filters} loading={loading} />

      <h2 className="text-3xl text-white mt-10 mb-4">Recommended Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* --- THIS IS THE CORRECTED RENDER LOGIC --- */}
        {/* It depends ONLY on `loading` state and the length of the derived `filteredJobs` array */}
        {loading ? (
          // 1. Show loader during initial fetch
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-lg h-56 animate-pulse" />
          ))
        ) : allJobs.length === 0 ? (
          // 2. If not loading and NO jobs exist at all in database
          <div className="md:col-span-3 text-center py-16 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400 text-lg mb-2">No jobs available at the moment.</p>
            <p className="text-gray-500 text-sm">Jobs will be automatically updated every 12 hours.</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          // 3. If jobs exist and match filters, render the job cards
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          // 4. If jobs exist but don't match current filters
          <div className="md:col-span-3 text-center py-10 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400 text-lg">No jobs found matching your criteria.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
