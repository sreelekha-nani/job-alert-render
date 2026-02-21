import React from 'react';
import { motion } from 'framer-motion';
import { useAppliedJobs } from '../contexts/AppliedJobsContext';
import { Briefcase, MapPin, CheckCircle } from 'lucide-react';

const MyJobsPage: React.FC = () => {
  const { appliedJobs } = useAppliedJobs();
  const jobsArray = Array.from(appliedJobs.values()).sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4 md:p-8"
    >
      <h1 className="text-4xl font-bold text-white mb-8">My Applied Jobs</h1>

      {jobsArray.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobsArray.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
            >
              <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">{job.title}</h3>
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <Briefcase size={14} className="mr-2" /> {job.company}
                <span className="mx-2">|</span>
                <MapPin size={14} className="mr-2" /> {job.location}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-600">
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                    <CheckCircle size={18} />
                    {job.status}
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">ATS Score</p>
                    <p className="font-bold text-xl text-green-400">{job.atsScore}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-800/50 rounded-lg">
          <h2 className="text-2xl font-semibold text-white">No Applied Jobs Yet</h2>
          <p className="text-gray-400 mt-2">Start applying to jobs from the dashboard to see them here.</p>
        </div>
      )}
    </motion.div>
  );
};

export default MyJobsPage;
