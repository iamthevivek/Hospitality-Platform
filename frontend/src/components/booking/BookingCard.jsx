import React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, MapPin, CreditCard } from 'lucide-react';
import BookingStatusBadge from '../common/BookingStatusBadge';
import { Link } from 'react-router-dom';

function formatDateSafe(dateVal) {
  if (!dateVal) return 'N/A';
  try {
    const d = typeof dateVal === 'string' ? parseISO(dateVal) : new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return format(d, 'MMM d, yyyy');
  } catch (e) {
    return String(dateVal);
  }
}

export default function BookingCard({ booking, onCancel, isCancelling }) {
  if (!booking) return null;

  const { id, hotelName, roomNumber, status } = booking;
  const checkIn = booking.checkInDate || booking.checkIn;
  const checkOut = booking.checkOutDate || booking.checkOut;
  const totalAmount = booking.totalAmount || 0;

  const checkInDateObj = checkIn ? new Date(checkIn) : null;
  const isCancellable = (status === 'PENDING' || status === 'CONFIRMED') &&
    checkInDateObj && !isNaN(checkInDateObj.getTime()) && checkInDateObj > new Date();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 border-b border-gray-100 pb-4 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
              Booking #{id}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{hotelName || 'Hotel Stay'}</h3>
          </div>
          <p className="text-gray-500 text-sm flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1 text-primary-500" />
            {booking.hotelCity ? `${booking.hotelCity} • ` : ''}Room {roomNumber || 'Standard'} ({booking.roomType || 'Room'})
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <BookingStatusBadge status={status} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-5 bg-gray-50 p-3.5 rounded-xl text-sm">
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Check-in</span>
          <div className="flex items-center text-gray-900 font-semibold mt-1">
            <Calendar className="w-4 h-4 mr-1.5 text-primary-600 flex-shrink-0" />
            <span>{formatDateSafe(checkIn)}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Check-out</span>
          <div className="flex items-center text-gray-900 font-semibold mt-1">
            <Calendar className="w-4 h-4 mr-1.5 text-primary-600 flex-shrink-0" />
            <span>{formatDateSafe(checkOut)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-center pt-3 border-t border-gray-100 gap-3">
        <div className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Paid / Due</p>
            <p className="text-xl font-bold text-gray-900">₹{Number(totalAmount).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isCancellable && onCancel && (
            <button 
              onClick={() => onCancel(booking)}
              disabled={isCancelling}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          )}
          {booking.hotelId && (
            <Link 
              to={`/hotels/${booking.hotelId}`} 
              className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition"
            >
              View Hotel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
