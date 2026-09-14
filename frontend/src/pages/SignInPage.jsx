import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { User, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location.state?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
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
    <div className="min-h-[calc(100vh-80px)] bg-[#f3f4f6] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/90 p-4 sm:p-6 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch border border-slate-100">
        
        {/* Left Column: Visual Card matching Dribbble */}
        <div className="rounded-[24px] overflow-hidden relative min-h-[220px] sm:min-h-[280px] md:min-h-[520px] flex flex-col justify-between p-6 sm:p-8 bg-slate-900 shadow-inner">
          <img
            src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&q=85"
            alt="StayEase Suite Interior"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/30" />

          {/* Top Logo */}
          <div className="relative z-10 flex items-center space-x-3">
            <div className="w-11 h-11 rounded-full bg-[#0d7e8a] flex items-center justify-center text-white shadow-md">
              <span className="font-serif font-black text-2xl tracking-tighter">S</span>
            </div>
            <span className="text-2xl font-serif text-white tracking-tight font-medium">StayEase</span>
          </div>

          {/* Bottom Headline & Back Arrow */}
          <div className="relative z-10 space-y-4">
            <Link
              to="/"
              className="w-10 h-10 rounded-full bg-[#0d7e8a] hover:bg-[#0b6b75] flex items-center justify-center text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-white font-normal tracking-tight leading-snug">
              Away from Home,<br />Yet Feels Like Home
            </h2>
          </div>
        </div>

        {/* Right Column: Form matching Dribbble */}
        <div className="flex flex-col justify-center px-2 sm:px-6 py-4">
          {/* Avatar Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-400 mx-auto mb-2">
              <User className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 leading-tight">Sign In</h3>
          </div>

          {fromLocation && (
            <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs font-medium">
              {location.state?.message || 'Please sign in to proceed directly to your room reservation.'}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@example.com"
                required
                className="w-full bg-[#eef0f3] border-0 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0d7e8a]/40 outline-none transition"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#eef0f3] border-0 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0d7e8a]/40 outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0d7e8a] border-slate-300 focus:ring-[#0d7e8a]"
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d7e8a] hover:bg-[#0b6b75] text-white font-bold tracking-wider uppercase py-3.5 rounded-xl shadow-md transition text-xs mt-2 disabled:opacity-50"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Switch link */}
          <div className="text-center mt-5">
            <p className="text-xs text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/sign-up"
                state={{ from: fromLocation }}
                className="font-bold text-[#0d7e8a] hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
