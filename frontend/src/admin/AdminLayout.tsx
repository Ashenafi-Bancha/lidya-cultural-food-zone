import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function AdminLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/menu', label: 'Menu Management' },
    { to: '/admin/reservations', label: 'Reservations' },
    { to: '/admin/branches', label: 'Branches' },
    { to: '/admin/gallery', label: 'Media & Gallery' },
  ];

  return (
    <div className="flex h-screen bg-[#f5efe6] text-[#2a1a0e] font-sans">
      <aside className="w-64 bg-[#2a1a0e] text-[#f5efe6] p-6 hidden md:flex flex-col">
        <h2 className="text-xl font-bold mb-8 text-[#d4a843]" style={{ fontFamily: "var(--font-lidya-serif)" }}>Lidya Admin</h2>
        <nav className="flex flex-col gap-1 flex-1">
          {links.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-[#c25e2a] text-white'
                    : 'hover:text-[#d4a843] hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        {user && (
          <div className="pt-4 border-t border-white/10 mt-auto">
            <p className="text-xs text-[#e8dcc8]/50 mb-1">Signed in as</p>
            <p className="text-sm font-medium text-[#d4a843]">{user.name}</p>
            <p className="text-xs text-[#e8dcc8]/40">{user.role}</p>
          </div>
        )}
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="md:hidden">
            <h2 className="text-lg font-bold text-[#2a1a0e]" style={{ fontFamily: "var(--font-lidya-serif)" }}>Lidya Admin</h2>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link to="/" className="text-sm text-[#7a5c3a] hover:text-[#c25e2a] transition-colors">
              ← Back to Site
            </Link>
            <button
              onClick={() => { logout(); navigate('/admin/login'); }}
              className="px-4 py-2 bg-[#c25e2a] text-white rounded text-sm hover:bg-[#a54c20] transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
