import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  KeyRound
} from 'lucide-react';

const DEMO_USERS = [
  {
    role: 'Super Admin',
    name: 'Alexandra Chen',
    email: 'admin@nexushr.io',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    title: 'Chief People Officer',
    badge: 'Full Access'
  },
  {
    role: 'HR Manager',
    name: 'Priya Patel',
    email: 'hr@nexushr.io',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    title: 'Lead Talent Partner',
    badge: 'People Ops'
  },
  {
    role: 'Team Lead',
    name: 'Marcus Vance',
    email: 'marcus@nexushr.io',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    title: 'Engineering Director',
    badge: 'Team Access'
  }
];

export default function LoginPage({ onLogin, theme, toggleTheme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your work email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulate network authentication delay
    setTimeout(() => {
      // Find matching demo user or create session with provided credentials
      const matched = DEMO_USERS.find(
        u => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      const authenticatedUser = matched || {
        name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email.trim(),
        role: 'Admin',
        title: 'Workforce Administrator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        badge: 'Staff'
      };

      setIsLoading(false);
      onLogin(authenticatedUser, rememberMe);
    }, 600);
  };

  const handleSelectDemoUser = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setErrorMessage('');
  };

  const handleQuickLogin = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(user, rememberMe);
    }, 450);
  };

  return (
    <div className="login-screen">
      {/* Background Animated Atmosphere */}
      <div className="login-backdrop">
        <div className="login-blob blob-1"></div>
        <div className="login-blob blob-2"></div>
        <div className="login-blob blob-3"></div>
      </div>

      {/* Top Bar with Theme Toggle */}
      <header className="login-top-bar">
        <div className="brand-pill">
          <div className="brand-logo-small">
            <Building2 size={16} color="#fff" />
          </div>
          <span className="brand-name-small">NexusHR</span>
          <span className="brand-version-badge">Enterprise v2.4</span>
        </div>

        <button 
          className="theme-toggle-btn login-theme-toggle"
          onClick={toggleTheme}
          title="Toggle Dark / Light Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="login-main-container">
        <div className="login-card">
          {/* Card Header */}
          <div className="login-card-header">
            <div className="brand-icon-wrapper">
              <Building2 size={26} color="#fff" />
            </div>
            <h1 className="login-card-title">Welcome to NexusHR</h1>
            <p className="login-card-subtitle">
              Sign in to manage employees, departments, attendance, and payroll.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="login-error-alert animate-fade-in">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label className="login-label">
                Work Email <span className="required-star">*</span>
              </label>
              <div className="login-input-wrapper">
                <Mail size={16} className="login-input-icon" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className="login-form-group">
              <div className="login-label-row">
                <label className="login-label">
                  Password <span className="required-star">*</span>
                </label>
                <button
                  type="button"
                  className="login-forgot-link"
                  onClick={() => alert('Demo Mode: Click any of the Quick Demo accounts below to log in instantly!')}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="login-input-wrapper">
                <Lock size={16} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(prev => !prev)}
                  tabIndex={-1}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="login-remember-row">
              <label className="login-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this workstation</span>
              </label>

              <span className="login-security-tag">
                <ShieldCheck size={13} color="#10b981" /> 256-bit SSL
              </span>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading}
              id="btn-login-submit"
            >
              {isLoading ? (
                <>
                  <span className="login-spinner"></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="demo-accounts-section">
            <div className="demo-accounts-divider">
              <span>Or 1-Click Quick Demo Access</span>
            </div>

            <div className="demo-chips-grid">
              {DEMO_USERS.map((user) => (
                <div 
                  key={user.email} 
                  className="demo-chip-card"
                  onClick={() => handleQuickLogin(user)}
                  title={`Click to login as ${user.name} (${user.role})`}
                >
                  <img src={user.avatar} alt={user.name} className="demo-chip-avatar" />
                  <div className="demo-chip-info">
                    <div className="demo-chip-top">
                      <span className="demo-chip-name">{user.name}</span>
                      <span className="demo-chip-badge">{user.badge}</span>
                    </div>
                    <span className="demo-chip-role">{user.role}</span>
                  </div>
                  <KeyRound size={14} className="demo-chip-arrow" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Information */}
          <div className="login-footer">
            <div className="login-footer-security">
              <CheckCircle2 size={13} color="#10b981" />
              <span>Connected to TiDB Cloud Serverless MySQL & Vercel API</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
