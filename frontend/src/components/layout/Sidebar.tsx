import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, Bell, User, LogOut, X } from 'lucide-react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'My Jobs', icon: Briefcase, path: '/my-jobs' },
  { name: 'Alerts', icon: Bell, path: '/alerts' },
  { name: 'Profile', icon: User, path: '/profile' },
];

const bottomItems = [
    { name: 'Logout', icon: LogOut, path: '#' }, // Path is '#' for logout, handled by onClick
]

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const sidebarVariants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

// Renamed from NavLink to NavItem to avoid confusion with react-router-dom's NavLink
const NavItem: React.FC<{ name: string; icon: React.ElementType; path: string; onClick?: () => void }> = ({ name, icon: Icon, path, onClick }) => {
  // Using react-router-dom's NavLink component for navigation and active class
  return (
    <NavLink
      to={path}
      onClick={onClick} // onClick for logout or custom actions
      className={({ isActive: routerIsActive }) => // Use routerIsActive from NavLink props
        `flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer ${
          routerIsActive
            ? 'bg-purple-600 text-white' // Active link style
            : 'text-gray-300 hover:bg-white/10 hover:text-white' // Inactive link style
        }`
      }
    >
      <Icon size={20} className="mr-4" />
      <span className="font-medium">{name}</span>
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth(); // Get logout function from context

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="absolute inset-0 bg-black/50 md:hidden"
            aria-hidden="true"
          />
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 h-full w-64 bg-gray-900/80 backdrop-blur-lg z-40 flex flex-col border-r border-purple-500/20"
          >
            <div className="flex items-center justify-between p-4 h-16 border-b border-purple-500/20">
              <h2 className="text-2xl font-bold text-white">job alert</h2>
              <button
                onClick={toggleSidebar}
                className="md:hidden text-gray-300 hover:text-white transition-colors"
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <NavItem key={item.name} name={item.name} icon={item.icon} path={item.path} />
              ))}
            </nav>
            <div className="p-4 border-t border-purple-500/20 space-y-2">
              {bottomItems.map((item) => (
                <NavItem 
                  key={item.name} 
                  name={item.name} 
                  icon={item.icon} 
                  path={item.path} 
                  onClick={item.name === 'Logout' ? logout : undefined} 
                />
              ))}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export const DesktopSidebar: React.FC = () => {
  const { logout } = useAuth(); // Get logout function from context

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-gray-900/90 backdrop-blur-lg h-screen sticky top-0 border-r border-purple-500/20">
      <div className="flex items-center justify-center p-4 h-16 border-b border-purple-500/20">
        <h2 className="text-2xl font-bold text-white">Job Alert System</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.name} name={item.name} icon={item.icon} path={item.path} />
        ))}
      </nav>
      <div className="p-4 border-t border-purple-500/20 space-y-2">
        {bottomItems.map((item) => (
          <NavItem 
            key={item.name} 
            name={item.name} 
            icon={item.icon} 
            path={item.path} 
            onClick={item.name === 'Logout' ? logout : undefined} 
          />
        ))}
      </div>
    </aside>
  );
};


export default Sidebar;