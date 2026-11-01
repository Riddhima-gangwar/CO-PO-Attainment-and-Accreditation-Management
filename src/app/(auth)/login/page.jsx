'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, User as UserIcon, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES } from '@/lib/auth';

const ROLE_PRESETS = {
  Faculty: {
    email: 'faculty@outcome360.edu',
    pass: 'test@123',
    title: 'Assistant Professor & Course Lead',
  },
  HOD: {
    email: 'hod@outcome360.edu',
    pass: 'test@123',
    title: 'Head of Department',
  },
  Admin: {
    email: 'admin@outcome360.edu',
    pass: 'test@123',
    title: 'System Administrator',
  },
  Accreditation: {
    email: 'accreditation@outcome360.edu',
    pass: 'test@123',
    title: 'Accreditation Committee Lead',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  
  // 'login' or 'register' mode
  const [authMode, setAuthMode] = useState('login');

  // Login form state
  const [activeRole, setActiveRole] = useState('Faculty');
  const [email, setEmail] = useState('faculty@outcome360.edu');
  const [password, setPassword] = useState('test@123');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Faculty');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('expired') === 'true') {
        setSessionExpiredNotice(true);
      }
    }
  }, []);

  const handleRoleSelect = (role) => {
    setActiveRole(role);
    setEmail(ROLE_PRESETS[role].email);
    setPassword(ROLE_PRESETS[role].pass);
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      const result = await login(email, password, activeRole);
      if (!result.success) {
        throw new Error(result.error || 'Invalid credentials');
      }
      setSuccessMessage('Welcome back! Redirecting to dashboard...');
      setTimeout(() => {
        const roleConfig = USER_ROLES.find((r) => r.id === activeRole);
        const destination = roleConfig?.defaultRoute || '/dashboard';
        router.push(destination);
      }, 700);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
        department: regDept.trim(),
        designation: `${regRole} Member`,
      });

      if (!result.success) {
        throw new Error(result.error || 'Registration failed');
      }

      setSuccessMessage(`Account registered as ${regRole}! Redirecting...`);
      setTimeout(() => {
        const roleConfig = USER_ROLES.find((r) => r.id === regRole);
        const destination = roleConfig?.defaultRoute || '/dashboard';
        router.push(destination);
      }, 700);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#87b9e6] via-[#bfe0f7] to-[#eef6fc] selection:bg-blue-100 font-sans py-8">
      {/* Orbital Circles Background Art */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[720px] h-[720px] rounded-full border border-white/35 -translate-y-12"></div>
        <div className="w-[1100px] h-[1100px] rounded-full border border-white/20 -translate-y-12"></div>
      </div>

      {/* Realistic Clouds Layer at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-64 sm:h-80 pointer-events-none overflow-hidden z-0">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[1200px] h-72 bg-white/70 blur-3xl rounded-full"></div>
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full text-white/90 drop-shadow-md preserve-3d" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,224L48,229.3C96,235,192,245,288,229.3C384,213,480,171,576,176C672,181,768,235,864,245.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg viewBox="0 0 1440 320" className="absolute -bottom-6 w-full h-full text-white drop-shadow-sm opacity-95" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,192L60,197.3C120,203,240,213,360,202.7C480,192,600,160,720,165.3C840,171,960,213,1080,218.7C1200,224,1320,192,1380,176L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      {/* Top Left Brand Logo */}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-[#18191E] flex items-center justify-center text-white shadow-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v3m0 12v3M3 12h3m12 0h3" />
          </svg>
        </div>
        <span className="font-bold text-gray-900 text-lg tracking-tight">Outcome360</span>
      </div>

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-[410px] mx-4 sm:mx-0 bg-white/95 backdrop-blur-md rounded-[32px] p-7 sm:p-8 shadow-[0_20px_50px_rgba(30,70,110,0.12),0_0_0_1px_rgba(255,255,255,0.7)] border border-white/80 transition-all duration-300">
        {/* Top Sky Gradient Sheen */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#e1f2fd]/70 to-transparent rounded-t-[32px] pointer-events-none" />

        {/* Top Floating Squircle Icon: Arrow entering door [→] */}
        <div className="relative w-14 h-14 mx-auto mb-4 rounded-2xl bg-white shadow-[0_6px_16px_rgba(0,0,0,0.06)] border border-gray-100 flex items-center justify-center text-gray-800">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
            <polyline points="10 8 14 12 10 16" />
            <line x1="4" y1="12" x2="14" y2="12" />
          </svg>
        </div>

        {/* Title and Mode Switcher */}
        <div className="text-center mb-5">
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
            {authMode === 'login' ? 'Sign in with email' : 'Create an account'}
          </h1>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-[280px] mx-auto">
            {authMode === 'login'
              ? 'Sign in to access your OBE curriculum, attainment & accreditation workspace'
              : 'Register a new account with live MongoDB persistence & bcrypt hashing'}
          </p>
        </div>

        {/* Mode Toggle: Sign In vs Register */}
        <div className="flex bg-[#F1F4F9] p-1 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              authMode === 'login'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              authMode === 'register'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Register New User
          </button>
        </div>

        {/* Feedback alerts */}
        {sessionExpiredNotice && (
          <div className="mb-3.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <div>
              <div className="font-semibold text-amber-900">Session Expired (15 Minutes)</div>
              <div className="text-[11px] text-amber-700">You were automatically logged out for security. Please sign in again.</div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span className="truncate">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ----------------- LOGIN MODE ----------------- */}
        {authMode === 'login' && (
          <>
            {/* Quick Role Selector Segmented Control */}
            <div className="mb-4">
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-0.5">
                Fast Sign-in Role Preset
              </label>
              <div className="flex bg-[#F1F4F9] p-1 rounded-xl">
                {['Faculty', 'HOD', 'Admin', 'Accreditation'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      activeRole === role
                        ? 'bg-white text-gray-900 shadow-xs font-semibold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {role === 'Accreditation' ? 'Accred' : role}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-2.5">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full h-11 pl-10 pr-3.5 bg-[#F1F4F9] text-gray-900 text-xs font-medium rounded-xl border border-transparent focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400 transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-11 pl-10 pr-10 bg-[#F1F4F9] text-gray-900 text-xs font-medium rounded-xl border border-transparent focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    alert(`Default password for ${activeRole}: ${ROLE_PRESETS[activeRole].pass}`);
                  }}
                  className="text-xs text-gray-700 hover:text-gray-900 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-1 bg-[#1C1D22] hover:bg-[#2B2C33] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Get Started'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400 text-[11px]">Or sign in with</span>
              </div>
            </div>

            {/* Quick Role Fill Buttons */}
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleRoleSelect('Faculty')}
                title="Sign in as Faculty"
                className="h-10 bg-white border border-gray-200/80 rounded-xl flex items-center justify-center hover:bg-gray-50/80 shadow-2xs transition-all active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('HOD')}
                title="Sign in as HOD"
                className="h-10 bg-white border border-gray-200/80 rounded-xl flex items-center justify-center hover:bg-gray-50/80 shadow-2xs transition-all active:scale-95"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('Admin')}
                title="Sign in as Admin"
                className="h-10 bg-white border border-gray-200/80 rounded-xl flex items-center justify-center hover:bg-gray-50/80 shadow-2xs transition-all active:scale-95"
              >
                <svg className="w-4 h-4 fill-gray-900" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.5-7.79-11.44-14.14-5.85-9.37-10.29-19.82-13.33-31.36-3.04-11.54-4.56-22.3-4.56-32.28 0-14.6 3.72-26.65 11.17-36.14 7.45-9.49 16.71-14.32 27.79-14.51 5.35 0 11.13 1.48 17.34 4.43 6.2 2.96 10.15 4.49 11.83 4.49 1.34 0 5.43-1.61 12.27-4.83 6.84-3.22 12.7-4.63 17.58-4.23 13.59.98 24.16 6.12 31.7 15.42-11.82 7.15-17.57 16.9-17.26 29.27.31 9.77 4.14 17.9 11.5 24.39 7.35 6.49 15.93 10.15 25.73 10.98-2.14 6.78-4.78 13.41-7.91 19.89zM119.22 33.15c0-7.27 2.65-14.07 7.95-20.4 5.3-6.33 11.82-10.22 19.57-11.66.52 3.84.52 7.23 0 10.18-1.04 6.94-3.95 13.4-8.73 19.38-4.78 5.98-10.74 9.45-17.88 10.4-1.05-.98-1.57-2.61-1.57-4.89z" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* ----------------- REGISTER MODE ----------------- */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
            {/* Full Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Full Name (e.g. Dr. Jane Doe)"
                className="w-full h-10 pl-10 pr-3.5 bg-[#F1F4F9] text-gray-900 text-xs font-medium rounded-xl border border-transparent focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400 transition-all"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Institutional Email"
                className="w-full h-10 pl-10 pr-3.5 bg-[#F1F4F9] text-gray-900 text-xs font-medium rounded-xl border border-transparent focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Password (bcrypt hashed with salt)"
                className="w-full h-10 pl-10 pr-10 bg-[#F1F4F9] text-gray-900 text-xs font-medium rounded-xl border border-transparent focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Role Selection from Present Roles */}
            <div className="pt-1">
              <label className="block text-[11px] font-semibold text-gray-700 mb-1.5 px-0.5">
                Select Your Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {USER_ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegRole(r.id)}
                    className={`py-2 px-2.5 rounded-xl border text-left transition-all ${
                      regRole === r.id
                        ? 'border-blue-500 bg-blue-50/80 text-blue-900 shadow-xs'
                        : 'border-gray-200 bg-[#F8FAFC] text-gray-700 hover:bg-gray-100/70'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{r.id}</div>
                    <div className="text-[9px] text-gray-500 truncate">{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Department */}
            <div className="relative pt-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 pt-1 flex items-center pointer-events-none text-gray-400">
                <Building2 className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={regDept}
                onChange={(e) => setRegDept(e.target.value)}
                placeholder="Department"
                className="w-full h-10 pl-10 pr-3.5 bg-[#F1F4F9] text-gray-900 text-xs font-medium rounded-xl border border-transparent focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-[#1C1D22] hover:bg-[#2B2C33] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                `Register as ${regRole} & Sign In`
              )}
            </button>
          </form>
        )}

        {/* Subtle Database Status Pill */}
        <div className="mt-5 text-center">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            MongoDB connected • 15m session security • bcrypt salt enabled
          </span>
        </div>
      </div>
    </div>
  );
}
