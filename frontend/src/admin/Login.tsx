import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, UtensilsCrossed, AlertCircle } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    if (!password) {
      newErrors.password = 'Password is required.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const data = await authService.login(email, password);
      if (data) {
        login(data.accessToken, data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate('/admin');
      }
    } catch (error: any) {
      setErrors({ form: 'Incorrect email or password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f8f6] flex flex-col items-center justify-center p-4 sm:p-8" style={{ fontFamily: "var(--font-lidya-sans, sans-serif)" }}>
      {/* Container */}
      <motion.div 
        className="w-full max-w-[420px] flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8dcc8]/40 overflow-hidden">
          
          {/* Header Section */}
          <div className="px-6 sm:px-8 pt-10 pb-6 flex flex-col items-center text-center border-b border-[#f0ebe1]/50">
            <div className="w-12 h-12 rounded-full bg-[#1e1008] flex items-center justify-center mb-5 shadow-md">
              <UtensilsCrossed className="w-6 h-6 text-[#d4a843]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1e1008] mb-1.5 tracking-wide" style={{ fontFamily: "var(--font-lidya-serif, serif)" }}>
              Lidya Cultural Food Zone
            </h1>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#8c827a] font-medium">
              Restaurant Management Dashboard
            </p>
          </div>

          {/* Body Section */}
          <div className="px-6 sm:px-8 py-8">
            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-[#1e1008] mb-2" style={{ fontFamily: "var(--font-lidya-serif, serif)" }}>
                Welcome Back!
              </h2>
              <p className="text-sm text-[#736a62] leading-relaxed">
                Sign in to manage today's menu, restaurant operations, tables, reservations, and settings.
              </p>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
              {errors.form && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 border border-red-100 overflow-hidden"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{errors.form}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1e1008] uppercase tracking-wider" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    disabled={loading}
                    className={`w-full px-4 py-3 rounded-lg border bg-[#faf9f7] text-[#1e1008] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${errors.email ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' : 'border-[#e8dcc8]'}`}
                    placeholder="admin@lidyafoodzone.com"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs text-red-500 mt-1 font-medium">
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#1e1008] uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    disabled={loading}
                    className={`w-full px-4 py-3 pr-12 rounded-lg border bg-[#faf9f7] text-[#1e1008] text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${errors.password ? 'border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-500' : 'border-[#e8dcc8]'}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a39b93] hover:text-[#1e1008] transition-colors focus:outline-none p-1 disabled:opacity-50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs text-red-500 mt-1 font-medium">
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 rounded border border-[#c2b5a3] bg-white peer-checked:bg-[#1e1008] peer-checked:border-[#1e1008] transition-colors group-hover:border-[#1e1008]"></div>
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm text-[#736a62] group-hover:text-[#1e1008] transition-colors select-none">
                    Remember me
                  </span>
                </label>
                
                <a href="#" className="text-sm text-[#c25e2a] hover:text-[#d4a843] font-medium transition-colors focus:outline-none focus:underline" onClick={(e) => e.preventDefault()}>
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 px-4 bg-[#1e1008] hover:bg-[#2c180c] text-white rounded-lg font-medium text-[13px] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#d4a843]" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-[#a39b93]">
          <p>© 2026 Lidya Cultural Food Zone</p>
          <p className="mt-1">Restaurant Management System</p>
        </div>
      </motion.div>
    </div>
  );
}
