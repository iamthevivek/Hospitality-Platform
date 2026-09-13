import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchHotels } from '../lib/api';
import HotelCard from '../components/hotels/HotelCard';
import SearchBar from '../components/hotels/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Filter, RotateCcw, Star, Check, SlidersHorizontal } from 'lucide-react';

const COMMON_AMENITIES = ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Beach'];

export default function HotelsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const city = searchParams.get('city') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = searchParams.get('guests') || '';

  // Reactive filter state
  const [selectedRating, setSelectedRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(60000);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('ALL'); // 'ALL' | 'INDIA' | 'INTERNATIONAL'
  const [sortBy, setSortBy] = useState('recommended');

  const { data: hotels, isLoading, error } = useQuery({
    queryKey: ['hotels', city, checkIn, checkOut, guests],
    queryFn: () => searchHotels({ city, checkIn, checkOut, guests })
  });

  const rawHotelList = Array.isArray(hotels) ? hotels : (hotels?.content || hotels?.data?.content || hotels?.data || []);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setSelectedRating(0);
    setMaxPrice(60000);
    setSelectedAmenities([]);
    setSelectedRegion('ALL');
    setSortBy('recommended');
    setSearchParams({});
  };

  // Client-side reactive filtering
  const filteredHotels = useMemo(() => {
    return rawHotelList.filter((hotel) => {
      // Search term check (city, country, hotel name)
      if (city && city.trim()) {
        const q = city.toLowerCase().trim();
        const matchesCity = (hotel.city || '').toLowerCase().includes(q);
        const matchesCountry = (hotel.country || '').toLowerCase().includes(q);
        const matchesName = (hotel.name || '').toLowerCase().includes(q);
        if (!matchesCity && !matchesCountry && !matchesName) {
          return false;
        }
      }

      // Rating filter
      const rating = hotel.starRating ?? hotel.averageRating ?? hotel.rating ?? 4;
      if (selectedRating > 0 && rating < selectedRating) {
        return false;
      }

      // Price filter
      const price = Number(hotel.priceFrom ?? hotel.price ?? 0);
      if (price > maxPrice) {
        return false;
      }

      // Region filter
      if (selectedRegion === 'INDIA') {
        const isIndia = (hotel.country && hotel.country.toLowerCase().includes('india')) ||
          ['mumbai', 'delhi', 'jaipur', 'goa', 'udaipur', 'chennai', 'bengaluru', 'kerala'].some(c =>
            (hotel.city || '').toLowerCase().includes(c)
          );
        if (!isIndia) return false;
      } else if (selectedRegion === 'INTERNATIONAL') {
        const isIndia = (hotel.country && hotel.country.toLowerCase().includes('india')) ||
          ['mumbai', 'delhi', 'jaipur', 'goa', 'udaipur', 'chennai', 'bengaluru', 'kerala'].some(c =>
            (hotel.city || '').toLowerCase().includes(c)
          );
        if (isIndia) return false;
      }

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hotelAmenities = Array.isArray(hotel.amenities)
          ? hotel.amenities.map(a => a.toLowerCase())
          : typeof hotel.amenities === 'string'
            ? hotel.amenities.toLowerCase().split(/[\s,]+/)
            : [];
        
        const hasAllSelected = selectedAmenities.every((amenity) =>
          hotelAmenities.some(ha => ha.includes(amenity.toLowerCase()))
        );
        if (!hasAllSelected) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = Number(a.priceFrom ?? a.price ?? 0);
      const priceB = Number(b.priceFrom ?? b.price ?? 0);
      const ratingA = Number(a.starRating ?? a.averageRating ?? 0);
      const ratingB = Number(b.starRating ?? b.averageRating ?? 0);

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return ratingB - ratingA;
      return 0; // recommended
    });
  }, [rawHotelList, city, selectedRating, maxPrice, selectedRegion, selectedAmenities, sortBy]);

  const hasActiveSearch = Boolean(city || checkIn || checkOut || (guests && guests !== '2'));
  const activeFiltersCount = (selectedRating > 0 ? 1 : 0) +
    (maxPrice < 60000 ? 1 : 0) +
    (selectedRegion !== 'ALL' ? 1 : 0) +
    selectedAmenities.length +
    (hasActiveSearch ? 1 : 0);

  return (
    <div className="bg-slate-50/50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <SearchBar showTrending={false} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold text-slate-900 text-lg">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary-50 text-primary-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center text-xs font-semibold text-gray-500 hover:text-primary-600 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Reset
                  </button>
                )}
              </div>

              {/* Destination Region Filter */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-3">Destination Region</h4>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
                  {[
                    { id: 'ALL', label: 'All' },
                    { id: 'INDIA', label: '🇮🇳 India' },
                    { id: 'INTERNATIONAL', label: 'Global' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedRegion(tab.id)}
                      className={`py-2 rounded-lg transition ${
                        selectedRegion === tab.id
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Rating Filter */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-3">Star Rating</h4>
                <div className="space-y-2">
                  {[
                    { stars: 5, label: '5 Stars Only' },
                    { stars: 4, label: '4 Stars & Up' },
                    { stars: 3, label: '3 Stars & Up' },
                    { stars: 0, label: 'All Ratings' }
                  ].map(({ stars, label }) => (
                    <label
                      key={stars}
                      onClick={() => setSelectedRating(stars)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition text-sm ${
                        selectedRating === stars
                          ? 'bg-primary-50 text-primary-900 font-semibold border border-primary-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="mr-2 text-amber-500 flex">
                          {stars > 0 ? '★'.repeat(stars) : '★ All'}
                        </span>
                        <span>{label}</span>
                      </span>
                      {selectedRating === stars && (
                        <Check className="w-4 h-4 text-primary-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-gray-900 text-sm">Max Price per Night</h4>
                  <span className="text-primary-600 font-bold text-sm">
                    ₹{maxPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="60000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary-600 cursor-pointer h-2 bg-gray-200 rounded-lg"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                  <span>₹5,000</span>
                  <span>₹30,000</span>
                  <span>₹60,000+</span>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-3">Popular Amenities</h4>
                <div className="space-y-2">
                  {COMMON_AMENITIES.map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        className="flex items-center space-x-3 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer"
                        />
                        <span>{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-200 gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {city ? `Properties in ${city}` : selectedRegion === 'INDIA' ? 'Hotels in India 🇮🇳' : selectedRegion === 'INTERNATIONAL' ? 'International Destinations' : 'Explore All Properties'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Showing <span className="font-semibold text-gray-900">{filteredHotels.length}</span> of {rawHotelList.length} properties
                </p>
              </div>

              {/* Sort Order Dropdown */}
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="py-24 flex justify-center"><LoadingSpinner className="w-12 h-12" /></div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center">
                <p className="font-bold mb-1">Failed to load hotels</p>
                <p className="text-sm">Please make sure the backend is running and refresh.</p>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div className="bg-white p-14 rounded-2xl border border-gray-200 text-center shadow-sm max-w-md mx-auto my-8">
                <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No hotels match your filters</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Try clearing some filter criteria, expanding your price range, or searching for another destination.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
