import { useState, useEffect } from 'react';
import { useAuth, useUser } from './auth';

const WATCHLIST_EVENT = 'stayease_watchlist_updated';

const getStorageKey = (userId) => `stayease_watchlist_${userId || 'guest'}`;

export const getSavedWatchlist = (userId) => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveWatchlist = (userId, list) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(WATCHLIST_EVENT, { detail: { userId, list } }));
  } catch (e) {}
};

export function useWatchlist() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const userId = user?.id || user?.email || (isSignedIn ? 'user_default' : null);

  const [watchlist, setWatchlist] = useState(() => (userId ? getSavedWatchlist(userId) : []));

  useEffect(() => {
    if (!userId) {
      setWatchlist([]);
      return;
    }
    setWatchlist(getSavedWatchlist(userId));

    const handleUpdate = () => {
      setWatchlist(getSavedWatchlist(userId));
    };

    window.addEventListener(WATCHLIST_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(WATCHLIST_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [userId]);

  const isInWatchlist = (hotelId) => {
    if (!hotelId) return false;
    return watchlist.some((item) => String(item.id) === String(hotelId));
  };

  const toggleWatchlist = (hotel) => {
    if (!userId || !hotel) return { added: false, list: watchlist };

    const hotelId = hotel.id;
    const exists = isInWatchlist(hotelId);
    let updated;

    if (exists) {
      updated = watchlist.filter((item) => String(item.id) !== String(hotelId));
    } else {
      const sanitized = {
        id: hotel.id,
        name: hotel.name,
        city: hotel.city,
        country: hotel.country,
        starRating: hotel.starRating,
        averageRating: hotel.averageRating,
        rating: hotel.rating,
        amenities: hotel.amenities,
        priceFrom: hotel.priceFrom,
        price: hotel.price,
        imageUrls: hotel.imageUrls,
      };
      updated = [sanitized, ...watchlist.filter((item) => String(item.id) !== String(hotelId))];
    }

    saveWatchlist(userId, updated);
    setWatchlist(updated);
    return { added: !exists, list: updated };
  };

  const clearWatchlist = () => {
    if (!userId) return;
    saveWatchlist(userId, []);
    setWatchlist([]);
  };

  return {
    watchlist,
    count: watchlist.length,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    isSignedIn,
  };
}
