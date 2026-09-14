import React from 'react';
import { MapPin, Heart, Star, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../lib/auth';
import { useWatchlist } from '../../lib/watchlist';

export default function HotelCard({ hotel }) {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  if (!hotel) return null;

  const isFavorite = isInWatchlist(hotel.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error('Please sign in to access your watchlist');
      navigate('/sign-in', {
        state: {
          from: location,
          message: 'Please sign in to save hotels to your watchlist.',
        },
      });
      return;
    }

    const { added } = toggleWatchlist(hotel);
    if (added) {
      toast.success(`Saved "${hotel.name}" to your watchlist ❤️`);
    } else {
      toast(`Removed "${hotel.name}" from watchlist`);
    }
  };

  const { id, name, city, country, starRating, averageRating, rating, amenities, priceFrom, price, imageUrls } = hotel;

  let image = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  if (Array.isArray(imageUrls) && imageUrls.length > 0 && imageUrls[0]) {
    image = imageUrls[0].trim();
  } else if (typeof imageUrls === 'string' && imageUrls.trim()) {
    image = imageUrls.split(/[\s,]+/)[0];
  }

  const amenitiesList = Array.isArray(amenities)
    ? amenities
    : (typeof amenities === 'string' ? amenities.split(/[\s,]+/).filter(Boolean) : []);

  const displayRating = Number(starRating ?? averageRating ?? rating ?? 4.8);
  const displayPrice = priceFrom ?? price ?? 14999;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-900/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Aspect 16:10 Image Frame */}
        <div className="aspect-[16/10] overflow-hidden relative bg-slate-100">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-60"></div>
          
          {/* Top-left Rating Badge */}
          <div className="absolute top-3.5 left-3.5 bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm border border-white/10">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{displayRating >= 1 ? displayRating.toFixed(1) : '4.8'}</span>
            <span className="text-white/60 font-normal text-[11px]">• Superb</span>
          </div>

          {/* Top-right Favorite Heart */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-700 transition duration-200 shadow-sm"
            aria-label="Save to favorites"
          >
            <Heart className={`w-4 h-4 transition ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}`} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-center text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <MapPin className="w-3.5 h-3.5 mr-1 text-primary-600 flex-shrink-0" />
            <span className="truncate">{city}, {country}</span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition duration-200 line-clamp-1 mb-3">
            {name}
          </h3>

          {amenitiesList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {amenitiesList.slice(0, 3).map((amenity, idx) => (
                <span key={idx} className="text-[11px] font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                  {amenity}
                </span>
              ))}
              {amenitiesList.length > 3 && (
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                  +{amenitiesList.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer / Price & Action */}
      <div className="px-5 pb-5 pt-0">
        <div className="flex justify-between items-center pt-3.5 border-t border-slate-100">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Starting from</p>
            <p className="text-lg font-black text-slate-900 tracking-tight">
              ₹{Number(displayPrice).toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-500 ml-1">/ night</span>
            </p>
          </div>
          <Link 
            to={`/hotels/${id}`} 
            className="inline-flex items-center space-x-1 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full group-hover:bg-primary-600 transition-colors shadow-sm"
          >
            <span>Explore</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

