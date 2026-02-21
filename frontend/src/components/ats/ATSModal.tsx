import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Briefcase, Percent, Eraser, Upload } from 'lucide-react'; // Added Upload icon
import { useATS } from '../../contexts/ATSContext';
import { calculateAtsScore, extractKeywords } from '../../lib/ats';

interface ATSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ATSModal: React.FC<ATSModalProps> = ({ isOpen, onClose }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescText, setJobDescText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const resumeInputRef = useRef<HTMLInputElement>(null);
  
  // Get state and functions from the global context
  const { atsResult, isAnalyzing, startAnalysis, finishAnalysis, resetATS } = useATS();

  // Populate resume text from the last analyzed resume from context when modal opens
  useEffect(() => {
    if (isOpen && atsResult?.analyzedResumeText) {
      setResumeText(atsResult.analyzedResumeText);
    }
  }, [isOpen, atsResult]);

  // Handle resume file upload
  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setResumeText(content);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file. Please try again.');
    };

    // Handle PDF files
    if (file.type === 'application/pdf') {
      alert('PDF support coming soon. Please use .txt or .doc files for now.');
      return;
    }

    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (isAnalyzing || !resumeText || !jobDescText) return;

    startAnalysis(); // Signal that analysis has begun globally

    try {
      const resumeWords = extractKeywords(resumeText);
      const jobKeywords = Array.from(extractKeywords(jobDescText));
      const { score, missing } = calculateAtsScore(jobKeywords, resumeWords);

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate analysis delay
      
      finishAnalysis(score, missing, resumeText); // Update GLOBAL state with the result
    } catch (error) {
      console.error("Analysis failed:", error);
      finishAnalysis(0, [], ''); // Reset or signal error globally
    }
  };

  const handleReset = () => {
    resetATS(); // Clear global ATS state
    setResumeText('');
    setJobDescText('');
    setResumeFileName('');
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-4xl bg-gray-800 rounded-2xl shadow-lg border border-gray-700 max-h-[90vh] flex flex-col"
          >
            <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
              <h2 className="text-xl font-bold text-white">ATS Job Scan</h2>
              <div className="flex items-center gap-2">
                <button onClick={handleReset} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm">
                    <Eraser size={18} /> Reset
                </button>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
              </div>
            </header>
            
            <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="resume" className="flex items-center gap-2 text-lg font-semibold text-white mb-2"><FileText size={20} /> Your Resume</label>
                  
                  {/* File Upload Section */}
                  <div className="mb-3">
                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".txt,.doc,.docx"
                      onChange={handleResumeFileChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => resumeInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-semibold"
                    >
                      <Upload size={18} /> Upload Resume File
                    </button>
                    {resumeFileName && (
                      <p className="text-sm text-green-400 mt-2">✓ Loaded: {resumeFileName}</p>
                    )}
                  </div>

                  <textarea id="resume" value={resumeText} onChange={e => setResumeText(e.target.value)} rows={10} placeholder="Or paste your resume text here..." className="w-full p-3 bg-gray-900 rounded-md text-gray-300 border border-gray-700 focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label htmlFor="job-desc" className="flex items-center gap-2 text-lg font-semibold text-white mb-2"><Briefcase size={20} /> Job Description</label>
                  <textarea id="job-desc" value={jobDescText} onChange={e => setJobDescText(e.target.value)} rows={10} placeholder="Paste the job description here..." className="w-full p-3 bg-gray-900 rounded-md text-gray-300 border border-gray-700 focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-900/50 rounded-lg p-6 flex flex-col items-center justify-center">
                {!atsResult && !isAnalyzing ? ( // Display a message if no analysis has been done yet
                  <div className="text-center text-gray-400">
                    <Percent size={48} className="mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Your score will appear here</h3>
                    <p className="text-sm">Fill in both fields and click "Analyze" to see your match score.</p>
                  </div>
                ) : isAnalyzing ? (
                  <div className="w-12 h-12 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin" />
                ) : (atsResult && ( // Display results from the global context
                  <div className="text-center w-full">
                    <p className="text-gray-400 text-sm">ATS Match Score</p>
                    <p className={`text-7xl font-bold ${atsResult.score >= 75 ? 'text-green-400' : 'text-red-400'}`}>{atsResult.score}%</p>
                    {atsResult.missingKeywords.length > 0 && (
                      <div className="mt-4 text-left w-full bg-red-900/50 p-3 rounded-md">
                        <h4 className="font-semibold text-red-300 mb-2">Missing Critical Skills:</h4>
                        <ul className="text-red-400 text-sm list-disc list-inside">
                          {atsResult.missingKeywords.map(kw => <li key={kw}>{kw}</li>)}
                        </ul>
                      </div>
                    )}
                    {atsResult.score >= 75 && atsResult.missingKeywords.length === 0 && (
                        <p className="mt-4 text-green-400 font-semibold">Great match! Your resume covers all required skills.</p>
                    )}
                  </div>
                ))}
              </div>
            </main>

            <footer className="p-4 border-t border-gray-700 flex-shrink-0">
              <button onClick={handleAnalyze} disabled={!resumeText || !jobDescText || isAnalyzing} className="w-full bg-purple-600 text-white font-bold py-3 rounded-md hover:bg-purple-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed">
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ATSModal;