import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Briefcase } from 'lucide-react';

const mockNotifications = [
  { type: 'new_match', content: 'New job match: Senior AI Engineer at OpenAI', time: '5m ago', icon: Bell, color: 'text-primary' },
  { type: 'auto_apply', content: 'Auto-applied to Full-Stack Developer at Vercel', time: '1h ago', icon: CheckCircle, color: 'text-green-400' },
  { type: 'saved_job', content: 'Reminder: Apply to Product Manager at Google', time: '3h ago', icon: Briefcase, color: 'text-yellow-400' },
  { type: 'new_match', content: 'New job match: Data Scientist at Netflix', time: 'yesterday', icon: Bell, color: 'text-primary' },
  { type: 'auto_apply', content: 'Auto-applied to DevOps Engineer at Amazon', time: 'yesterday', icon: CheckCircle, color: 'text-green-400' },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } },
};

const TimelineItem: React.FC<{
  type: string;
  content: string;
  time: string;
  icon: React.ElementType;
  color: string;
  isLast?: boolean;
}> = ({ content, time, icon: Icon, color, isLast }) => {
  return (
    <motion.li variants={itemVariants} className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full glass ${color}`}>
          <Icon size={20} />
        </div>
        {!isLast && <div className="w-px flex-grow bg-border my-2" />}
      </div>
      <div className="flex-grow pb-8">
        <p className="text-white">{content}</p>
        <p className="text-sm text-muted-foreground mt-1">{time}</p>
      </div>
    </motion.li>
  );
};


const AlertsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 md:p-8"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Notifications & Timeline</h1>
        <p className="text-muted-foreground">Stay updated with your job search activity.</p>
      </header>

      <div className="max-w-3xl mx-auto">
        <motion.ul
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {mockNotifications.map((item, index) => (
            <TimelineItem
              key={index}
              {...item}
              isLast={index === mockNotifications.length - 1}
            />
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
};

export default AlertsPage;
