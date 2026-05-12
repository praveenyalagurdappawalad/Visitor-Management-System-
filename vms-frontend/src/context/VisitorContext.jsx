import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';

const VisitorContext = createContext();

const DEPARTMENTS = {
  Wizzybox: {
    purposes: ['Client Meeting', 'Project Discussion', 'HR Discussion', 'IT Support', 'Delivery', 'Product Demo', 'Partnership Discussion', 'Other'],
    employees: [
      { name: 'Rajendra',   role: 'Development' },
      { name: 'Kavyashree', role: 'Development' },
      { name: 'Swati',      role: 'Development' },
      { name: 'Thejas',     role: 'Development' },
      { name: 'Raaghu',     role: 'Testing' },
    ],
  },
  NammaQA: {
    purposes: ['Training Session', 'Course Inquiry', 'Enrollment', 'Assessment', 'Certificate Collection', 'Workshop Participation', 'Trainer Meeting', 'Other'],
    employees: [
      { name: 'Karthik', role: 'Trainer' },
      { name: 'Anusha',  role: 'Trainer' },
      { name: 'Rahul',   role: 'Support' },
      { name: 'Divya',   role: 'Admin' },
      { name: 'Manoj',   role: 'Trainer' },
    ],
  },
  HR: {
    purposes: ['Onboarding', 'Document Submission', 'Interview', 'Payroll', 'Other'],
    employees: [
      { name: 'Grace Kim',    role: 'HR Manager' },
      { name: 'Henry Wilson', role: 'HR Executive' },
    ],
  },
  Finance: {
    purposes: ['Invoice', 'Audit', 'Meeting', 'Vendor Visit', 'Other'],
    employees: [
      { name: 'Irene Clark', role: 'Finance Head' },
      { name: 'Jack Davis',  role: 'Accountant' },
    ],
  },
};

export function VisitorProvider({ children }) {
  const [currentVisitor, setCurrentVisitor] = useState(null);
  const [visitors,  setVisitors]  = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading,   setLoading]   = useState(false);

  // Load data from backend on mount
  useEffect(() => {
    refreshVisitors();
    refreshFeedbacks();
  }, []);

  const refreshVisitors = async () => {
    try {
      const data = await api.getAllVisitors();
      // Normalize backend field names to match frontend expectations
      setVisitors(data.map(normalizeVisitor));
    } catch (e) {
      console.warn('Backend unavailable, using empty state:', e.message);
    }
  };

  const refreshFeedbacks = async () => {
    try {
      const data = await api.getAllFeedback();
      setFeedbacks(data.map(normalizeFeedback));
    } catch (e) {
      console.warn('Backend unavailable:', e.message);
    }
  };

  // Map backend snake_case → frontend camelCase
  const normalizeVisitor = (v) => ({
    id:         v.id,
    name:       v.name,
    mobile:     v.mobile,
    department: v.department,
    purpose:    v.purpose,
    host:       v.host,
    photo:      v.photoPath ? `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/uploads/${v.photoPath}` : null,
    status:     v.status?.toLowerCase(),
    checkIn:    v.checkInTime  ? new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
    checkOut:   v.checkOutTime ? new Date(v.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
  });

  const normalizeFeedback = (f) => ({
    id:          f.id,
    visitorName: f.visitorName,
    department:  f.department,
    rating:      f.rating,
    comment:     f.comment,
    submittedAt: f.submittedAt ? new Date(f.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
  });

  const addVisitor = async (visitorData, photoFile) => {
    setLoading(true);
    try {
      const saved = await api.checkInVisitor(visitorData, photoFile);
      const normalized = normalizeVisitor(saved);
      setVisitors(prev => [normalized, ...prev]);
      return normalized;
    } catch (e) {
      // Fallback: add locally if backend is down
      const fallback = {
        ...visitorData,
        id: Date.now(),
        status: 'waiting',
        checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        photo: null,
      };
      setVisitors(prev => [fallback, ...prev]);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    // Optimistic update
    setVisitors(prev => prev.map(v =>
      v.id === id ? {
        ...v,
        status,
        ...(status === 'exited' ? { checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : {})
      } : v
    ));
    try {
      await api.updateVisitorStatus(id, status.toUpperCase());
    } catch (e) {
      console.warn('Status update failed on backend:', e.message);
    }
  };

  const deleteVisitor = async (id) => {
    setVisitors(prev => prev.filter(v => v.id !== id));
    try {
      await api.deleteVisitor(id);
    } catch (e) {
      console.warn('Delete failed on backend:', e.message);
    }
  };

  const addFeedback = async ({ visitorName, department, rating, comment }) => {
    const entry = { visitorName: visitorName || 'Anonymous', department: department || '—', rating, comment };
    try {
      const saved = await api.submitFeedback(entry);
      setFeedbacks(prev => [normalizeFeedback(saved), ...prev]);
    } catch (e) {
      // Fallback local
      setFeedbacks(prev => [{
        id: Date.now(), ...entry,
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }, ...prev]);
    }
  };

  const deleteFeedback = async (id) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
    try {
      await api.deleteFeedback(id);
    } catch (e) {
      console.warn('Feedback delete failed on backend:', e.message);
    }
  };

  return (
    <VisitorContext.Provider value={{
      currentVisitor, setCurrentVisitor,
      visitors, addVisitor, updateStatus, deleteVisitor,
      feedbacks, addFeedback, deleteFeedback,
      loading, refreshVisitors, refreshFeedbacks,
      DEPARTMENTS,
    }}>
      {children}
    </VisitorContext.Provider>
  );
}

export const useVisitor = () => useContext(VisitorContext);
