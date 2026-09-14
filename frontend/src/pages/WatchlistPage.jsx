import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Trash2, Sparkles, Building2 } from 'lucide-react';
import { useWatchlist } from '../lib/watchlist';
import HotelCard from '../components/hotels/HotelCard';

export default function WatchlistPage() {
  const { watchlist, count, clearWatchlist } = useWatchlist();

  return (
    <div className="bg-slate-50/60 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-200/80 mb-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Saved Stays</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              My Watchlist
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Your curated collection of favorite luxury hotels and resorts.
            </p>
          </div>

          {count > 0 && (
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm">
                {count} {count === 1 ? 'Hotel' : 'Hotels'} Saved
              </span>
              <button
                type="button"
                onClick={clearWatchlist}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full border border-rose-200 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Watchlist
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {count === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-5 border border-rose-100">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your watchlist is empty</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Explore handpicked hotels & resorts and tap the heart icon on any stay to save it to your personal collection.
            </p>
            <Link
              to="/hotels"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0d7e8a] hover:bg-[#0b6b75] text-white font-bold text-sm rounded-full shadow-md shadow-[#0d7e8a]/20 transition"
            >
              <Compass className="w-4 h-4" />
              Explore Stays
            </Link>
          </div>
        ) : (
          /* Grid of Saved Hotels */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {watchlist.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
