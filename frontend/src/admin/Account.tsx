import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, ShieldOff, KeyRound, Mail, Eye, EyeOff } from 'lucide-react';
import { authService, AccountProfile, TwoFactorSetup } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';

const card = 'rounded-2xl border border-[#d4a843]/30 p-6 sm:p-7';
const cardStyle: React.CSSProperties = { background: 'rgba(30,16,8,0.6)' };
const label = 'block text-[10px] font-semibold text-[#e8dcc8]/60 uppercase tracking-[0.15em] mb-1.5';
const input =
  'w-full px-4 py-3 rounded-lg border border-[#d4a843]/30 hover:border-[#d4a843]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a843]/50 focus:border-[#d4a843] transition-all disabled:opacity-60';
const inputStyle: React.CSSProperties = { background: 'rgba(20,10,5,0.6)', color: '#f5efe6' };
const button =
  'py-3 px-5 rounded-lg font-semibold text-[11px] uppercase tracking-[0.15em] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed';

const errorMessage = (e: any, fallback: string) => e?.response?.data?.message || fallback;

export function Account() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const load = async () => {
    try {
      setProfile(await authService.me());
    } catch {
      toast.error('Could not load your account details.');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ── Password ──────────────────────────────────────────────────────────────
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) {
      toast.error('The new passwords do not match.');
      return;
    }
    setSavingPw(true);
    try {
      await authService.changePassword(pw.current, pw.next);
      // The server revoked every session, so this one is already dead — send the
      // user back to the login screen rather than leaving a broken page.
      toast.success('Password changed. Please sign in again.');
      logout();
      navigate('/admin/login');
    } catch (err: any) {
      toast.error(errorMessage(err, 'Could not change your password.'));
    } finally {
      setSavingPw(false);
    }
  };

  // ── Email ─────────────────────────────────────────────────────────────────
  const [em, setEm] = useState({ password: '', next: '' });
  const [savingEmail, setSavingEmail] = useState(false);

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmail(true);
    try {
      await authService.changeEmail(em.password, em.next);
      toast.success('Email address updated.');
      setEm({ password: '', next: '' });
      load();
    } catch (err: any) {
      toast.error(errorMessage(err, 'Could not update your email address.'));
    } finally {
      setSavingEmail(false);
    }
  };

  // ── Two-factor ────────────────────────────────────────────────────────────
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [enrollCode, setEnrollCode] = useState('');
  const [busy2fa, setBusy2fa] = useState(false);
  const [disableForm, setDisableForm] = useState({ password: '', code: '' });

  const startSetup = async () => {
    setBusy2fa(true);
    try {
      setSetup(await authService.twoFactorSetup());
    } catch (err: any) {
      toast.error(errorMessage(err, 'Could not start two-factor setup.'));
    } finally {
      setBusy2fa(false);
    }
  };

  const confirmSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy2fa(true);
    try {
      await authService.twoFactorEnable(enrollCode.replace(/\s/g, ''));
      toast.success('Two-factor authentication is on.');
      setSetup(null);
      setEnrollCode('');
      load();
    } catch (err: any) {
      toast.error(errorMessage(err, 'That code was not accepted.'));
    } finally {
      setBusy2fa(false);
    }
  };

  const disable2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy2fa(true);
    try {
      await authService.twoFactorDisable(disableForm.password, disableForm.code.replace(/\s/g, ''));
      toast.success('Two-factor authentication is off.');
      setDisableForm({ password: '', code: '' });
      load();
    } catch (err: any) {
      toast.error(errorMessage(err, 'Could not turn off two-factor authentication.'));
    } finally {
      setBusy2fa(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center py-24 text-[#e8dcc8]/60">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6" style={{ fontFamily: 'var(--font-lidya-sans, sans-serif)' }}>
      <div>
        <h1 className="text-2xl font-bold text-[#f5efe6]" style={{ fontFamily: 'var(--font-lidya-serif, serif)' }}>
          Account & Security
        </h1>
        <p className="text-sm text-[#e8dcc8]/70 mt-1">
          Signed in as <span className="text-[#d4a843]">{profile?.email}</span> ({profile?.role})
        </p>
      </div>

      {/* Two-factor */}
      <section className={card} style={cardStyle}>
        <div className="flex items-start gap-3 mb-5">
          {profile?.twoFactorEnabled ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldOff className="w-5 h-5 text-[#d4a843] shrink-0 mt-0.5" />
          )}
          <div>
            <h2 className="text-lg font-semibold text-[#f5efe6]">Two-Factor Authentication</h2>
            <p className="text-sm text-[#e8dcc8]/70 mt-1">
              {profile?.twoFactorEnabled
                ? 'On. Signing in needs your password and a code from your authenticator app.'
                : 'Off. Anyone who learns your password can sign in. Turning this on stops that.'}
            </p>
          </div>
        </div>

        {!profile?.twoFactorEnabled && !setup && (
          <button onClick={startSetup} disabled={busy2fa} className={button} style={{ background: '#c25e2a', color: '#faf5ee' }}>
            {busy2fa ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            Turn On Two-Factor
          </button>
        )}

        {!profile?.twoFactorEnabled && setup && (
          <form onSubmit={confirmSetup} className="space-y-5">
            <ol className="text-sm text-[#e8dcc8]/80 space-y-2 list-decimal list-inside">
              <li>Install Google Authenticator, Microsoft Authenticator, or any TOTP app.</li>
              <li>Scan this QR code with it.</li>
              <li>Enter the 6-digit code it shows to confirm.</li>
            </ol>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img
                src={setup.qrDataUrl}
                alt="Two-factor QR code"
                className="w-44 h-44 rounded-lg bg-white p-2 shrink-0"
              />
              <div className="min-w-0">
                <p className={label}>Can't scan? Enter this key by hand</p>
                <code className="block text-xs text-[#d4a843] break-all bg-[rgba(20,10,5,0.6)] border border-[#d4a843]/20 rounded-lg p-3">
                  {setup.secret}
                </code>
                <p className="text-xs text-[#e8dcc8]/50 mt-2">
                  Keep this key private — it is the second factor.
                </p>
              </div>
            </div>

            <div>
              <label className={label} htmlFor="enrollCode">Code from your app</label>
              <input
                id="enrollCode"
                inputMode="numeric"
                maxLength={7}
                value={enrollCode}
                onChange={(e) => setEnrollCode(e.target.value)}
                className={`${input} max-w-[200px] text-center text-lg tracking-[0.4em]`}
                style={inputStyle}
                placeholder="000000"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={busy2fa} className={button} style={{ background: '#c25e2a', color: '#faf5ee' }}>
                {busy2fa && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm & Enable
              </button>
              <button
                type="button"
                onClick={() => { setSetup(null); setEnrollCode(''); }}
                className={`${button} border border-[#d4a843]/30 text-[#e8dcc8]/80`}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {profile?.twoFactorEnabled && (
          <form onSubmit={disable2fa} className="space-y-4 border-t border-[#e8dcc8]/10 pt-5">
            <p className="text-sm text-[#e8dcc8]/60">
              To turn it off, confirm with your password and a current code.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label} htmlFor="d-pass">Current password</label>
                <input
                  id="d-pass"
                  type="password"
                  value={disableForm.password}
                  onChange={(e) => setDisableForm({ ...disableForm, password: e.target.value })}
                  className={input}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className={label} htmlFor="d-code">Authenticator code</label>
                <input
                  id="d-code"
                  inputMode="numeric"
                  maxLength={7}
                  value={disableForm.code}
                  onChange={(e) => setDisableForm({ ...disableForm, code: e.target.value })}
                  className={input}
                  style={inputStyle}
                  placeholder="000000"
                />
              </div>
            </div>
            <button type="submit" disabled={busy2fa} className={`${button} border border-red-500/40 text-red-300`}>
              {busy2fa && <Loader2 className="w-4 h-4 animate-spin" />}
              Turn Off Two-Factor
            </button>
          </form>
        )}
      </section>

      {/* Password */}
      <section className={card} style={cardStyle}>
        <div className="flex items-start gap-3 mb-5">
          <KeyRound className="w-5 h-5 text-[#d4a843] shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-[#f5efe6]">Change Password</h2>
            <p className="text-sm text-[#e8dcc8]/70 mt-1">
              At least 6 characters, with upper and lower case letters and a number.
              Changing it signs out every device.
            </p>
          </div>
        </div>

        <form onSubmit={submitPassword} className="space-y-4">
          <div>
            <label className={label} htmlFor="cur-pass">Current password</label>
            <div className="relative">
              <input
                id="cur-pass"
                type={showPw ? 'text' : 'password'}
                value={pw.current}
                onChange={(e) => setPw({ ...pw, current: e.target.value })}
                className={`${input} pr-12`}
                style={inputStyle}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4a843]/70 hover:text-[#d4a843] p-1"
                aria-label={showPw ? 'Hide passwords' : 'Show passwords'}
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="new-pass">New password</label>
              <input
                id="new-pass"
                type={showPw ? 'text' : 'password'}
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
                className={input}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className={label} htmlFor="confirm-pass">Confirm new password</label>
              <input
                id="confirm-pass"
                type={showPw ? 'text' : 'password'}
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                className={input}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={savingPw} className={button} style={{ background: '#c25e2a', color: '#faf5ee' }}>
            {savingPw && <Loader2 className="w-4 h-4 animate-spin" />}
            Change Password
          </button>
        </form>
      </section>

      {/* Email */}
      <section className={card} style={cardStyle}>
        <div className="flex items-start gap-3 mb-5">
          <Mail className="w-5 h-5 text-[#d4a843] shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-[#f5efe6]">Change Sign-In Email</h2>
            <p className="text-sm text-[#e8dcc8]/70 mt-1">
              This is the address you sign in with. Confirm with your password.
            </p>
          </div>
        </div>

        <form onSubmit={submitEmail} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label} htmlFor="em-pass">Current password</label>
              <input
                id="em-pass"
                type="password"
                value={em.password}
                onChange={(e) => setEm({ ...em, password: e.target.value })}
                className={input}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className={label} htmlFor="em-new">New email address</label>
              <input
                id="em-new"
                type="email"
                value={em.next}
                onChange={(e) => setEm({ ...em, next: e.target.value })}
                className={input}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={savingEmail} className={button} style={{ background: '#c25e2a', color: '#faf5ee' }}>
            {savingEmail && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Email
          </button>
        </form>
      </section>
    </div>
  );
}

export default Account;
