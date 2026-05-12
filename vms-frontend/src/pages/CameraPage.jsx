import { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { FiCamera, FiRefreshCw, FiArrowRight, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { useVisitor } from '../context/VisitorContext';

export default function CameraPage() {
  const navigate = useNavigate();
  const { currentVisitor, setCurrentVisitor } = useVisitor();
  const webcamRef = useRef(null);
  const [photo, setPhoto]       = useState(null);
  const [camError, setCamError] = useState(false);
  const [flash, setFlash]       = useState(false);

  useEffect(() => {
    if (!currentVisitor) navigate('/register');
  }, [currentVisitor, navigate]);

  const capture = useCallback(() => {
    const img = webcamRef.current?.getScreenshot();
    if (img) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
      setPhoto(img);
    }
  }, []);

  const retake = () => setPhoto(null);

  const handleNext = () => {
    setCurrentVisitor(prev => ({ ...prev, photo }));
    navigate('/preview');
  };

  if (!currentVisitor) return null;

  return (
    <div className="cam-root">
      {/* Sphere bg */}
      <div className="register-sphere register-sphere-1" />
      <div className="register-sphere register-sphere-2" />
      <div className="register-sphere register-sphere-4" />
      <div className="register-sphere-glass" />

      <div className="cam-container">
        {/* Back */}
        <button className="reg-back-btn" onClick={() => navigate('/register')}>
          <FiArrowLeft size={16} /> Back
        </button>

        {/* Title */}
        <div className="cam-title-block">
          <h2 className="cam-title">Take Your Photo</h2>
          <p className="cam-subtitle">
            {!photo ? 'Position your face in the frame and click capture' : 'Looking good! Confirm or retake your photo'}
          </p>
        </div>

        {/* Camera / Preview */}
        <div className={`cam-frame ${flash ? 'cam-flash' : ''}`}>
          {!photo ? (
            <>
              {!camError ? (
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: 'user', width: 640, height: 480 }}
                  onUserMediaError={() => setCamError(true)}
                  className="cam-video"
                />
              ) : (
                <div className="cam-error-state">
                  <FiCamera size={52} />
                  <p>Camera not available</p>
                  <span>Allow camera access in your browser settings</span>
                </div>
              )}
              {/* Corner guides */}
              <div className="cam-corner tl" />
              <div className="cam-corner tr" />
              <div className="cam-corner bl" />
              <div className="cam-corner br" />
              {/* Face guide oval */}
              <div className="cam-face-guide" />
            </>
          ) : (
            <>
              <img src={photo} alt="Captured" className="cam-video" />
              {/* Captured badge */}
              <div className="cam-captured-badge">
                <FiCheckCircle size={14} /> Photo captured
              </div>
            </>
          )}
        </div>

        {/* Visitor name strip */}
        <div className="cam-visitor-strip">
          <span className="cam-visitor-label">Visitor:</span>
          <span className="cam-visitor-name">{currentVisitor.name}</span>
          <span className="cam-visitor-dept">{currentVisitor.department}</span>
        </div>

        {/* Action buttons */}
        {!photo ? (
          <div className="cam-actions">
            <button
              className="cam-capture-btn"
              onClick={capture}
              disabled={camError}
            >
              <div className="cam-capture-inner">
                <FiCamera size={22} />
              </div>
            </button>
            <p className="cam-capture-hint">Click to capture</p>
            {camError && (
              <button className="cam-skip-btn" onClick={handleNext}>
                Skip Photo &amp; Continue <FiArrowRight size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="cam-actions">
            <div className="cam-btn-row">
              <button className="cam-retake-btn" onClick={retake}>
                <FiRefreshCw size={16} /> Retake Photo
              </button>
              <button className="cam-continue-btn" onClick={handleNext}>
                <FiCheckCircle size={16} /> Use This Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
