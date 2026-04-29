import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiList } from 'react-icons/fi';
import { useVisitor } from '../context/VisitorContext';

export default function CheckinSentPage() {
  const navigate = useNavigate();
  const { currentVisitor } = useVisitor();

  return (
    <div className="page">
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="success-icon">
          <FiCheckCircle color="#16a34a" />
        </div>

        <h2 style={{ marginBottom: 8 }}>Request Sent!</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 8 }}>
          Your check-in request has been sent to
        </p>
        <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>
          {currentVisitor?.host}
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 32 }}>
          {currentVisitor?.department} — {currentVisitor?.purpose}
        </p>

        <div style={{
          background: '#eff6ff', borderRadius: 10, padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, textAlign: 'left'
        }}>
          <FiClock size={24} color="var(--primary)" />
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Please wait in the lobby</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
              The host will be notified and will come to receive you shortly.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/waiting')}>
            <FiList /> View Waiting List
          </button>
          <button className="btn btn-secondary btn-full" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
