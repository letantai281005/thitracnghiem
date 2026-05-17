// js/Students.js
// Helper utilities for client side authentication, registration, and session handling.
// Communicates with the backend API (http://localhost:4000).

const API_BASE = 'http://localhost:4000/api';

const Students = (() => {
  // ----- Private helpers -----
  const setUser = (user, token) => {
    localStorage.setItem('quizflow_user', JSON.stringify(user));
    localStorage.setItem('quizflow_token', token);
  };

  const clearSession = () => {
    localStorage.removeItem('quizflow_user');
    localStorage.removeItem('quizflow_token');
  };

  // ----- Public API -----
  return {
    // Get current logged‑in user object (or null)
    getCurrentUser: () => {
      const raw = localStorage.getItem('quizflow_user');
      return raw ? JSON.parse(raw) : null;
    },

    // Get Authorization header for API calls
    getAuthHeaders: () => {
      const token = localStorage.getItem('quizflow_token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },

    // Register a new account (calls backend)
    register: async (username, password, name, avatar, role, studentType) => {
      try {
        const resp = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, name, avatar, role, studentType })
        });
        const data = await resp.json();
        if (!resp.ok) return { success: false, message: data.error || 'Registration failed' };
        return { success: true };
      } catch (e) {
        return { success: false, message: e.message };
      }
    },

    // Login (calls backend)
    login: async (username, password) => {
      try {
        const resp = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await resp.json();
        if (!resp.ok) return { success: false, message: data.error || 'Login failed' };
        setUser(data.user, data.token);
        return { success: true, user: data.user };
      } catch (e) {
        return { success: false, message: e.message };
      }
    },

    // Logout (clear local storage)
    logout: () => {
      clearSession();
      // Redirect to login page after a short delay for UI friendliness
      setTimeout(() => (window.location.href = 'login.html'), 200);
    }
  };
})();

// Export for potential module usage (Node environment)
if (typeof module !== 'undefined') {
  module.exports = Students;
}
