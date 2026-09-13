import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, MapPin, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const POPULAR_DESTINATIONS = [
  { name: 'Goa', tag: 'Beach Resort' },
  { name: 'Jaipur', tag: 'Royal Palace' },
  { name: 'Udaipur', tag: 'Lakeside' },
  { name: 'Mumbai', tag: 'City View' },
  { name: 'Dubai', tag: 'Iconic Sky' },
  { name: 'Paris', tag: 'Heritage' },
];

export default function SearchBar({ showTrending = true }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [city, setCity] = useState(searchParams.get('city') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');

  useEffect(() => {
    setCity(searchParams.get('city') || '');
    setCheckIn(searchParams.get('checkIn') || '');
    setCheckOut(searchParams.get('checkOut') || '');
    setGuests(searchParams.get('guests') || '2');
  }, [searchParams]);

  const executeSearch = (targetCity = city) => {
    const params = new URLSearchParams();
    if (targetCity && targetCity.trim()) params.append('city', targetCity.trim());
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);
    
    navigate(`/hotels?${params.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    executeSearch();
  };

  const handleQuickDestination = (destName) => {
    setCity(destName);
    executeSearch(destName);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Floating Bar */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-full shadow-2xl shadow-slate-950/20 border border-slate-200/90 p-2 md:p-2.5 transition-all duration-300">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Location / Destination */}
          <div className="flex-1 w-full flex items-center px-4 py-2.5 md:py-1 group hover:bg-slate-50/70 rounded-2xl md:rounded-l-full transition">
            <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-primary-100/70 transition">
              <MapPin className="w-4 h-4 text-primary-600" />
            </div>
            <div className="w-full relative">
              <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Destination
              </label>
              <input 
                type="text" 
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Where would you like to stay?" 
                className="w-full outline-none text-slate-900 placeholder-slate-400 font-semibold bg-transparent text-sm truncate"
              />
              {city && (
                <button
                  type="button"
                  onClick={() => setCity('')}
                  className="absolute right-0 top-3 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          
          {/* Check In */}
          <div className="flex-1 w-full flex items-center px-4 py-2.5 md:py-1 group hover:bg-slate-50/70 transition">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-primary-50 transition">
              <Calendar className="w-4 h-4 text-slate-600 group-hover:text-primary-600 transition" />
            </div>
            <div className="w-full">
              <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Check In
              </label>
              <input 
                type="date" 
                name="checkIn"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full outline-none text-slate-800 font-semibold bg-transparent text-sm cursor-pointer"
              />
            </div>
          </div>
          
          {/* Check Out */}
          <div className="flex-1 w-full flex items-center px-4 py-2.5 md:py-1 group hover:bg-slate-50/70 transition">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-primary-50 transition">
              <Calendar className="w-4 h-4 text-slate-600 group-hover:text-primary-600 transition" />
            </div>
            <div className="w-full">
              <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Check Out
              </label>
              <input 
                type="date" 
                name="checkOut"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full outline-none text-slate-800 font-semibold bg-transparent text-sm cursor-pointer"
              />
            </div>
          </div>
          
          {/* Guests */}
          <div className="w-full md:w-36 flex items-center px-4 py-2.5 md:py-1 group hover:bg-slate-50/70 transition">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-primary-50 transition">
              <Users className="w-4 h-4 text-slate-600 group-hover:text-primary-600 transition" />
            </div>
            <div className="w-full">
              <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Guests
              </label>
              <select 
                name="guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full outline-none text-slate-800 font-semibold bg-transparent text-sm cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Search CTA */}
          <div className="p-1 w-full md:w-auto">
            <button 
              type="submit" 
              className="w-full md:w-auto bg-[#0d7e8a] hover:bg-[#0b6b75] text-white rounded-xl md:rounded-full px-7 py-3.5 flex items-center justify-center space-x-2 font-bold text-sm shadow-md shadow-[#0d7e8a]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Search className="w-4 h-4" />
              <span>Explore Stays</span>
            </button>
          </div>
          
        </form>
      </div>

      {/* Trending Destination Pills */}
      {showTrending && (
        <div className="mt-4 flex items-center justify-center flex-wrap gap-2 px-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs mr-1">
            <span className="w-2 h-2 rounded-full bg-[#0d7e8a]"></span>
            <span>Popular:</span>
          </div>
          {POPULAR_DESTINATIONS.map((dest) => (
            <button
              key={dest.name}
              type="button"
              onClick={() => handleQuickDestination(dest.name)}
              className="group px-3.5 py-1.5 bg-white/85 hover:bg-white text-slate-700 hover:text-[#0d7e8a] backdrop-blur-md border border-slate-200/80 hover:border-[#0d7e8a]/40 rounded-full text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-200 flex items-center space-x-1.5"
            >
              <span>{dest.name}</span>
              <span className="text-[10px] text-slate-400 group-hover:text-[#0d7e8a]">({dest.tag})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

