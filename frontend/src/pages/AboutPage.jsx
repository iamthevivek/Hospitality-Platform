import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Award, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="relative bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#0d7e8a_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="relative max-w-5xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-6 tracking-wider uppercase">
            <Award className="w-3.5 h-3.5" /> The StayEase Journey
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Reimagining Luxury Hospitality in India & Worldwide
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            StayEase connects discerning travelers with the world's most iconic stays—from timeless royal palaces in Rajasthan to sun-soaked coastal retreats in Goa and premier metropolitan hotels.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="text-center p-3 border-r border-gray-100 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-primary-600">500+</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Curated Luxury Stays</div>
          </div>
          <div className="text-center p-3 border-r border-gray-100 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-primary-600">120K+</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Delighted Guests</div>
          </div>
          <div className="text-center p-3 border-r border-gray-100 last:border-0">
            <div className="text-3xl sm:text-4xl font-black text-primary-600">4.9 / 5</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Guest Satisfaction</div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl sm:text-4xl font-black text-primary-600">24 / 7</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Guest Support</div>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">The StayEase Philosophy</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Rooted in 'Atithi Devo Bhava', Crafted for the Digital Generation
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We founded StayEase with a singular mission: luxury travel in India and abroad should be effortless, authentic, and completely transparent. In an era dominated by cluttered aggregator portals, we hand-curate every single listing.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Whether you are gazing at the Arabian Sea from The Taj Mahal Palace Mumbai, wandering the courtyards of Rambagh Palace in Jaipur, or relaxing at beachside sanctuaries in Goa, StayEase guarantees instant booking confirmations, all amounts clearly quoted in Indian Rupees (₹), and support for Indian payment instruments including UPI and RuPay.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/hotels"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20 transition"
              >
                Browse Hotels <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 hover:bg-gray-50 transition"
              >
                Contact Support Team
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80"
              alt="Luxury suite"
              className="rounded-2xl shadow-lg object-cover h-64 w-full"
            />
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
              alt="Resort pool"
              className="rounded-2xl shadow-lg object-cover h-64 w-full mt-8"
            />
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="bg-slate-50 py-16 border-y border-gray-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Core Pillars</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Why Discerning Travelers Choose Us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Guaranteed Best Rates (₹)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Zero hidden booking markups. All prices are calculated in Indian Rupees with transparent GST breakdowns and direct partner parity.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Handpicked Quality Standards</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every property in our portfolio undergoes a strict 50-point inspection covering cleanliness, architecture, dining, and guest privacy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Flexible 1-Click Cancellations</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Plans change unexpectedly. Enjoy quick cancellations directly from your dashboard with prompt refunds to your original payment method.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
