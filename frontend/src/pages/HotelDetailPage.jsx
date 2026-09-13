import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getHotelById, getAvailableRooms, getHotelReviews } from '../lib/api';
import RoomCard from '../components/hotels/RoomCard';
import ReviewCard from '../components/hotels/ReviewCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StarRating from '../components/common/StarRating';
import { MapPin, Wifi, Coffee, Dumbbell, Car, Search } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function HotelDetailPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isSignedIn } = useAuth();
  
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterTomorrow = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const initialCheckIn = searchParams.get('checkIn') || tomorrow;
  const initialCheckOut = searchParams.get('checkOut') || dayAfterTomorrow;
  const initialGuests = searchParams.get('guests') || '2';

  const [dates, setDates] = useState({ checkIn: initialCheckIn, checkOut: initialCheckOut, guests: initialGuests });

  const { data: rawHotel, isLoading: isLoadingHotel } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => getHotelById(id)
  });

  const hotel = rawHotel?.data || rawHotel;

  const { data: rawRooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ['rooms', id, dates.checkIn, dates.checkOut, dates.guests],
    queryFn: () => getAvailableRooms(id, dates),
    enabled: !!id && !!dates.checkIn && !!dates.checkOut
  });

  const rooms = Array.isArray(rawRooms)
    ? rawRooms
    : (rawRooms?.data || (Array.isArray(hotel?.rooms) ? hotel.rooms : []));

  const { data: rawReviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getHotelReviews(id),
    enabled: !!id
  });

  const reviews = Array.isArray(rawReviews) ? rawReviews : (rawReviews?.data || []);

  const handleCheckAvailability = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newDates = {
      checkIn: formData.get('checkIn'),
      checkOut: formData.get('checkOut'),
      guests: formData.get('guests')
    };
    setDates(newDates);
    setSearchParams(newDates);
  };

  if (isLoadingHotel) return <div className="min-h-screen flex justify-center items-center"><LoadingSpinner className="w-12 h-12" /></div>;
  if (!hotel || (!hotel.name && !hotel.id)) return <div className="min-h-screen flex justify-center items-center text-xl text-gray-600">Hotel not found</div>;

  let heroImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
  if (Array.isArray(hotel.imageUrls) && hotel.imageUrls.length > 0 && hotel.imageUrls[0]) {
    heroImage = hotel.imageUrls[0];
  } else if (typeof hotel.imageUrls === 'string' && hotel.imageUrls.trim()) {
    heroImage = hotel.imageUrls.split(/[\s,]+/)[0];
  }

  const amenitiesList = Array.isArray(hotel.amenities)
    ? hotel.amenities
    : (typeof hotel.amenities === 'string' ? hotel.amenities.split(/[\s,]+/).filter(Boolean) : []);

  const displayRating = hotel.starRating ?? hotel.averageRating ?? hotel.rating ?? 4;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      {/* Hero Image */}
      <div className="h-[48vh] md:h-[65vh] w-full relative overflow-hidden bg-slate-950">
        <img 
          src={heroImage} 
          alt={hotel.name} 
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 text-white max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-amber-400/20 backdrop-blur-md border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300 flex items-center space-x-1.5">
              <StarRating rating={displayRating} className="w-3.5 h-3.5" />
              <span>{displayRating.toFixed(1)} / 5.0</span>
            </div>
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold rounded-full text-white uppercase tracking-wider">
              Verified Luxury Partner
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 tracking-tight">
            {hotel.name}
          </h1>
          <p className="flex items-center text-sm sm:text-base text-slate-200 font-medium">
            <MapPin className="w-4 h-4 mr-2 text-primary-400 flex-shrink-0" />
            <span>{hotel.address || `${hotel.city}, ${hotel.country}`}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* About */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/80 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">About this sanctuary</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {hotel.description || 'Experience luxury and comfort in the heart of the city. Our property offers stunning views, premium amenities, and exceptional service to ensure your stay is unforgettable.'}
            </p>
            
            <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">Curated Amenities & Inclusions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center text-slate-700 text-sm font-semibold p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Wifi className="w-4 h-4 mr-2 text-primary-600" /> Free WiFi
              </div>
              <div className="flex items-center text-slate-700 text-sm font-semibold p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Coffee className="w-4 h-4 mr-2 text-primary-600" /> Breakfast
              </div>
              <div className="flex items-center text-slate-700 text-sm font-semibold p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Dumbbell className="w-4 h-4 mr-2 text-primary-600" /> Wellness Gym
              </div>
              <div className="flex items-center text-slate-700 text-sm font-semibold p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Car className="w-4 h-4 mr-2 text-primary-600" /> Valet Parking
              </div>
              {amenitiesList.map((amenity, idx) => (
                <div key={idx} className="flex items-center text-slate-700 text-sm font-medium p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-primary-600 mr-2.5"></div>
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rooms */}
          <div className="mb-8" id="rooms">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Available Rooms & Suites</h2>
              <span className="text-xs font-semibold text-slate-400">All prices in INR (₹)</span>
            </div>
            
            {/* Availability Search Bar */}
            <form onSubmit={handleCheckAvailability} className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Check In</label>
                <input 
                  type="date" 
                  name="checkIn" 
                  defaultValue={dates.checkIn} 
                  required 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 outline-none text-sm font-semibold text-slate-800" 
                />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Check Out</label>
                <input 
                  type="date" 
                  name="checkOut" 
                  defaultValue={dates.checkOut} 
                  required 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 outline-none text-sm font-semibold text-slate-800" 
                />
              </div>
              <div className="w-full md:w-36">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Guests</label>
                <input 
                  type="number" 
                  name="guests" 
                  defaultValue={dates.guests} 
                  min="1" 
                  max="10" 
                  required 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 outline-none text-sm font-semibold text-slate-800" 
                />
              </div>
              <div className="flex items-end">
                <button 
                  type="submit" 
                  className="w-full md:w-auto bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-primary-700 hover:to-indigo-700 flex items-center justify-center transition shadow-md shadow-primary-600/20 h-[44px]"
                >
                  <Search className="w-4 h-4 mr-2" /> Check Availability
                </button>
              </div>
            </form>

            {isLoadingRooms ? (
              <div className="py-12 flex justify-center"><LoadingSpinner /></div>
            ) : rooms.length === 0 ? (
              <div className="bg-gray-100 p-8 rounded-xl text-center text-gray-600">
                No rooms available for the selected dates. Try changing your dates.
              </div>
            ) : (
              <div className="space-y-4">
                {rooms.map(room => (
                  <RoomCard key={room.id} room={{ ...room, hotelName: hotel.name, hotelCity: hotel.city }} searchParams={{ ...dates, hotelName: hotel.name }} />
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
              {isSignedIn && (
                <span className="text-sm text-primary-600 font-medium">Verified traveler reviews</span>
              )}
            </div>
            
            {isLoadingReviews ? (
              <LoadingSpinner />
            ) : reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500">
                No reviews yet. Be the first to review this property after your stay!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-sm border border-slate-200/80 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Location & Neighborhood</h3>
            <p className="text-slate-500 text-xs sm:text-sm mb-4 leading-relaxed">{hotel.address || `${hotel.city}, ${hotel.country}`}</p>
            
            {/* Map Placeholder */}
            <div className="w-full h-48 bg-slate-100 rounded-2xl mb-6 relative overflow-hidden border border-slate-200/60">
              <img src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`} alt="Map" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg text-primary-600 border border-slate-100">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-4">
                <span>Guest Location Score</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">9.6 / 10 Superb</span>
              </div>
              <button 
                onClick={() => {
                  document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 hover:from-primary-700 hover:to-indigo-700 text-white py-3.5 rounded-full font-bold text-sm shadow-md shadow-primary-600/25 hover:shadow-lg hover:shadow-primary-600/35 transition-all duration-200"
              >
                Select Your Suite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
