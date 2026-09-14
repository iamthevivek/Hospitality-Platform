import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, IndianRupee, Loader2, Heart } from 'lucide-react';
import { getMyBookings, cancelBooking } from '../lib/api';
import { useWatchlist } from '../lib/watchlist';
import BookingCard from '../components/booking/BookingCard';
import CancelBookingModal from '../components/booking/CancelBookingModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const TABS = ['All', 'Upcoming', 'Past', 'Cancelled'];

export default function DashboardPage() {
  const { user } = useUser();
  const { count: watchlistCount } = useWatchlist();
  const [activeTab, setActiveTab] = useState('All');
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const queryClient = useQueryClient();

  const { data: bookingsData, isLoading, error } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: getMyBookings,
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId) => cancelBooking(bookingId),
    onSuccess: () => {
      toast.success('Reservation cancelled successfully. Refund initiated.');
      setCancelModalBooking(null);
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    },
  });

  const bookings = Array.isArray(bookingsData) ? bookingsData : (bookingsData?.data || []);
  const today = new Date();

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'All') return true;
    const checkIn = b.checkInDate || b.checkIn;
    const checkOut = b.checkOutDate || b.checkOut;
    const checkInD = checkIn ? new Date(checkIn) : null;
    const checkOutD = checkOut ? new Date(checkOut) : null;
    const hasValidCheckIn = checkInD && !isNaN(checkInD.getTime());
    const hasValidCheckOut = checkOutD && !isNaN(checkOutD.getTime());

    if (activeTab === 'Upcoming') {
      return b.status !== 'CANCELLED' && hasValidCheckIn && checkInD >= today;
    }
    if (activeTab === 'Past') {
      return b.status === 'COMPLETED' || (b.status !== 'CANCELLED' && hasValidCheckOut && checkOutD < today);
    }
    if (activeTab === 'Cancelled') {
      return b.status === 'CANCELLED';
    }
    return true;
  });

  // Stats
  const totalBookings = bookings.length;
  const upcomingCount = bookings.filter((b) => {
    const checkIn = b.checkInDate || b.checkIn;
    const checkInD = checkIn ? new Date(checkIn) : null;
    return b.status !== 'CANCELLED' && checkInD && !isNaN(checkInD.getTime()) && checkInD >= today;
  }).length;

  const totalSpent = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  if (isLoading) return <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner /></div>;

  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md mx-auto">
        <p className="font-semibold mb-2">Failed to load bookings</p>
        <p className="text-sm">Please make sure the backend is running and try again.</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['my-bookings'] })}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'Alex'} 👋
        </h1>
        <p className="text-gray-500 mt-1">Manage your hotel reservations and trips.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-gray-100">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Calendar className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            <p className="text-sm text-gray-500">Total Reservations</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-gray-100">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
            <p className="text-sm text-gray-500">Upcoming Stays</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-gray-100">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <IndianRupee className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-500">Total Spent</p>
          </div>
        </div>
        <Link
          to="/watchlist"
          className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-gray-100 hover:border-rose-200 hover:shadow-md transition group"
        >
          <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-105 transition">
            <Heart className="h-6 w-6 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{watchlistCount}</p>
            <p className="text-sm text-gray-500 group-hover:text-rose-600 transition">Saved in Watchlist</p>
          </div>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1.5 rounded-xl mb-6 w-fit max-w-full overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">🧳</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No {activeTab.toLowerCase()} bookings</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {activeTab === 'All'
              ? "You haven't made any bookings yet. Start exploring luxury hotels worldwide and across India!"
              : `You have no ${activeTab.toLowerCase()} bookings in your account.`}
          </p>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 bg-[#0d7e8a] hover:bg-[#0b6b75] text-white px-6 py-3 rounded-xl transition font-medium shadow-sm"
          >
            Explore Hotels
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={(selectedBooking) => {
                setCancelModalBooking(selectedBooking);
              }}
              isCancelling={cancelMutation.isPending && cancelModalBooking?.id === booking.id}
            />
          ))}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      <CancelBookingModal
        isOpen={Boolean(cancelModalBooking)}
        booking={cancelModalBooking}
        onClose={() => setCancelModalBooking(null)}
        onConfirm={(id) => cancelMutation.mutate(id)}
        isCancelling={cancelMutation.isPending}
      />
    </div>
  );
}
