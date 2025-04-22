import { useState } from 'react';
import LoginForms from './components/LoginForms';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <div className="app-container">
      {!isAuthenticated ? (
        <div className="auth-container">
          {showRegister ? (
            <>
              <h2>Create an Account</h2>
              <RegisterForm onRegister={handleLogin} />
              <p>
                Already have an account?{' '}
                <button className="link-button" onClick={() => setShowRegister(false)}>
                  Log In
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Welcome Back</h2>
              <LoginForms onLogin={handleLogin} />
              <p>
                Don't have an account?{' '}
                <button className="link-button" onClick={() => setShowRegister(true)}>
                  Sign Up
                </button>
              </p>
            </>
          )}
        </div>
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
