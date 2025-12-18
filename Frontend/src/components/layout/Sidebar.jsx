import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineHome, 
  HiOutlineChartBar, 
  HiOutlineFlag,
  HiOutlineCog,
  HiOutlineLogout,
  HiX
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import BrandMark from '../shared/BrandMark';

const navItems = [
  { path: '/', label: 'Dashboard', icon: HiOutlineHome },
  { path: '/analytics', label: 'Analytics', icon: HiOutlineChartBar },
  { path: '/campaigns', label: 'Campaigns', icon: HiOutlineFlag },
  { path: '/settings', label: 'Settings', icon: HiOutlineCog }
];

const sidebarVariants = {
  open: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  closed: {
    x: '-100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};

function Sidebar({ open, onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <BrandMark />
        <div>
          <p className="text-sm font-semibold text-ink-900">Impact Pulse</p>
          <p className="text-xs text-ink-500">Analytics Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-50 text-accent-600'
                      : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accent-500"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="border-t border-ink-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-ink-500 truncate">{user?.email || ''}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="p-2 text-ink-400 hover:text-ink-600 transition-colors"
            title="Sign out"
          >
            <HiOutlineLogout className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-1 flex-col border-r border-ink-100 bg-white">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 text-ink-500 hover:text-ink-700"
            >
              <HiX className="h-6 w-6" />
            </button>
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;


