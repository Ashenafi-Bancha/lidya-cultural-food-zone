import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import logoImg from '../imports/lidya-logo2.PNG';

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
    <div className="min-h-screen bg-[#1e1008] flex flex-col items-center justify-center p-4 sm:p-8" style={{ fontFamily: "var(--font-lidya-sans, sans-serif)" }}>
      {/* Container */}
      <motion.div 
        className="w-full max-w-[420px] flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        
        {/* Card */}
        <div className="rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-[#d4a843]/40 overflow-hidden relative" style={{ background: "rgba(30,16,8,0.85)" }}>
          {/* Premium Top Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4a843] to-transparent opacity-70"></div>
          
          {/* Header Section */}
          <div className="px-6 sm:px-8 pt-10 pb-6 flex flex-col items-center text-center border-b" style={{ borderColor: "rgba(232,220,200,0.1)" }}>
            <div className="w-20 h-20 mb-5 flex items-center justify-center overflow-hidden rounded-full border-2 border-[#d4a843]/30 shadow-lg bg-[#1e1008]">
              <img src={logoImg} alt="Lidya Cultural Food Zone Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#d4a843] mb-1.5 tracking-wide" style={{ fontFamily: "var(--font-lidya-serif, serif)" }}>
              Lidya Cultural Food Zone
            </h1>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#e8dcc8]/60 font-medium">
              Restaurant Management Dashboard
            </p>
          </div>

          {/* Body Section */}
          <div className="px-6 sm:px-8 py-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-[#f5efe6] mb-2" style={{ fontFamily: "var(--font-lidya-serif, serif)" }}>
                Welcome Back!
              </h2>
              <p className="text-sm text-[#e8dcc8]/80 tracking-wide">
                Sign in to manage your restaurant
              </p>
            </div>

            {/* Error Alert */}
            <AnimatePresence>
              {errors.form && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-start gap-3 border border-red-500/20 overflow-hidden"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{errors.form}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-[#e8dcc8]/60 uppercase tracking-[0.15em]" htmlFor="email">
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
                    className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${errors.email ? 'border-red-500/80 focus:ring-red-500/20' : 'border-[#d4a843]/30 hover:border-[#d4a843]/60'}`}
                    style={{
                      background: "rgba(20,10,5,0.6)",
                      color: "#f5efe6",
                    }}
                    placeholder="Enter your email"
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs text-red-400 mt-1 font-medium">
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-semibold text-[#e8dcc8]/60 uppercase tracking-[0.15em]" htmlFor="password">
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
                    className={`w-full px-4 py-3 pr-12 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${errors.password ? 'border-red-500/80 focus:ring-red-500/20' : 'border-[#d4a843]/30 hover:border-[#d4a843]/60'}`}
                    style={{
                      background: "rgba(20,10,5,0.6)",
                      color: "#f5efe6",
                    }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-[#d4a843]/70 hover:text-[#d4a843] transition-colors focus:outline-none p-1 disabled:opacity-50 flex items-center justify-center cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-xs text-red-400 mt-1 font-medium">
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
                    <div className="w-4 h-4 rounded border border-[#e8dcc8]/30 bg-transparent peer-checked:bg-[#d4a843] peer-checked:border-[#d4a843] transition-colors group-hover:border-[#d4a843]/70"></div>
                    <svg className="absolute w-3 h-3 text-[#1e1008] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm text-[#e8dcc8]/70 group-hover:text-[#f5efe6] transition-colors select-none">
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
                className="w-full mt-4 py-3.5 px-4 rounded-lg font-semibold text-[12px] uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                style={{ background: "#c25e2a", color: "#faf5ee" }}
                whileHover={!loading ? { backgroundColor: "#d4a843", color: "#1e1008" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
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
        <div className="mt-8 text-center text-xs text-[#e8dcc8]/40">
          <p>© 2026 Lidya Cultural Food Zone</p>
          <p className="mt-1">Restaurant Management System</p>
        </div>
      </motion.div>
    </div>
  );
}
