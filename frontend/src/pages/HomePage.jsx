import React from 'react';
import SearchBar from '../components/hotels/SearchBar';
import HotelCard from '../components/hotels/HotelCard';
import { useQuery } from '@tanstack/react-query';
import { getHotels } from '../lib/api';
import { ShieldCheck, Tag, ArrowRight, Star, Award, Compass, MessageSquare, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const DESTINATION_HIGHLIGHTS = [
  {
    name: 'Jaipur, Rajasthan',
    subtitle: 'Royal Palaces & Haveli Stays',
    hotels: '18 Properties',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
    query: 'Jaipur'
  },
  {
    name: 'Goa',
    subtitle: 'Private Beach Resorts & Villas',
    hotels: '24 Properties',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    query: 'Goa'
  },
  {
    name: 'Udaipur',
    subtitle: 'Romantic Lake Palaces',
    hotels: '15 Properties',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&q=80',
    query: 'Udaipur'
  },
  {
    name: 'Dubai',
    subtitle: 'Iconic Skyline & Palm Jumeirah',
    hotels: '32 Properties',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    query: 'Dubai'
  }
];

const TESTIMONIALS = [
  {
    quote: "Booking the Lake Palace suite through StayEase was seamless. Seamless check-in, transparent INR pricing, and exceptional concierge recommendations.",
    author: "Aarav Singhania",
    location: "Mumbai",
    stay: "The Leela Palace, Udaipur",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
  },
  {
    quote: "The direct UPI payment without international conversion fees made booking our family vacation to Goa effortless. Truly 5-star standard.",
    author: "Dr. Ananya Roy",
    location: "Bengaluru",
    stay: "Taj Exotica Resort & Spa, Goa",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
  },
  {
    quote: "StayEase's curated hotel collection only features verified luxury properties. Every detail was exactly as depicted on the portal.",
    author: "Vikramaditya Mehta",
    location: "New Delhi",
    stay: "Rambagh Palace, Jaipur",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
  }
];

export default function HomePage() {
  const { data: hotels, isLoading } = useQuery({
    queryKey: ['featured-hotels'],
    queryFn: () => getHotels()
  });

  const hotelsList = Array.isArray(hotels) ? hotels : (hotels?.content || hotels?.data?.content || hotels?.data || []);
  const featuredHotels = hotelsList.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative min-h-[640px] flex items-center justify-center bg-slate-900 overflow-hidden pt-12 pb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85" 
            alt="Luxury Resort Horizon" 
            className="w-full h-full object-cover object-center scale-100 opacity-85"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=85';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/30 to-slate-900/20"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          {/* Tag Pill */}
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md border border-white/60 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#0d7e8a]"></span>
            <span className="text-slate-800 text-xs font-bold uppercase tracking-widest">
              Curated Heritage Palaces & 5-Star Sanctuaries
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl mb-6">
            Where Elegance Meets Exceptional Hospitality.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Immerse yourself in world-class royal suites across India and premier international destinations with instant reservation and member privileges.
          </p>
          
          {/* Integrated Search Bar */}
          <div className="w-full">
            <SearchBar showTrending={true} />
          </div>
        </div>
      </section>

      {/* Trending Destination Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">Trending Escapes</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Popular Destinations
            </h2>
          </div>
          <Link 
            to="/hotels" 
            className="text-xs font-bold text-slate-600 hover:text-primary-600 flex items-center space-x-1 transition"
          >
            <span>Browse all cities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DESTINATION_HIGHLIGHTS.map((dest) => (
            <Link
              key={dest.name}
              to={`/hotels?city=${dest.query}`}
              className="group relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img 
                src={dest.image} 
                alt={dest.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
              
              <div className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-xs">
                {dest.hotels}
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xs text-amber-300 font-semibold mb-0.5">{dest.subtitle}</p>
                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-amber-200 transition">
                  {dest.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hotels Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-10 gap-3 border-b border-slate-200/80 pb-6">
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">Handpicked Stays</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Featured Luxury Properties
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Exclusively vetted for architecture, serene ambiance, and unparalleled service.
            </p>
          </div>
          <Link
            to="/hotels"
            className="inline-flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-primary-600 transition shadow-sm w-fit"
          >
            <span>Explore All 10 Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner className="w-10 h-10 text-primary-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.map(hotel => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </section>

      {/* Bento Grid: Why Book With StayEase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">The StayEase Standard</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Redefining Luxury Travel
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Every booking is backed by our direct property guarantee, transparent pricing, and attentive guest service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Secure INR Payments</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Pay safely in Indian Rupees (₹) via UPI, RuPay, Visa, Mastercard, and NetBanking with PCI-DSS 256-bit encryption.
              </p>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero foreign conversion markups</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#0d7e8a] mb-6">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">24/7 Travel Assistant</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Our intelligent travel assistant offers tailored heritage suite recommendations, dining itineraries, and local insider guides.
              </p>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant response via chat & phone</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Direct Rate Guarantee</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Direct partnerships with luxury hotel chains guarantee the most competitive rates with no hidden booking fees.
              </p>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Flexible cancellation available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Guest Testimonials */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">Guest Stories</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Trusted by Discerning Travelers
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Discover why over 10,000+ guests choose StayEase for their special occasions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50/70 rounded-3xl p-7 border border-slate-200/70 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center space-x-1 text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>
                
                <div className="flex items-center space-x-3 pt-4 border-t border-slate-200/60">
                  <img 
                    src={t.avatar} 
                    alt={t.author} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                    <p className="text-[11px] text-slate-400">{t.stay} • {t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Benefit Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#0d7e8a] to-slate-900 p-8 sm:p-14 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/25 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-teal-300"></span>
              <span>Member Privileges</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Unlock Special Member Rates & Complimentary Upgrades
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-8">
              Create your account today to receive early check-in privileges, curated dining perks, and private seasonal offers on heritage retreats.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                to="/sign-up" 
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-full shadow-lg transition hover:-translate-y-0.5"
              >
                <span>Sign Up for Free</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link 
                to="/hotels" 
                className="inline-flex items-center justify-center px-7 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold text-sm rounded-full border border-white/25 backdrop-blur-md transition"
              >
                <span>Browse Hotels</span>
              </Link>
            </div>
          </div>
          
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 hidden lg:block overflow-hidden pointer-events-none">
            <Compass className="w-96 h-96 -mr-16 -mb-16 text-white" />
          </div>
        </div>
      </section>
    </div>
  );
}

