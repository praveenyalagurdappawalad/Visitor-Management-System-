import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const ADMINS_KEY = 'vms_admins';
const SESSION_KEY = 'vms_admin_session';

// Seed a default admin if none exist
function seedDefault() {
  const existing = JSON.parse(localStorage.getItem(ADMINS_KEY) || '[]');
  if (existing.length === 0) {
    localStorage.setItem(ADMINS_KEY, JSON.stringify([
      { username: 'admin', password: 'admin123', name: 'Super Admin', email: 'praveenwalad07@gmail.com' }
    ]));
  }
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    seedDefault();
    const session = localStorage.getItem(SESSION_KEY);
    if (session) setAdmin(JSON.parse(session));
  }, []);

  const login = (username, password) => {
    const admins = JSON.parse(localStorage.getItem(ADMINS_KEY) || '[]');
    const found = admins.find(a => a.username === username && a.password === password);
    if (found) {
      setAdmin(found);
      localStorage.setItem(SESSION_KEY, JSON.stringify(found));
      return { success: true, admin: found };
    }
    return { success: false, error: 'Invalid username or password' };
  };

  const register = (data) => {
    const admins = JSON.parse(localStorage.getItem(ADMINS_KEY) || '[]');
    if (admins.find(a => a.username === data.username)) {
      return { success: false, error: 'Username already exists' };
    }
    const newAdmin = { ...data };
    admins.push(newAdmin);
    localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
    return { success: true };
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ admin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
