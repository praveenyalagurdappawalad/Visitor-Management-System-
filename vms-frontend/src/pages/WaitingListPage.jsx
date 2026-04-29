import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useVisitor } from '../context/VisitorContext';
import Navbar from '../components/Navbar';

const STATUS_TABS = ['all', 'waiting', 'approved', 'inprogress', 'exited'];

const STATUS_LABEL = { waiting: 'Waiting', approved: 'Approved', inprogress: 'In Progress', exited: 'Exited' };
const BADGE_CLASS  = { waiting: 'badge-waiting', approved: 'badge-approved', inprogress: 'badge-inprogress', exited: 'badge-exited' };

export default function WaitingListPage() {
  const navigate = useNavigate();
  const { visitors } = useVisitor();
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' ? visitors : visitors.filter(v => v.status === activeTab);

  return (
    <div className="wl-root">
      {/* Grid tile background */}
      <div className="wl-grid-bg" />

      <Navbar />

      <div className="wl-body">
        {/* Header */}
        <div className="wl-header">
          <div>
            <h2 className="wl-title">Waiting List</h2>
          </div>
          <p className="wl-subtitle">Real-time visitor status</p>
        </div>

        {/* Tabs */}
        <div className="wl-tabs">
          {STATUS_TABS.map(tab => {
            const count = tab === 'all' ? visitors.length : visitors.filter(v => v.status === tab).length;
            return (
              <button
                key={tab}
                className={`wl-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'all' ? 'All' : STATUS_LABEL[tab]}
                <span className="wl-tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="wl-empty">
            <FiUser size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p>No visitors in this category</p>
          </div>
        ) : (
          filtered.map(v => (
            <div className="wl-card" key={v.id}>
              {/* Avatar */}
              {v.photo ? (
                <img src={v.photo} alt={v.name} className="wl-avatar" />
              ) : (
                <div className="wl-avatar-placeholder">
                  <FiUser size={20} />
                </div>
              )}

              {/* Info */}
              <div className="wl-info">
                <div className="wl-name">{v.name}</div>
                <div className="wl-meta">{v.department} · {v.purpose} · Meeting: {v.host}</div>
                <div className="wl-meta">Check-in: {v.checkIn}</div>
              </div>

              {/* Status + action */}
              <div className="wl-actions">
                <span className={`badge ${BADGE_CLASS[v.status]}`}>{STATUS_LABEL[v.status]}</span>
                {v.status !== 'exited' && (
                  <button className="wl-checkout-btn" onClick={() => navigate(`/exit/${v.id}`)}>
                    <FiLogOut size={14} /> Check Out
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
