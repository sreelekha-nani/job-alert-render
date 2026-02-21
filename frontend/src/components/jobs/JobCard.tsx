import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, X, AlertTriangle, Mail } from 'lucide-react';
import { Job } from '../../pages/Dashboard';
import { useATS } from '../../contexts/ATSContext';
import { useAppliedJobs } from '../../contexts/AppliedJobsContext';
import { useAuth } from '../../contexts/AuthContext';

// A simple, reusable alert component
const Alert: React.FC<{ message: string; show: boolean; onClose: () => void }> = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
    >
      <Check />
      {message}
    </motion.div>
  );
};

interface JobCardProps {
  job: Job;
}

type ApplyStatus = 'idle' | 'loading' | 'success';

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { title, company, location, id } = job;
  const { atsResult } = useATS();
  const { user } = useAuth();
  const { addAppliedJob, isJobApplied } = useAppliedJobs();
  
  const [applyStatus, setApplyStatus] = useState<ApplyStatus>('idle');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('Successfully applied for this job');

  // Only use ATS score if analysis has been performed
  const hasPerformedAnalysis = atsResult !== null;
  const score = hasPerformedAnalysis ? atsResult.score : 0;
  const missingKeywords = hasPerformedAnalysis ? atsResult.missingKeywords : [];
  
  const isEligibleToApply = hasPerformedAnalysis && score >= 70;
  const hasBeenApplied = isJobApplied(id);
  // Only show warning if analysis has been performed AND score is below threshold
  const showWarning = hasPerformedAnalysis && !isEligibleToApply && missingKeywords.length > 0 && !hasBeenApplied;

  // Send email to HR when user applies
  const sendApplicationEmail = async () => {
    if (!user?.email) return;

    try {
      const response = await fetch('/api/alerts/send-application-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`, 
        },
        body: JSON.stringify({
          jobId: id,
          jobTitle: title,
          company: company,
          jobLocation: location,
          atsScore: score,
          applicantName: user.name,
          applicantEmail: user.email,
          hrEmail: 'test@example.com', // Send HR email
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ ${result.message}`);
      } else {
        console.warn(`⚠️ ${result.message}`);
        setAlertMessage(result.message); // Show error from backend
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setAlertMessage('An unexpected error occurred. Please try again.');
      setShowAlert(true);
    }
  };

  const handleAutoApply = async () => {
    if (!isEligibleToApply || applyStatus !== 'idle' || hasBeenApplied) return;

    setApplyStatus('loading');
    
    // Record the application
    addAppliedJob(job, score);
    
    // Send email in the background
    await sendApplicationEmail();
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    setApplyStatus('success');
    setAlertMessage(`🎉 Application sent successfully! The HR team at ${company} will review your profile.`);
    setShowAlert(true); // Trigger the alert
  };

  const atsColor = hasPerformedAnalysis ? (score >= 70 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400') : 'text-gray-400';
  
  const getButtonState = () => {
    if (hasBeenApplied || applyStatus === 'success') {
        return { text: 'Applied', class: 'bg-green-600 cursor-not-allowed', icon: <Check size={16}/> };
    }
    if (applyStatus === 'loading') {
        return { text: 'Applying...', class: 'bg-purple-700 cursor-wait', icon: <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"/> };
    }
    if (!hasPerformedAnalysis) {
        return { text: 'Analyze Resume', class: 'bg-blue-600 hover:bg-blue-700', icon: <Zap size={16}/> };
    }
    if (isEligibleToApply) {
        return { text: 'Auto Apply', class: 'bg-purple-600 hover:bg-purple-700', icon: <Mail size={16}/> };
    }
    return { text: 'Improve Resume', class: 'bg-gray-500 cursor-not-allowed', icon: <X size={16}/> };
  };

  const buttonState = getButtonState();

  return (
    <>
      <Alert message={alertMessage} show={showAlert} onClose={() => setShowAlert(false)} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 p-6 rounded-lg flex flex-col border border-gray-700">
        {showWarning && (
          <div className="mb-3 p-2 bg-red-900/50 text-red-300 text-xs rounded-md">
            <p className="font-semibold flex items-center gap-2">
              <AlertTriangle size={14} /> Missing Skills: {missingKeywords.join(', ')}
            </p>
          </div>
        )}
        <div className="flex-grow">
          <h3 className="font-bold text-lg text-white">{title}</h3>
          <p className="text-gray-400 text-sm">{company} - {location}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">Your ATS Match</p>
            <p className={`font-bold text-2xl ${atsColor}`}>{score}%</p>
          </div>
          <motion.button
            onClick={handleAutoApply}
            disabled={!isEligibleToApply || hasBeenApplied || applyStatus !== 'idle'}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-colors w-36 ${buttonState.class} disabled:opacity-70`}
          >
            {buttonState.icon} {buttonState.text}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default JobCard;
