import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiLock, FiMail, FiUserPlus, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

import WizzyboxLogo from '../components/WizzyboxLogo';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const notifyRegistration = async (admin) => {
  try {
    await fetch(`${API}/admin-notify/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: admin.name,
        username: admin.username,
        email: admin.email,
      }),
    });
  } catch { /* silent */ }
};

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm]       = useState({ name: '', username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors]   = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim())                          errs.name     = 'Full name is required';
    if (!form.username.trim())                      errs.username = 'Username is required';
    if (form.username.length < 3)                   errs.username = 'Minimum 3 characters';
    if (!/\S+@\S+\.\S+/.test(form.email))           errs.email    = 'Valid email required';
    if (form.password.length < 6)                   errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirm)             errs.confirm  = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const result = register({
      name: form.name,
      username: form.username,
      email: form.email,
      password: form.password,
    });

    if (result.success) {
      notifyRegistration({ name: form.name, username: form.username, email: form.email });
      setSuccess(true);
      setTimeout(() => navigate('/admin-login'), 1800);
    } else {
      setErrors({ username: result.error });
    }
  };

  const setField = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => ({ ...p, [field]: '' }));
  };

  if (success) {
    return (
      <div className="auth-root">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <WizzyboxLogo size="sm" showTagline={true} />
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
          <h2 className="auth-title">Account Created!</h2>
          <p className="auth-subtitle">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-root">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      <div className="auth-card">
        <div className="auth-logo">
          <WizzyboxLogo size="sm" showTagline={true} />
        </div>

        <div className="auth-divider" />

        <h2 className="auth-title">Create Admin Account</h2>
        <p className="auth-subtitle">Register to manage the VMS dashboard</p>

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Full Name */}
          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <div className="auth-input-wrap">
              <FiUser className="auth-input-icon" />
              <input className={`auth-input ${errors.name ? 'auth-input-error' : ''}`}
                placeholder="Your full name"
                value={form.name} onChange={e => setField('name', e.target.value)} />
            </div>
            {errors.name && <span className="auth-field-error">{errors.name}</span>}
          </div>

          {/* Username */}
          <div className="auth-field">
            <label className="auth-label">Username</label>
            <div className="auth-input-wrap">
              <FiUser className="auth-input-icon" />
              <input className={`auth-input ${errors.username ? 'auth-input-error' : ''}`}
                placeholder="Choose a username"
                value={form.username} onChange={e => setField('username', e.target.value)} />
            </div>
            {errors.username && <span className="auth-field-error">{errors.username}</span>}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrap">
              <FiMail className="auth-input-icon" />
              <input className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                type="email" placeholder="admin@wizzybox.com"
                value={form.email} onChange={e => setField('email', e.target.value)} />
            </div>
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <FiLock className="auth-input-icon" />
              <input className={`auth-input ${errors.password ? 'auth-input-error' : ''}`}
                type={showPwd ? 'text' : 'password'} placeholder="Min 6 characters"
                value={form.password} onChange={e => setField('password', e.target.value)} />
              <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(p => !p)}>
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <div className="auth-input-wrap">
              <FiLock className="auth-input-icon" />
              <input className={`auth-input ${errors.confirm ? 'auth-input-error' : ''}`}
                type="password" placeholder="Re-enter password"
                value={form.confirm} onChange={e => setField('confirm', e.target.value)} />
            </div>
            {errors.confirm && <span className="auth-field-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="auth-submit-btn">
            <FiUserPlus size={16} /> Create Account
          </button>
        </form>

        <div className="auth-divider" />

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/admin-login" className="auth-link">
            <FiArrowLeft size={13} /> Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
