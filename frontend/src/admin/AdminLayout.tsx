import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNoIndex } from '../hooks/useNoIndex';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/menu', label: 'Menu Management' },
  { to: '/admin/reservations', label: 'Reservations' },
  { to: '/admin/events', label: 'Event Bookings' },
  { to: '/admin/branches', label: 'Branches' },
  { to: '/admin/gallery', label: 'Media & Gallery' },
  { to: '/admin/testimonials', label: 'Testimonials' },
];

export function AdminLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useNoIndex();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 flex-1">
      {links.map(link => {
        const isActive = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={`px-3 py-3 md:py-2.5 rounded text-sm transition-colors ${
              isActive
                ? 'bg-[#c25e2a] text-white'
                : 'text-[#f5efe6]/80 hover:text-[#d4a843] hover:bg-white/5'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  const UserPanel = () =>
    user ? (
      <div className="pt-4 border-t border-white/10 mt-auto">
        <p className="text-xs text-[#e8dcc8]/50 mb-1">Signed in as</p>
        <p className="text-sm font-medium text-[#d4a843]">{user.name}</p>
        <p className="text-xs text-[#e8dcc8]/40">{user.role}</p>
      </div>
    ) : null;

  return (
    <div className="flex h-screen bg-[#f5efe6] text-[#2a1a0e] font-sans">
      {/* Desktop sidebar */}
      <aside className="w-64 bg-[#2a1a0e] text-[#f5efe6] p-6 hidden md:flex flex-col shrink-0">
        <h2 className="text-xl font-bold mb-8 text-[#d4a843]" style={{ fontFamily: "var(--font-lidya-serif)" }}>Lidya Admin</h2>
        <NavLinks />
        <UserPanel />
      </aside>

      {/* Mobile slide-in drawer + backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              className="fixed top-0 left-0 z-50 h-full w-72 max-w-[82%] bg-[#2a1a0e] text-[#f5efe6] p-6 flex flex-col md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-[#d4a843]" style={{ fontFamily: "var(--font-lidya-serif)" }}>Lidya Admin</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-2 -mr-2 text-[#f5efe6]/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <NavLinks onNavigate={() => setMobileOpen(false)} />
              <div className="flex flex-col gap-2 pt-4">
                <Link to="/" className="text-sm text-[#e8dcc8]/60 hover:text-[#d4a843] py-2 transition-colors">← Back to Site</Link>
              </div>
              <UserPanel />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between gap-3 bg-[#2a1a0e] text-[#f5efe6] px-4 h-14 shrink-0 shadow-md">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="p-2 -ml-2 text-[#f5efe6] hover:text-[#d4a843] transition-colors"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <h2 className="text-base font-bold text-[#d4a843]" style={{ fontFamily: "var(--font-lidya-serif)" }}>Lidya Admin</h2>
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-2 bg-[#c25e2a] text-white rounded hover:bg-[#a54c20] transition-colors"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          {/* Desktop top actions */}
          <div className="hidden md:flex justify-end items-center gap-4 px-8 pt-6">
            <Link to="/" className="text-sm text-[#7a5c3a] hover:text-[#c25e2a] transition-colors">← Back to Site</Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#c25e2a] text-white rounded text-sm hover:bg-[#a54c20] transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="p-4 sm:p-6 md:px-8 md:pb-8 md:pt-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
