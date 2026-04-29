import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { useVisitor } from '../context/VisitorContext';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const { currentVisitor, addFeedback } = useVisitor();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!rating) { toast.error('Please select a rating'); return; }
    addFeedback({
      visitorName: currentVisitor?.name,
      department:  currentVisitor?.department,
      rating,
      comment,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="success-icon">
            <FiCheckCircle color="#16a34a" />
          </div>
          <h2 style={{ marginBottom: 8 }}>Thank You!</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
            Your feedback helps us improve the visitor experience.
          </p>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Toaster position="top-center" />
      <div className="card">
        <h2 style={{ marginBottom: 4, textAlign: 'center' }}>Share Your Feedback</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: '0.9rem', textAlign: 'center' }}>
          How was your visit experience today?
        </p>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ fontWeight: 500, marginBottom: 12 }}>Rate your experience</p>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hovered || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
              >
                ★
              </span>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 8 }}>
              {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Comments (optional)</label>
          <textarea
            rows={4}
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary btn-full" onClick={handleSubmit}>
            <FiSend /> Submit Feedback
          </button>
          <button className="btn btn-secondary btn-full" onClick={() => navigate('/')}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
