import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VisitorProvider } from './context/VisitorContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import WelcomePage from './pages/WelcomePage';
import RegisterPage from './pages/RegisterPage';
import CameraPage from './pages/CameraPage';
import PreviewPage from './pages/PreviewPage';
import CheckinSentPage from './pages/CheckinSentPage';
import WaitingListPage from './pages/WaitingListPage';
import ExitPage from './pages/ExitPage';
import FeedbackPage from './pages/FeedbackPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';

export default function App() {
  return (
    <AuthProvider>
      <VisitorProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/camera" element={<CameraPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/checkin-sent" element={<CheckinSentPage />} />
            <Route path="/waiting" element={<WaitingListPage />} />
            <Route path="/exit/:id" element={<ExitPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />

            {/* Auth routes */}
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin-register" element={<AdminRegisterPage />} />

            {/* Protected admin route */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </VisitorProvider>
    </AuthProvider>
  );
}
