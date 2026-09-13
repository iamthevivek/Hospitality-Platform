import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Shield, LogOut, KeyRound, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authLogin, authRegister, authGetMe, authLogout } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('stayease_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('stayease_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync / verify token on mount
  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      const savedToken = localStorage.getItem('stayease_token');
      const savedUserStr = localStorage.getItem('stayease_user');

      if (savedToken) {
        if (savedUserStr && isMounted) {
          try {
            const parsed = JSON.parse(savedUserStr);
            setUser(parsed);
          } catch (e) {}
        }

        try {
          const profile = await authGetMe();
          if (isMounted && profile) {
            setUser(profile);
            localStorage.setItem('stayease_user', JSON.stringify(profile));
            if (profile.role) {
              localStorage.setItem('role', profile.role);
            }
          }
        } catch (err) {
          // ONLY clear session if server explicitly returns 401 Unauthorized or 403 Forbidden
          const status = err?.response?.status;
          if (status === 401 || status === 403) {
            console.warn('Session expired (401/403): clearing login state');
            if (isMounted) {
              localStorage.removeItem('stayease_token');
              localStorage.removeItem('stayease_user');
              localStorage.removeItem('role');
              setToken(null);
              setUser(null);
            }
          } else {
            console.warn('Session verification notice (server not reachable or busy, preserving session):', err?.message);
          }
        }
      }
      if (isMounted) {
        setIsLoaded(true);
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await authLogin({ email, password });
    if (res && res.token) {
      localStorage.setItem('stayease_token', res.token);
      localStorage.setItem('stayease_user', JSON.stringify(res.user));
      if (res.user?.role) {
        localStorage.setItem('role', res.user.role);
      }
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const register = async (data) => {
    const res = await authRegister(data);
    if (res && res.token) {
      localStorage.setItem('stayease_token', res.token);
      localStorage.setItem('stayease_user', JSON.stringify(res.user));
      if (res.user?.role) {
        localStorage.setItem('role', res.user.role);
      }
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const signOut = async () => {
    try {
      await authLogout();
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('stayease_token');
    localStorage.removeItem('stayease_user');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
  };

  const getToken = async () => {
    return token || localStorage.getItem('stayease_token') || null;
  };

  const isSignedIn = !!(token && user);

  const authValue = {
    isSignedIn,
    isLoaded,
    userId: user?.clerkId || null,
    token,
    getToken,
    login,
    register,
    signOut
  };

  // Clerk-compatible user object format for seamless component compatibility
  const clerkCompatibleUser = user ? {
    id: user.clerkId,
    clerkId: user.clerkId,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    email: user.email,
    primaryEmailAddress: { emailAddress: user.email },
    role: user.role,
    publicMetadata: { role: user.role },
    imageUrl: user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName || 'U')}+${encodeURIComponent(user.lastName || 'U')}&background=4f46e5&color=fff&bold=true`
  } : null;

  const userValue = {
    isSignedIn,
    isLoaded,
    user: clerkCompatibleUser
  };

  return (
    <AuthContext.Provider value={{ auth: authValue, user: userValue }}>
      {children}
    </AuthContext.Provider>
  );
}

// Backward-compatible alias for existing imports
export { AuthProvider as ClerkProvider };

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('stayease_token') : null;
    return {
      isSignedIn: !!savedToken,
      isLoaded: true,
      userId: null,
      getToken: async () => savedToken,
      login: async () => {},
      register: async () => {},
      signOut: async () => {}
    };
  }
  return ctx.auth;
}

export function useUser() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      isSignedIn: false,
      isLoaded: true,
      user: null
    };
  }
  return ctx.user;
}

// ==========================================
// USER BUTTON (PROFILE & LOGOUT DROPDOWN)
// ==========================================
export function UserButton({ afterSignOutUrl = '/' }) {
  const { user } = useUser();
  const { signOut, isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isSignedIn || !user) {
    return (
      <Link
        to="/sign-in"
        className="text-sm font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg border border-primary-600 hover:bg-primary-50 transition"
      >
        Sign In
      </Link>
    );
  }

  const isAdmin = user.role === 'ADMIN' || user.publicMetadata?.role === 'ADMIN';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-primary-500 transition focus:outline-none"
        title={user.fullName}
      >
        <img
          src={user.imageUrl}
          alt={user.fullName}
          className="w-9 h-9 rounded-full object-cover border-2 border-primary-500 shadow-sm"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 z-50 animate-in fade-in zoom-in-95">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
            {isAdmin && (
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full">
                  <Shield className="w-3 h-3" /> Administrator
                </span>
              </div>
            )}
          </div>

          <div className="py-1">
            {!isAdmin ? (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <User className="w-4 h-4 mr-3 text-gray-500" />
                My Bookings
              </Link>
            ) : (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center px-4 py-2.5 text-sm text-indigo-700 hover:bg-indigo-50/60 font-medium transition"
              >
                <Shield className="w-4 h-4 mr-3 text-indigo-600" />
                Admin Panel
              </Link>
            )}
          </div>

          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={async () => {
                await signOut();
                setOpen(false);
                toast.success('Signed out successfully');
                navigate(afterSignOutUrl);
              }}
              className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left transition"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// NATIVE SIGN IN COMPONENT
// ==========================================
export function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location.state?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNavigateAfterAuth = (loggedInUser) => {
    if (loggedInUser.role === 'ADMIN') {
      navigate('/admin', { replace: true });
      return;
    }

    if (fromLocation) {
      const path = typeof fromLocation === 'string'
        ? fromLocation
        : (fromLocation.pathname + (fromLocation.search || ''));
      const state = typeof fromLocation === 'object' ? fromLocation.state : null;
      navigate(path, { state, replace: true });
      return;
    }

    // Default first time login: go to Home page
    navigate('/', { replace: true });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      toast.success(`Welcome back, ${user.firstName || 'Traveler'}!`);
      handleNavigateAfterAuth(user);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 sm:p-10 border border-slate-100">
      <div className="text-center mb-7">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100/80 text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          <span>StayEase Member Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-normal">
          Enter your credentials to access your trips, reservations, and benefits.
        </p>
      </div>

      {fromLocation && (
        <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center space-x-2.5 text-amber-900 text-xs font-medium shadow-sm">
          <KeyRound className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Please sign in to proceed directly to your room reservation.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-red-700 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex.morgan@example.com"
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full pl-11 pr-11 py-3 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 hover:from-primary-700 hover:to-indigo-800 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In to StayEase</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-7 text-center">
        <p className="text-xs sm:text-sm text-slate-600">
          Don't have an account?{' '}
          <Link
            to="/sign-up"
            state={{ from: fromLocation }}
            className="font-bold text-primary-600 hover:text-primary-700 transition underline-offset-2 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// NATIVE SIGN UP COMPONENT
// ==========================================
export function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location.state?.from;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNavigateAfterAuth = (registeredUser) => {
    if (registeredUser.role === 'ADMIN') {
      navigate('/admin', { replace: true });
      return;
    }

    if (fromLocation) {
      const path = typeof fromLocation === 'string'
        ? fromLocation
        : (fromLocation.pathname + (fromLocation.search || ''));
      const state = typeof fromLocation === 'object' ? fromLocation.state : null;
      navigate(path, { state, replace: true });
      return;
    }

    // Default first time registration: go to Home page
    navigate('/', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      toast.success(`Account created! Welcome, ${user.firstName || 'Traveler'}!`);
      handleNavigateAfterAuth(user);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 sm:p-10 border border-slate-100">
      <div className="text-center mb-7">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100/80 text-[11px] font-bold text-teal-800 uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          <span>New Guest Membership</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Create an Account</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-normal">
          Join StayEase to reserve hotels, track bookings, and get personalized recommendations.
        </p>
      </div>

      {fromLocation && (
        <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center space-x-2.5 text-amber-900 text-xs font-medium shadow-sm">
          <Shield className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Create an account to complete your room reservation instantly.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2.5 text-red-700 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g. Alex"
              required
              className="w-full px-3.5 py-3 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g. Morgan"
              className="w-full px-3.5 py-3 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex.morgan@example.com"
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider">
            Password (min. 6 characters)
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              required
              className="w-full pl-11 pr-11 py-3 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 tracking-wider">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••••••"
              required
              className="w-full pl-11 pr-4 py-3 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 transition-all shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 hover:from-primary-700 hover:to-indigo-800 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-7 text-center">
        <p className="text-xs sm:text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/sign-in"
            state={{ from: fromLocation }}
            className="font-bold text-primary-600 hover:text-primary-700 transition underline-offset-2 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
