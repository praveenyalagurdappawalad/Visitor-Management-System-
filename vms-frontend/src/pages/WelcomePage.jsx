import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  FiPlay, FiArrowRight, FiList, FiGrid,
  FiUserPlus, FiShield, FiClock, FiCheckCircle, FiX, FiUsers
} from 'react-icons/fi';
import WizzyboxLogo from '../components/WizzyboxLogo';

// YouTube video ID — visitor management system intro
const VIDEO_ID = 'hGRE4a_qKcQ';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="welcome-root">

      {/* ── Navbar ── */}
      <nav className="welcome-nav">
        <div className="welcome-nav-logo">
          <WizzyboxLogo size="sm" light={true} />
        </div>
        <div className="welcome-nav-links">
          <Link to="/" className="wnl active">Home</Link>
          <Link to="/waiting" className="wnl">Waiting List</Link>
          <Link to="/admin" className="wnl">Admin</Link>
          <Link to="/feedback" className="wnl">Feedback</Link>
        </div>
        <button className="welcome-nav-cta" onClick={() => navigate('/register')}>
          <FiUserPlus /> Check In
        </button>
      </nav>

      {/* ── Hero Section ── */}
      <section className="hero-section">
        {/* Left */}
        <div className="hero-left">
          <div className="hero-tag">
            <FiShield size={13} /> Secure &amp; Smart Visitor Management
          </div>
          <h1 className="hero-title">
            Welcome to<br />
            <span className="hero-brand">Wizzybox</span>
          </h1>
          <p className="hero-sub">
            Fast, secure, and seamless check-ins for your workplace.
            Manage visitors, track entries, and stay in control — all in one place.
          </p>

          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={() => navigate('/register')}>
              <FiUserPlus /> Register as Visitor <FiArrowRight />
            </button>
            <button className="btn-hero-outline" onClick={() => navigate('/waiting')}>
              <FiList /> View Waiting List
            </button>
          </div>

          {/* Stats row */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">2</span>
              <span className="hero-stat-label">Locations</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">24/7</span>
              <span className="hero-stat-label">Monitoring</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">100%</span>
              <span className="hero-stat-label">Digital</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="hero-right">
          {/* Video card — click to open modal */}
          <div className="hero-video-card" onClick={() => setShowModal(true)}>
            {/* YouTube thumbnail as background */}
            <img
              src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
              alt="VMS Introduction Video"
              className="hero-video-thumb"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="hero-video-overlay" />
            <div className="hero-video-inner">
              <div className="hero-play-btn">
                <FiPlay />
              </div>
              <p className="hero-video-label">Watch Introduction</p>
            </div>
            <div className="hero-float-badge top-right">
              <FiCheckCircle color="#059669" />
              <span>Visitor Approved</span>
            </div>
            <div className="hero-float-badge bottom-left">
              <FiClock color="#4f46e5" />
              <span>Check-in: 09:15 AM</span>
            </div>
          </div>

          {/* Quick access cards */}
          <div className="hero-quick-cards">
            <div className="hero-quick-card" onClick={() => navigate('/register')}>
              <div className="hqc-icon" style={{ background: '#eff6ff' }}><FiUserPlus color="#4f46e5" /></div>
              <div>
                <div className="hqc-title">New Visitor</div>
                <div className="hqc-sub">Register &amp; check in</div>
              </div>
              <FiArrowRight color="#94a3b8" size={14} />
            </div>
            <div className="hero-quick-card" onClick={() => navigate('/waiting')}>
              <div className="hqc-icon" style={{ background: '#f5f3ff' }}><FiList color="#7c3aed" /></div>
              <div>
                <div className="hqc-title">Waiting List</div>
                <div className="hqc-sub">View current visitors</div>
              </div>
              <FiArrowRight color="#94a3b8" size={14} />
            </div>
            <div className="hero-quick-card" onClick={() => navigate('/admin')}>
              <div className="hqc-icon" style={{ background: '#ecfdf5' }}><FiGrid color="#059669" /></div>
              <div>
                <div className="hqc-title">Admin Panel</div>
                <div className="hqc-sub">Manage &amp; monitor</div>
              </div>
              <FiArrowRight color="#94a3b8" size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Photo Gallery Section ── */}
      <section className="gallery-section">
        <div className="gallery-inner">

          {/* Section header */}
          <div className="gallery-header">
            <div className="gallery-tag">Our Spaces</div>
            <h2 className="gallery-title">Wizzybox &amp; NammaQA</h2>
            <p className="gallery-sub">
              A glimpse into our modern offices and world-class training facilities
            </p>
          </div>

          {/* Bento grid */}
          <div className="gallery-grid">

            {/* Large — Wizzybox office lobby */}
            <div className="gallery-card gallery-card-large">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop"
                alt="Wizzybox Office Lobby"
              />
              <div className="gallery-card-overlay">
                <span className="gallery-card-tag wizzybox-tag">🏢 Wizzybox</span>
                <div className="gallery-card-label">Modern Office Lobby</div>
              </div>
            </div>

            {/* Medium — Training room */}
            <div className="gallery-card gallery-card-medium">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop"
                alt="NammaQA Training Room"
              />
              <div className="gallery-card-overlay">
                <span className="gallery-card-tag nammaqa-tag">🎓 NammaQA</span>
                <div className="gallery-card-label">Training Center</div>
              </div>
            </div>

            {/* Small — Reception desk */}
            <div className="gallery-card gallery-card-small">
              <img
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&auto=format&fit=crop"
                alt="Reception Desk"
              />
              <div className="gallery-card-overlay">
                <span className="gallery-card-tag wizzybox-tag">🏢 Wizzybox</span>
                <div className="gallery-card-label">Reception Desk</div>
              </div>
            </div>

            {/* Small — Team meeting */}
            <div className="gallery-card gallery-card-small">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&auto=format&fit=crop"
                alt="Team Meeting"
              />
              <div className="gallery-card-overlay">
                <span className="gallery-card-tag wizzybox-tag">🏢 Wizzybox</span>
                <div className="gallery-card-label">Team Collaboration</div>
              </div>
            </div>

            {/* Medium — Classroom training */}
            <div className="gallery-card gallery-card-medium">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop"
                alt="NammaQA Classroom"
              />
              <div className="gallery-card-overlay">
                <span className="gallery-card-tag nammaqa-tag">🎓 NammaQA</span>
                <div className="gallery-card-label">Classroom Sessions</div>
              </div>
            </div>

            {/* Small — Open workspace */}
            <div className="gallery-card gallery-card-small">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop"
                alt="Open Workspace"
              />
              <div className="gallery-card-overlay">
                <span className="gallery-card-tag wizzybox-tag">🏢 Wizzybox</span>
                <div className="gallery-card-label">Open Workspace</div>
              </div>
            </div>

            {/* Small — Lab / hands-on */}
            <div className="gallery-card gallery-card-small">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop"
                alt="Hands-on Lab"
              />
              <div className="gallery-card-overlay">
                <span className="gallery-card-tag nammaqa-tag">🎓 NammaQA</span>
                <div className="gallery-card-label">Hands-on Lab</div>
              </div>
            </div>

          </div>

          {/* Legend */}
          <div className="gallery-legend">
            <div className="gallery-legend-item">
              <span className="gallery-legend-dot" style={{ background: '#4f46e5' }} />
              <span>Wizzybox — Technology Company</span>
            </div>
            <div className="gallery-legend-sep" />
            <div className="gallery-legend-item">
              <span className="gallery-legend-dot" style={{ background: '#7c3aed' }} />
              <span>NammaQA — Training Center</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Footer strip ── */}
      <footer className="welcome-footer">
        <span>© 2026 <strong>Wizzybox</strong></span>
        <span className="wf-dot" />
        <span>Powered by <strong>NammaQA Training Center</strong></span>
        <span className="wf-dot" />
        <span>Visitor Management System</span>
      </footer>

      {/* ── YouTube Video Modal ── */}
      {showModal && (
        <div className="video-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="video-modal-box" onClick={e => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setShowModal(false)}>
              <FiX size={20} />
            </button>
            <div className="video-modal-header">
              <div className="video-modal-logo"><FiUsers size={16} /></div>
              <div>
                <div className="video-modal-title">Wizzybox VMS — Introduction</div>
                <div className="video-modal-sub">How modern visitor management works</div>
              </div>
            </div>
            <div className="video-modal-player">
              <iframe
                src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                title="Visitor Management System Introduction"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-modal-footer">
              <span>🏢 Wizzybox Visitor Management System</span>
              <span>·</span>
              <span>Powered by NammaQA Training Center</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
