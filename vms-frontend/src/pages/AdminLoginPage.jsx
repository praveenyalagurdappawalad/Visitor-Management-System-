import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiUser, FiLock, FiLogIn, FiUserPlus,
  FiEye, FiEyeOff, FiMail, FiArrowLeft,
  FiKey, FiRefreshCw, FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

import WizzyboxLogo from '../components/WizzyboxLogo';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const notifyBackend = async (type, admin) => {
  try {
    await fetch(`${API}/admin-notify/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: admin.name || admin.username,
        username: admin.username,
        email: admin.email || '—',
      }),
    });
  } catch { /* silent — don't block UI */ }
};

// ── Step components ────────────────────────────────────────

function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [tab, setTab]         = useState('username'); // 'username' | 'email'
  const [form, setForm]       = useState({ username: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (f, v) => { setForm(p => ({ ...p, [f]: v })); setError(''); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      let result;
      if (tab === 'username') {
        if (!form.username || !form.password) { setError('Fill in all fields'); setLoading(false); return; }
        result = login(form.username, form.password);
      } else {
        if (!form.email || !form.password) { setError('Fill in all fields'); setLoading(false); return; }
        result = login(form.email, form.password); // email used as username fallback
        if (!result.success) {
          // try matching by email field
          const admins = JSON.parse(localStorage.getItem('vms_admins') || '[]');
          const found = admins.find(a => a.email === form.email && a.password === form.password);
          if (found) {
            result = login(found.username, found.password);
          }
        }
      }
      if (result.success) {
        notifyBackend('login', result.admin || { username: tab === 'username' ? form.username : form.email, name: '', email: '' });
        onSuccess();
      }
      else { setError(result.error || 'Invalid credentials'); setLoading(false); }
    }, 600);
  };

  return (
    <>
      {/* Tab switcher */}
      <div className="auth-tabs">
        <button className={`auth-tab ${tab === 'username' ? 'active' : ''}`} onClick={() => setTab('username')}>
          <FiUser size={13} /> Username
        </button>
        <button className={`auth-tab ${tab === 'email' ? 'active' : ''}`} onClick={() => setTab('email')}>
          <FiMail size={13} /> Email
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {tab === 'username' ? (
          <div className="auth-field">
            <label className="auth-label">Username</label>
            <div className="auth-input-wrap">
              <FiUser className="auth-input-icon" />
              <input className="auth-input" placeholder="Enter your username"
                value={form.username} onChange={e => setField('username', e.target.value)} autoComplete="username" />
            </div>
          </div>
        ) : (
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <FiMail className="auth-input-icon" />
              <input className="auth-input" type="email" placeholder="admin@wizzybox.com"
                value={form.email} onChange={e => setField('email', e.target.value)} autoComplete="email" />
            </div>
          </div>
        )}

        <div className="auth-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="auth-label">Password</label>
            <button type="button" className="auth-forgot-link" onClick={() => onSuccess('forgot')}>
              Forgot password?
            </button>
          </div>
          <div className="auth-input-wrap">
            <FiLock className="auth-input-icon" />
            <input className="auth-input" type={showPwd ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password} onChange={e => setField('password', e.target.value)} autoComplete="current-password" />
            <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(p => !p)}>
              {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? <span className="auth-spinner" /> : <FiLogIn size={16} />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </>
  );
}

// ── Forgot Password Flow ───────────────────────────────────

function ForgotPassword({ onBack }) {
  const [step, setStep]       = useState(1); // 1=email, 2=otp, 3=new password, 4=done
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [newPwd, setNewPwd]   = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const startTimer = () => {
    setResendTimer(60);
    const t = setInterval(() => {
      setResendTimer(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; });
    }, 1000);
  };

  const sendOtp = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/otp/send`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setStep(2); startTimer(); }
      else { const d = await res.json(); setError(d.error || 'Failed to send OTP'); }
    } catch { setError('Server not reachable'); }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/otp/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (res.ok) { setStep(3); }
      else { const d = await res.json(); setError(d.error || 'Invalid OTP'); }
    } catch { setError('Server not reachable'); }
    setLoading(false);
  };

  const resetPassword = () => {
    if (newPwd.length < 6) { setError('Minimum 6 characters'); return; }
    if (newPwd !== confirm) { setError('Passwords do not match'); return; }
    const admins = JSON.parse(localStorage.getItem('vms_admins') || '[]');
    const idx = admins.findIndex(a => a.email === email);
    if (idx === -1) { setError('No admin found with this email'); return; }
    admins[idx].password = newPwd;
    localStorage.setItem('vms_admins', JSON.stringify(admins));
    setStep(4);
  };

  return (
    <div className="auth-form">
      <button className="auth-back-inline" onClick={onBack}>
        <FiArrowLeft size={14} /> Back to login
      </button>

      {/* Step 1 — Enter email */}
      {step === 1 && (
        <>
          <h3 className="auth-step-title">Reset Password</h3>
          <p className="auth-step-sub">Enter your registered email to receive an OTP</p>
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <FiMail className="auth-input-icon" />
              <input className="auth-input" type="email" placeholder="admin@wizzybox.com"
                value={email} onChange={e => { setEmail(e.target.value); setError(''); }} />
            </div>
          </div>
          {error && <div className="auth-error">⚠ {error}</div>}
          <button className="auth-submit-btn" onClick={sendOtp} disabled={loading}>
            {loading ? <span className="auth-spinner" /> : <FiMail size={16} />}
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      )}

      {/* Step 2 — Enter OTP */}
      {step === 2 && (
        <>
          <h3 className="auth-step-title">Enter OTP</h3>
          <p className="auth-step-sub">
            A 6-digit OTP was sent to <strong>{email}</strong>
          </p>
          <div className="auth-field">
            <label className="auth-label">OTP Code</label>
            <div className="auth-input-wrap">
              <FiKey className="auth-input-icon" />
              <input className="auth-input" placeholder="Enter 6-digit OTP"
                value={otp} maxLength={6}
                onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                style={{ letterSpacing: '6px', fontSize: '1.2rem', fontWeight: 700 }} />
            </div>
          </div>
          {error && <div className="auth-error">⚠ {error}</div>}
          <button className="auth-submit-btn" onClick={verifyOtp} disabled={loading}>
            {loading ? <span className="auth-spinner" /> : <FiCheckCircle size={16} />}
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button className="auth-resend-btn" onClick={sendOtp} disabled={resendTimer > 0}>
            <FiRefreshCw size={13} />
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </>
      )}

      {/* Step 3 — New password */}
      {step === 3 && (
        <>
          <h3 className="auth-step-title">New Password</h3>
          <p className="auth-step-sub">OTP verified! Set your new password</p>
          <div className="auth-field">
            <label className="auth-label">New Password</label>
            <div className="auth-input-wrap">
              <FiLock className="auth-input-icon" />
              <input className="auth-input" type="password" placeholder="Min 6 characters"
                value={newPwd} onChange={e => { setNewPwd(e.target.value); setError(''); }} />
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <div className="auth-input-wrap">
              <FiLock className="auth-input-icon" />
              <input className="auth-input" type="password" placeholder="Re-enter password"
                value={confirm} onChange={e => { setConfirm(e.target.value); setError(''); }} />
            </div>
          </div>
          {error && <div className="auth-error">⚠ {error}</div>}
          <button className="auth-submit-btn" onClick={resetPassword}>
            <FiCheckCircle size={16} /> Reset Password
          </button>
        </>
      )}

      {/* Step 4 — Done */}
      {step === 4 && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
          <h3 className="auth-step-title">Password Reset!</h3>
          <p className="auth-step-sub">Your password has been updated successfully.</p>
          <button className="auth-submit-btn" style={{ marginTop: 16 }} onClick={onBack}>
            <FiLogIn size={16} /> Back to Login
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [view, setView] = useState('login'); // 'login' | 'forgot'

  const handleLoginSuccess = (action) => {
    if (action === 'forgot') { setView('forgot'); return; }
    navigate('/admin');
  };

  return (
    <div className="auth-root">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <WizzyboxLogo size="sm" showTagline={true} />
        </div>

        <div className="auth-divider" />

        {view === 'login' ? (
          <>
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-subtitle">Sign in to access the admin dashboard</p>
            <LoginForm onSuccess={handleLoginSuccess} />
            <div className="auth-divider" />
            <p className="auth-switch">
              New admin?{' '}
              <Link to="/admin-register" className="auth-link">
                <FiUserPlus size={13} /> Create account
              </Link>
            </p>
            <p className="auth-hint">Default: <strong>admin</strong> / <strong>admin123</strong></p>
          </>
        ) : (
          <ForgotPassword onBack={() => setView('login')} />
        )}
      </div>
    </div>
  );
}
