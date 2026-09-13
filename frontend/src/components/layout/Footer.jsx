import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <footer className="bg-[#f8fafc] text-slate-600 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200/90 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" onClick={scrollToTop} className="flex items-center space-x-3 text-slate-900 group">
            <div className="w-10 h-10 rounded-full bg-[#0d7e8a] flex items-center justify-center text-white shadow-md shadow-[#0d7e8a]/20 group-hover:bg-[#0b6b75] transition duration-300 flex-shrink-0">
              <span className="font-serif font-black text-xl tracking-tighter">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-[#0d7e8a] transition">
                StayEase
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 -mt-0.5">
                Hotels & Resorts
              </span>
            </div>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
            India's premier modern hospitality platform. Discover iconic heritage palaces in Rajasthan, coastal luxury in Goa, and 5-star retreats across the globe.
          </p>
          <div className="pt-2 text-xs text-slate-600 space-y-2">
            <p className="flex items-center">
              <MapPin className="w-4 h-4 mr-2.5 text-[#0d7e8a] flex-shrink-0" />
              <span>Nariman Point, Mumbai • MG Road, Bengaluru</span>
            </p>
            <p className="flex items-center">
              <Phone className="w-4 h-4 mr-2.5 text-[#0d7e8a] flex-shrink-0" />
              <span>+91 (022) 4982-3000</span>
            </p>
            <p className="flex items-center">
              <Mail className="w-4 h-4 mr-2.5 text-[#0d7e8a] flex-shrink-0" />
              <span>support@stayease.in</span>
            </p>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/about" onClick={scrollToTop} className="hover:text-[#0d7e8a] transition font-medium">About Us</Link>
            </li>
            <li>
              <Link to="/careers" onClick={scrollToTop} className="hover:text-[#0d7e8a] transition font-medium">Careers</Link>
            </li>
            <li>
              <Link to="/privacy" onClick={scrollToTop} className="hover:text-[#0d7e8a] transition font-medium">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" onClick={scrollToTop} className="hover:text-[#0d7e8a] transition font-medium">Terms of Service</Link>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-4">Support</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/help" onClick={scrollToTop} className="hover:text-[#0d7e8a] transition font-medium">Help Center & FAQ</Link>
            </li>
            <li>
              <Link to="/contact" onClick={scrollToTop} className="hover:text-[#0d7e8a] transition font-medium">Contact Us</Link>
            </li>
            <li>
              <Link to="/cancellation-policy" onClick={scrollToTop} className="hover:text-[#0d7e8a] transition font-medium">Cancellation Policy</Link>
            </li>
            <li>
              <Link to="/hotels" onClick={scrollToTop} className="hover:text-[#0d7e8a] transition font-medium">Explore Hotels</Link>
            </li>
          </ul>
        </div>

        {/* Payment & Trust */}
        <div>
          <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase mb-4 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0d7e8a]" />
            <span>Secure Booking</span>
          </h4>
          <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
            All transactions are processed securely in Indian Rupees (₹ INR) with end-to-end 256-bit bank encryption.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-xs">UPI</span>
            <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-xs">RuPay</span>
            <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-xs">Visa</span>
            <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-xs">Mastercard</span>
            <span className="bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-xs">NetBanking</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} StayEase Hospitality Pvt. Ltd. All rights reserved.</p>
        <p className="flex items-center">
          Crafted with <Heart className="w-3.5 h-3.5 mx-1 text-red-500 fill-red-500" /> for travelers in India & Worldwide
        </p>
      </div>
    </footer>
  );
}
