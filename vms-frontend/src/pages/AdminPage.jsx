import { useState } from 'react';
import {
  FiUsers, FiClock, FiCheckCircle, FiLogOut,
  FiTrendingUp, FiMessageSquare, FiSearch, FiStar, FiTrash2
} from 'react-icons/fi';
import { useVisitor } from '../context/VisitorContext';
import Navbar from '../components/Navbar';

const STATUS_LABEL = { waiting: 'Waiting', approved: 'Approved', inprogress: 'In Progress', exited: 'Exited' };
const BADGE        = { waiting: 'badge-waiting', approved: 'badge-approved', inprogress: 'badge-inprogress', exited: 'badge-exited' };

function StarDisplay({ rating }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#f59e0b' : '#e2e8f0', fontSize: '1rem' }}>★</span>
      ))}
    </span>
  );
}

export default function AdminPage() {
  const { visitors, updateStatus, deleteVisitor, feedbacks, deleteFeedback } = useVisitor();
  const [activeTab, setActiveTab]   = useState('visitors');
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null); // id to confirm
  const [confirmDeleteFeedback, setConfirmDeleteFeedback] = useState(null); // feedback id

  const stats = [
    { label: 'Total Visitors', value: visitors.length,                                        icon: <FiUsers />,         color: '#4f46e5', filter: 'all',        tab: 'visitors' },
    { label: 'Waiting',        value: visitors.filter(v => v.status === 'waiting').length,    icon: <FiClock />,         color: '#d97706', filter: 'waiting',    tab: 'visitors' },
    { label: 'Approved',       value: visitors.filter(v => v.status === 'approved').length,   icon: <FiCheckCircle />,   color: '#059669', filter: 'approved',   tab: 'visitors' },
    { label: 'Exited',         value: visitors.filter(v => v.status === 'exited').length,     icon: <FiLogOut />,        color: '#64748b', filter: 'exited',     tab: 'visitors' },
    { label: 'Feedbacks',      value: feedbacks.length,                                       icon: <FiMessageSquare />, color: '#7c3aed', filter: null,         tab: 'feedback' },
  ];

  const handleStatClick = (stat) => {
    setActiveTab(stat.tab);
    if (stat.filter !== null) setFilterStatus(stat.filter);
    setSearch('');
  };

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—';

  const filteredVisitors = visitors.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = v.name.toLowerCase().includes(q) || v.host.toLowerCase().includes(q) || v.department.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredFeedbacks = feedbacks.filter(f =>
    f.visitorName.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-root">
      <Navbar />
      <div className="admin-page">

        {/* ── Header ── */}
        <div className="admin-header">
          <div>
            <h2 style={{ marginBottom: 4 }}>Admin Dashboard</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Manage visitors and review client feedback</p>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="admin-stats-row">
          {stats.map(({ label, value, icon, color, filter, tab }) => {
            const isActive = activeTab === tab && (filter === null || filterStatus === filter);
            return (
              <div
                className={`stat-card stat-card-clickable ${isActive ? 'stat-card-active' : ''}`}
                key={label}
                onClick={() => handleStatClick({ label, value, icon, color, filter, tab })}
                title={`Click to filter by ${label}`}
              >
                <div className="stat-icon" style={{ color }}>{icon}</div>
                <div className="stat-value" style={{ color }}>{value}</div>
                <div className="stat-label">{label}</div>
                {isActive && <div className="stat-card-active-bar" style={{ background: color }} />}
              </div>
            );
          })}
        </div>

        {/* ── Tabs ── */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'visitors' ? 'active' : ''}`}
            onClick={() => setActiveTab('visitors')}
          >
            <FiUsers size={14} /> Visitors
            <span className="admin-tab-count">{visitors.length}</span>
          </button>
          <button
            className={`admin-tab ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            <FiMessageSquare size={14} /> Client Feedback
            <span className="admin-tab-count" style={{ background: '#ede9fe', color: '#7c3aed' }}>{feedbacks.length}</span>
          </button>
        </div>

        {/* ── Search / Filter bar ── */}
        <div className="admin-toolbar">
          <div className="search-wrap" style={{ flex: 1, minWidth: 220 }}>
            <FiSearch className="search-icon" />
            <input
              className="search-input"
              placeholder={activeTab === 'visitors' ? 'Search by name, host, department…' : 'Search by visitor or department…'}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {activeTab === 'visitors' && (
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="waiting">Waiting</option>
              <option value="approved">Approved</option>
              <option value="inprogress">In Progress</option>
              <option value="exited">Exited</option>
            </select>
          )}
          {activeTab === 'feedback' && feedbacks.length > 0 && (
            <div className="admin-avg-rating">
              <FiStar color="#f59e0b" />
              <span>Avg Rating: <strong>{avgRating} / 5</strong></span>
            </div>
          )}
        </div>

        {/* ══════════ VISITORS TABLE ══════════ */}
        {activeTab === 'visitors' && (
          <div className="admin-table-wrap">
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Visitor</th>
                    <th>Mobile</th>
                    <th>Department</th>
                    <th>Purpose</th>
                    <th>Host</th>
                    <th>Check-in</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisitors.length === 0 ? (
                    <tr>
                      <td colSpan={9}>
                        <div className="empty-state">
                          <div className="empty-state-icon"><FiUsers /></div>
                          <p>No visitors found</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredVisitors.map((v, i) => (
                    <tr key={v.id}>
                      <td style={{ color: 'var(--muted)', fontWeight: 500 }}>{i + 1}</td>
                      <td style={{ fontWeight: 700 }}>{v.name}</td>
                      <td>{v.mobile}</td>
                      <td>{v.department}</td>
                      <td>{v.purpose}</td>
                      <td>{v.host}</td>
                      <td>{v.checkIn}</td>
                      <td><span className={`badge ${BADGE[v.status]}`}>{STATUS_LABEL[v.status]}</span></td>
                      <td>
                        {v.status === 'waiting'    && <button className="btn btn-success" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => updateStatus(v.id, 'approved')}>Approve</button>}
                        {v.status === 'approved'   && <button className="btn btn-primary" style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => updateStatus(v.id, 'inprogress')}>Start</button>}
                        {v.status === 'inprogress' && <button className="btn btn-danger"  style={{ padding: '5px 12px', fontSize: '0.8rem' }} onClick={() => updateStatus(v.id, 'exited')}>Exit</button>}
                        {v.status === 'exited' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{v.checkOut || '—'}</span>
                            {confirmDelete === v.id ? (
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button
                                  className="btn btn-danger"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                  onClick={() => { deleteVisitor(v.id); setConfirmDelete(null); }}
                                >
                                  Confirm
                                </button>
                                <button
                                  className="btn btn-secondary"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                  onClick={() => setConfirmDelete(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                className="admin-delete-btn"
                                title="Delete record"
                                onClick={() => setConfirmDelete(v.id)}
                              >
                                <FiTrash2 size={13} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════ FEEDBACK TAB ══════════ */}
        {activeTab === 'feedback' && (
          <div className="feedback-admin-grid">
            {filteredFeedbacks.length === 0 ? (
              <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                <div className="empty-state-icon"><FiMessageSquare /></div>
                <p>No feedback submitted yet</p>
              </div>
            ) : filteredFeedbacks.map(f => (
              <div className="feedback-admin-card" key={f.id}>
                {/* Header */}
                <div className="fac-header">
                  <div className="fac-avatar">{f.visitorName.charAt(0).toUpperCase()}</div>
                  <div className="fac-info">
                    <div className="fac-name">{f.visitorName}</div>
                    <div className="fac-dept">{f.department}</div>
                  </div>
                  <div className="fac-time">{f.submittedAt}</div>

                  {/* Delete button */}
                  {confirmDeleteFeedback === f.id ? (
                    <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                        onClick={() => { deleteFeedback(f.id); setConfirmDeleteFeedback(null); }}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                        onClick={() => setConfirmDeleteFeedback(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="admin-delete-btn"
                      title="Delete feedback"
                      style={{ marginLeft: 8 }}
                      onClick={() => setConfirmDeleteFeedback(f.id)}
                    >
                      <FiTrash2 size={13} />
                    </button>
                  )}
                </div>

                {/* Stars */}
                <div className="fac-stars">
                  <StarDisplay rating={f.rating} />
                  <span className="fac-rating-label">
                    {['','Poor','Fair','Good','Very Good','Excellent'][f.rating]}
                  </span>
                </div>

                {/* Comment */}
                {f.comment ? (
                  <p className="fac-comment">"{f.comment}"</p>
                ) : (
                  <p className="fac-comment fac-no-comment">No comment provided</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Analytics strip ── */}
        <div className="admin-analytics-bar">
          <FiTrendingUp size={20} color="var(--primary)" />
          <span>
            Today: <strong>{visitors.length}</strong> total visitors ·{' '}
            <strong>{visitors.filter(v => v.status !== 'exited').length}</strong> still on premises ·{' '}
            <strong>{feedbacks.length}</strong> feedbacks received · Avg rating <strong>{avgRating} ★</strong>
          </span>
        </div>

      </div>
    </div>
  );
}
