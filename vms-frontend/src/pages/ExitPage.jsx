import { useNavigate, useParams } from 'react-router-dom';
import { FiLogOut, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { useVisitor } from '../context/VisitorContext';
import { useState } from 'react';

export default function ExitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { visitors, updateStatus } = useVisitor();
  const [done, setDone] = useState(false);

  const visitor = visitors.find((v) => v.id === Number(id));

  if (!visitor) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Visitor not found.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/waiting')}>
            Back to Waiting List
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    updateStatus(visitor.id, 'exited');
    setDone(true);
  };

  if (done) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="success-icon">
            <FiCheckCircle color="#16a34a" />
          </div>
          <h2 style={{ marginBottom: 8 }}>Checked Out</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 8 }}>
            <strong>{visitor.name}</strong> has been successfully checked out.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 28 }}>
            Exit time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-primary btn-full" onClick={() => navigate('/feedback')}>
              Leave Feedback
            </button>
            <button className="btn btn-secondary btn-full" onClick={() => navigate('/waiting')}>
              Back to Waiting List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <button className="btn btn-secondary" style={{ marginBottom: 20 }} onClick={() => navigate('/waiting')}>
          <FiArrowLeft /> Back
        </button>
        <h2 style={{ marginBottom: 4 }}>Visitor Check-Out</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '0.9rem' }}>
          Confirm exit for the visitor below
        </p>

        <div style={{ marginBottom: 24 }}>
          {[
            { label: 'Name', value: visitor.name },
            { label: 'Mobile', value: visitor.mobile },
            { label: 'Department', value: visitor.department },
            { label: 'Purpose', value: visitor.purpose },
            { label: 'Host', value: visitor.host },
            { label: 'Check-in Time', value: visitor.checkIn },
          ].map(({ label, value }) => (
            <div className="detail-row" key={label}>
              <span className="detail-label">{label}</span>
              <span className="detail-value">{value}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-danger btn-full" onClick={handleCheckout}>
          <FiLogOut /> Confirm Check-Out
        </button>
      </div>
    </div>
  );
}
