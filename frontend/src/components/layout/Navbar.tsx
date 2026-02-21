import React from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Menu } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-30 h-16 w-full glass flex items-center justify-between px-4 md:px-8"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-300 hover:text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">AI Job Finder</h1>
      </div>

      <div className="flex items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative text-gray-300 hover:text-white transition-colors hover:neon-glow-violet-sm rounded-full p-2"
          aria-label="Notifications"
        >
          <Bell size={22} />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-300 hover:text-white transition-colors hover:neon-glow-violet-sm rounded-full p-2"
          aria-label="Profile"
        >
          <User size={22} />
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
