import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiList, FiGrid, FiUserPlus, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import WizzyboxLogo from './WizzyboxLogo';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="nav-bar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <WizzyboxLogo size="sm" />
      </Link>

      <div className="nav-links">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>
          <FiGrid size={14} /> Home
        </Link>
        <Link to="/waiting" className={pathname === '/waiting' ? 'active' : ''}>
          <FiList size={14} /> Waiting List
        </Link>
        <Link to={admin ? '/admin' : '/admin-login'} className={pathname === '/admin' ? 'active' : ''}>
          <FiGrid size={14} /> Admin
        </Link>
        <Link to="/register" className="nav-register-btn">
          <FiUserPlus size={14} /> Check In
        </Link>
      </div>

      {admin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 500 }}>
            👤 {admin.name || admin.username}
          </span>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8, border: '1.5px solid #fecdd3',
              background: '#fff1f2', color: '#e11d48', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
          >
            <FiLogOut size={13} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
