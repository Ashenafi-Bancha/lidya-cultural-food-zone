import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { toast } from 'sonner';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data) {
        login(data.accessToken, data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        navigate('/admin');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1008] flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#d4a843] mb-2" style={{ fontFamily: "var(--font-lidya-serif)" }}>
            Lidya Admin
          </h1>
          <p className="text-[#e8dcc8]/50 text-sm" style={{ fontFamily: "var(--font-lidya-sans)" }}>
            Sign in to manage your restaurant
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border p-8 flex flex-col gap-5"
          style={{ background: "rgba(30,16,8,0.55)", borderColor: "rgba(232,220,200,0.12)" }}
        >
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#e8dcc8]/50 mb-2" style={{ fontFamily: "var(--font-lidya-sans)" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border text-sm px-4 py-3 focus:outline-none focus:border-[#d4a843]/55 transition-colors"
              style={{
                fontFamily: "var(--font-lidya-sans)",
                background: "rgba(30,16,8,0.35)",
                borderColor: "rgba(232,220,200,0.18)",
                color: "#f5efe6",
              }}
              placeholder="admin@lidya.com"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-[#e8dcc8]/50 mb-2" style={{ fontFamily: "var(--font-lidya-sans)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border text-sm px-4 py-3 focus:outline-none focus:border-[#d4a843]/55 transition-colors"
              style={{
                fontFamily: "var(--font-lidya-sans)",
                background: "rgba(30,16,8,0.35)",
                borderColor: "rgba(232,220,200,0.18)",
                color: "#f5efe6",
              }}
              placeholder="••••••••"
              required
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            className="mt-2 py-4 text-[11px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ fontFamily: "var(--font-lidya-sans)", background: "#c25e2a", color: "#faf5ee" }}
            whileHover={!loading ? { backgroundColor: "#d4a843", color: "#1e1008" } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Signing in…
              </>
            ) : "Sign In"}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-[#e8dcc8]/30 text-xs" style={{ fontFamily: "var(--font-lidya-sans)" }}>
          © Lidya Cultural Food Zone — Admin Panel
        </p>
      </motion.div>
    </div>
  );
}
