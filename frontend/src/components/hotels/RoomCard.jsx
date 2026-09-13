import React from 'react';
import { Users, Bed, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

export default function RoomCard({ room, searchParams }) {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { id, type, roomNumber, maxOccupancy, amenities, pricePerNight, imageUrl, imageUrls, hotelName } = room;
  
  let image = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  if (Array.isArray(imageUrls) && imageUrls.length > 0 && imageUrls[0]) {
    image = imageUrls[0];
  } else if (imageUrl) {
    image = imageUrl;
  }

  const amenitiesList = Array.isArray(amenities)
    ? amenities
    : (typeof amenities === 'string' ? amenities.split(/[\s,]+/).filter(Boolean) : []);

  const handleBookNow = () => {
    const bookingPayload = {
      ...searchParams,
      roomId: id,
      room: {
        id,
        type,
        roomNumber,
        pricePerNight,
        hotelName: hotelName || searchParams?.hotelName || 'Selected Hotel',
        maxOccupancy
      }
    };

    if (!isSignedIn) {
      navigate('/sign-in', {
        state: {
          from: {
            pathname: `/book/${id}`,
            state: bookingPayload
          }
        }
      });
      return;
    }

    navigate(`/book/${id}`, {
      state: bookingPayload
    });
  };

  return (
    <div className="group flex flex-col md:flex-row bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-0.5 transition-all duration-300">
      {/* Room Photo */}
      <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt={type} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border border-white/10 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
          <span>{type} Tier</span>
        </div>
      </div>

      {/* Room Info */}
      <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition">
                {type} Suite
              </h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Room No. {roomNumber} • Luxury Collection
              </p>
            </div>
            <div className="flex items-center space-x-3 text-slate-600 text-xs font-semibold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 w-fit">
              <div className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-primary-600" />
                <span>Up to {maxOccupancy} Guests</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Bed className="w-3.5 h-3.5 text-primary-600" />
                <span>King Bed</span>
              </div>
            </div>
          </div>
          
          <p className="text-slate-500 text-xs leading-relaxed mb-4">
            Curated with handcrafted interiors, ambient lighting, Italian marble bathroom, and premium soundproofing for an uninterrupted sleep experience.
          </p>

          {/* Amenities Badges */}
          {amenitiesList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {amenitiesList.map((amenity, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-slate-100/80 text-slate-700 rounded-full"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span>{amenity}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Price & Action CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{Number(pricePerNight).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-normal text-slate-500">/ night</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              ✓ Free cancellation up to 48 hrs prior
            </p>
          </div>

          <button 
            onClick={handleBookNow}
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-sm rounded-full shadow-md shadow-primary-600/25 hover:shadow-lg hover:shadow-primary-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

