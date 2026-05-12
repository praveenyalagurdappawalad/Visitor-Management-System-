import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useVisitor } from '../context/VisitorContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setCurrentVisitor, DEPARTMENTS } = useVisitor();

  const [form, setForm] = useState({
    name: '', mobile: '', email: '', department: '', purpose: '', host: ''
  });
  const [errors, setErrors] = useState({});

  const departments  = Object.keys(DEPARTMENTS);
  const purposes     = form.department ? DEPARTMENTS[form.department].purposes   : [];
  const employees    = form.department ? DEPARTMENTS[form.department].employees  : [];

  const setField = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'department' ? { purpose: '', host: '' } : {}),
    }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())             errs.name       = 'Name is required';
    if (!/^\d{10}$/.test(form.mobile)) errs.mobile     = 'Valid 10-digit number required';
    if (!form.department)              errs.department  = 'Select a company';
    if (!form.purpose)                 errs.purpose     = 'Select a purpose';
    if (!form.host)                    errs.host        = 'Select a person to meet';
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setCurrentVisitor(form);
    navigate('/camera');
  };

  return (
    <div className="reg-root">
      {/* Spheres background */}
      <div className="register-sphere register-sphere-1" />
      <div className="register-sphere register-sphere-2" />
      <div className="register-sphere register-sphere-3" />
      <div className="register-sphere register-sphere-4" />
      <div className="register-sphere register-sphere-5" />
      <div className="register-sphere-glass" />

      <div className="reg-container">
        {/* Back */}
        <button className="reg-back-btn" onClick={() => navigate('/')}>
          <FiArrowLeft size={16} /> Back
        </button>

        {/* Title */}
        <div className="reg-title-block">
          <h1 className="reg-title">Visitor Check-In</h1>
          <p className="reg-subtitle">Fill in your details to notify your host</p>
        </div>

        {/* Form card */}
        <div className="reg-card">

          {/* Row 1 — Name + Phone */}
          <div className="reg-row">
            <div className="reg-field">
              <label className="reg-label">Visitor Name <span className="reg-req">*</span></label>
              <input
                className={`reg-input ${errors.name ? 'reg-input-error' : ''}`}
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
              />
              {errors.name && <span className="reg-error">{errors.name}</span>}
            </div>
            <div className="reg-field">
              <label className="reg-label">Phone Number <span className="reg-req">*</span></label>
              <input
                className={`reg-input ${errors.mobile ? 'reg-input-error' : ''}`}
                placeholder="10-digit mobile number"
                value={form.mobile}
                inputMode="numeric"
                pattern="[0-9]*"
                type="tel"
                onChange={e => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setField('mobile', digits);
                }}
                maxLength={10}
              />
              {errors.mobile && <span className="reg-error">{errors.mobile}</span>}
            </div>
          </div>

          {/* Row 2 — Email + Company */}
          <div className="reg-row">
            <div className="reg-field">
              <label className="reg-label">Email Address</label>
              <input
                className="reg-input"
                placeholder="your@email.com (optional)"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                type="email"
              />
            </div>
            <div className="reg-field">
              <label className="reg-label">Company / Organisation <span className="reg-req">*</span></label>
              <select
                className={`reg-input reg-select ${errors.department ? 'reg-input-error' : ''}`}
                value={form.department}
                onChange={e => setField('department', e.target.value)}
              >
                <option value="">— Select Company —</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.department && <span className="reg-error">{errors.department}</span>}
            </div>
          </div>

          {/* Row 3 — Purpose + Person to Meet */}
          <div className="reg-row reg-row-bottom">

            {/* Purpose tiles */}
            <div className="reg-field">
              <label className="reg-label">Purpose of Visit <span className="reg-req">*</span></label>
              {purposes.length === 0 ? (
                <p className="reg-placeholder-text">Select a company first</p>
              ) : (
                <div className="reg-purpose-grid">
                  {purposes.map(p => (
                    <button
                      key={p}
                      type="button"
                      className={`reg-purpose-tile ${form.purpose === p ? 'active' : ''}`}
                      onClick={() => setField('purpose', p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
              {errors.purpose && <span className="reg-error">{errors.purpose}</span>}
            </div>

            {/* Person to meet cards */}
            <div className="reg-field">
              <label className="reg-label">Person to Meet <span className="reg-req">*</span></label>
              {employees.length === 0 ? (
                <p className="reg-placeholder-text">Select a company first</p>
              ) : (
                <div className="reg-person-list">
                  {employees.map(emp => {
                    const name = typeof emp === 'string' ? emp : emp.name;
                    const role = typeof emp === 'string' ? '' : emp.role;
                    return (
                      <button
                        key={name}
                        type="button"
                        className={`reg-person-card ${form.host === name ? 'active' : ''}`}
                        onClick={() => setField('host', name)}
                      >
                        <span className="reg-person-avatar">🧑‍💼</span>
                        <span className="reg-person-info">
                          <span className="reg-person-name">{name}</span>
                          {role && <span className="reg-person-role">{role}</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.host && <span className="reg-error">{errors.host}</span>}
            </div>

          </div>

          {/* Submit */}
          <button className="reg-submit-btn" onClick={handleNext}>
            Next: Take Photo <FiArrowRight size={16} />
          </button>

        </div>
      </div>
    </div>
  );
}
