import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Job } from '../pages/Dashboard'; // Assuming Dashboard exports the base Job type
import { useAuth } from './AuthContext';

export interface AppliedJob extends Job {
  appliedAt: string;
  status: 'Applied';
}

interface AppliedJobsContextType {
  appliedJobs: Map<string, AppliedJob>;
  addAppliedJob: (job: Job, atsScore: number) => void;
  isJobApplied: (jobId: string) => boolean;
}

const AppliedJobsContext = createContext<AppliedJobsContextType | undefined>(undefined);

export const AppliedJobsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState<Map<string, AppliedJob>>(() => {
    // Load applied jobs only for the current user
    if (!user?.id) return new Map();
    try {
      const userKey = `appliedJobs_${user.id}`;
      const storedJobs = localStorage.getItem(userKey);
      return storedJobs ? new Map(JSON.parse(storedJobs)) : new Map();
    } catch (error) {
      return new Map();
    }
  });

  // Clear and reload applied jobs when user changes
  useEffect(() => {
    if (!user?.id) {
      setAppliedJobs(new Map());
      return;
    }

    try {
      const userKey = `appliedJobs_${user.id}`;
      const storedJobs = localStorage.getItem(userKey);
      setAppliedJobs(storedJobs ? new Map(JSON.parse(storedJobs)) : new Map());
    } catch (error) {
      setAppliedJobs(new Map());
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    
    const userKey = `appliedJobs_${user.id}`;
    localStorage.setItem(userKey, JSON.stringify(Array.from(appliedJobs.entries())));
  }, [appliedJobs, user?.id]);

  const addAppliedJob = (job: Job, atsScore: number) => {
    if (appliedJobs.has(job.id)) return; // Don't add if already applied

    const newAppliedJob: AppliedJob = {
      ...job,
      atsScore: atsScore,
      appliedAt: new Date().toISOString(),
      status: 'Applied',
    };
    
    setAppliedJobs(prevJobs => new Map(prevJobs).set(job.id, newAppliedJob));
  };

  const isJobApplied = (jobId: string): boolean => {
    return appliedJobs.has(jobId);
  };

  const value = {
    appliedJobs,
    addAppliedJob,
    isJobApplied,
  };

  return (
    <AppliedJobsContext.Provider value={value}>
      {children}
    </AppliedJobsContext.Provider>
  );
};

export const useAppliedJobs = () => {
  const context = useContext(AppliedJobsContext);
  if (!context) {
    throw new Error('useAppliedJobs must be used within an AppliedJobsProvider');
  }
  return context;
};
