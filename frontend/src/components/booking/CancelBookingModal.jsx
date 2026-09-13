import React, { useState } from 'react';
import { AlertTriangle, X, Calendar, MapPin, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import LoadingSpinner from '../common/LoadingSpinner';

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

export default function CancelBookingModal({ isOpen, booking, onClose, onConfirm, isCancelling }) {
  const [reason, setReason] = useState('Change of travel plans');

  if (!isOpen || !booking) return null;

  const checkIn = booking.checkInDate || booking.checkIn;
  const checkOut = booking.checkOutDate || booking.checkOut;
  const totalAmount = Number(booking.totalAmount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 sm:p-8 pb-4 text-center">
          <button
            onClick={onClose}
            disabled={isCancelling}
            className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50/50">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Cancel Reservation?
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Are you sure you want to cancel your stay at <strong className="text-gray-800">{booking.hotelName || 'this property'}</strong>?
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="px-6 sm:px-8 space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-200/60">
              <span className="font-semibold text-gray-500 uppercase tracking-wide">Reservation</span>
              <span className="font-bold text-gray-900 bg-gray-200/70 px-2 py-0.5 rounded">Booking #{booking.id}</span>
            </div>

            <div className="flex items-center text-sm text-gray-800 font-medium">
              <Calendar className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
              <span>{formatDateSafe(checkIn)} — {formatDateSafe(checkOut)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-800 font-medium">
              <MapPin className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0" />
              <span>Room {booking.roomNumber || 'Standard'} ({booking.roomType || 'Deluxe'})</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-200/60 text-sm">
              <span className="text-gray-500">Refund Amount:</span>
              <span className="text-base font-bold text-emerald-600">
                ₹{totalAmount.toLocaleString('en-IN')} (100% Refund)
              </span>
            </div>
          </div>

          {/* Refund policy highlight */}
          <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-xl p-3.5 flex items-start space-x-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">Zero Cancellation Fee</p>
              <p className="text-emerald-700 mt-0.5">
                Full amount of ₹{totalAmount.toLocaleString('en-IN')} will be credited back to your original payment method (UPI / Card) within 24 to 48 hours.
              </p>
            </div>
          </div>

          {/* Optional reason selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
              Reason for Cancellation (Optional)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isCancelling}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-700 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="Change of travel plans">Change of travel plans</option>
              <option value="Found alternative accommodation">Found alternative accommodation</option>
              <option value="Personal / Medical emergency">Personal / Medical emergency</option>
              <option value="Booking dates need modification">Booking dates need modification</option>
              <option value="Other">Other reason</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 sm:p-8 pt-6 flex flex-col-reverse sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="w-full sm:w-1/2 py-3 px-4 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Keep Reservation
          </button>
          
          <button
            type="button"
            onClick={() => onConfirm(booking.id)}
            disabled={isCancelling}
            className="w-full sm:w-1/2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-red-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isCancelling ? (
              <>
                <LoadingSpinner className="w-4 h-4 text-white" />
                <span>Cancelling...</span>
              </>
            ) : (
              <span>Yes, Cancel Booking</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
