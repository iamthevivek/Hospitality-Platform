import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useUser, UserButton } from '../../lib/auth';
import { Menu, X, Shield, Compass, Calendar } from 'lucide-react';

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isAdmin = isSignedIn && (user?.role === 'ADMIN' || user?.publicMetadata?.role === 'ADMIN' || localStorage.getItem('role') === 'ADMIN');

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo / Brand Crest */}
          <div className="flex items-center space-x-3">
            <Link to={isAdmin ? "/admin" : "/"} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-full bg-[#0d7e8a] flex items-center justify-center text-white shadow-md shadow-[#0d7e8a]/20 group-hover:bg-[#0b6b75] transition duration-300 flex-shrink-0">
                <span className="font-serif font-black text-xl tracking-tighter">S</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-[#0d7e8a] transition">
                  StayEase
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-slate-400 -mt-0.5">
                  Hotels & Resorts
                </span>
              </div>
            </Link>

            {isAdmin && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs ml-2">
                <Shield className="w-3.5 h-3.5 text-amber-600" /> Admin Console
              </span>
            )}
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {isAdmin ? (
              <Link 
                to="/admin" 
                className="px-4 py-2 rounded-full font-semibold text-sm text-primary-700 bg-primary-50/80 border border-primary-100 flex items-center gap-2 hover:bg-primary-100/70 transition shadow-xs"
              >
                <Shield className="w-4 h-4 text-primary-600" /> Management Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/" 
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive('/') 
                      ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/15' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/hotels" 
                  className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                    isActive('/hotels') 
                      ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/15' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Compass className="w-4 h-4 opacity-70" />
                  Explore Stays
                </Link>
                {isSignedIn && (
                  <Link 
                    to="/dashboard" 
                    className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                      isActive('/dashboard') 
                        ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/15' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Calendar className="w-4 h-4 opacity-70" />
                    My Bookings
                  </Link>
                )}
              </>
            )}
            
            <div className="flex items-center pl-4 ml-2 border-l border-slate-200 space-x-3">
              {isSignedIn ? (
                <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 rounded-full pl-3 pr-1.5 py-1">
                  <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                    {user?.name || user?.firstName || 'Guest VIP'}
                  </span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <>
                  <Link 
                    to="/sign-in" 
                    className="text-slate-700 hover:text-primary-600 font-semibold text-sm px-3.5 py-2 transition"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/sign-up" 
                    className="bg-[#0d7e8a] hover:bg-[#0b6b75] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-[#0d7e8a]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
          {isAdmin ? (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-primary-700 bg-primary-50 border border-primary-100"
            >
              <Shield className="w-5 h-5" /> Admin Console
            </Link>
          ) : (
            <div className="space-y-1">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)} 
                className={`block px-4 py-2.5 rounded-xl font-semibold text-sm ${
                  isActive('/') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/hotels" 
                onClick={() => setIsOpen(false)} 
                className={`block px-4 py-2.5 rounded-xl font-semibold text-sm ${
                  isActive('/hotels') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Explore Stays
              </Link>
              {isSignedIn && (
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsOpen(false)} 
                  className={`block px-4 py-2.5 rounded-xl font-semibold text-sm ${
                    isActive('/dashboard') ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  My Bookings
                </Link>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-slate-200">
            {isSignedIn ? (
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">{user?.name || user?.firstName || 'Guest VIP'}</span>
                  <span className="text-[11px] text-slate-500">{isAdmin ? 'Admin Console' : 'Member'}</span>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  to="/sign-in" 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link 
                  to="/sign-up" 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 bg-[#0d7e8a] text-white font-semibold rounded-xl text-sm hover:bg-[#0b6b75] shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

