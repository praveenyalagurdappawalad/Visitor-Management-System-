import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { FiEdit2, FiCheckCircle, FiUser } from 'react-icons/fi';
import { useVisitor } from '../context/VisitorContext';
import toast, { Toaster } from 'react-hot-toast';

export default function PreviewPage() {
  const navigate = useNavigate();
  const { currentVisitor, addVisitor, setCurrentVisitor } = useVisitor();

  useEffect(() => {
    if (!currentVisitor) navigate('/register');
  }, [currentVisitor, navigate]);

  if (!currentVisitor) return null;

  const handleConfirm = async () => {
    const visitor = await addVisitor(currentVisitor);
    setCurrentVisitor(visitor);
    toast.success('Check-in request sent!');
    setTimeout(() => navigate('/checkin-sent'), 800);
  };

  const details = [
    { label: 'Full Name', value: currentVisitor.name },
    { label: 'Mobile', value: currentVisitor.mobile },
    { label: 'Department', value: currentVisitor.department },
    { label: 'Purpose', value: currentVisitor.purpose },
    { label: 'Meeting', value: currentVisitor.host },
  ];

  return (
    <div className="page">
      <Toaster position="top-center" />
      <div className="card">
        <h2 style={{ marginBottom: 4, textAlign: 'center' }}>Preview Details</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '0.9rem', textAlign: 'center' }}>
          Review your information before confirming
        </p>

        {currentVisitor.photo ? (
          <img src={currentVisitor.photo} alt="Visitor" className="photo-preview" />
        ) : (
          <div style={{
            width: 120, height: 120, borderRadius: '50%', background: '#e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: '3rem', color: '#94a3b8'
          }}>
            <FiUser />
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          {details.map(({ label, value }) => (
            <div className="detail-row" key={label}>
              <span className="detail-label">{label}</span>
              <span className="detail-value">{value}</span>
            </div>
          ))}
        </div>

        <div className="row">
          <button className="btn btn-secondary" onClick={() => navigate('/register')}>
            <FiEdit2 /> Edit
          </button>
          <button className="btn btn-success" onClick={handleConfirm}>
            <FiCheckCircle /> Confirm Check-in
          </button>
        </div>
      </div>
    </div>
  );
}
