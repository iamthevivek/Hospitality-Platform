import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createBooking, createPaymentIntent, confirmDemoPayment } from '../lib/api';
import { format, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  ShieldCheck, CreditCard, CheckCircle2, 
  Smartphone, Building, Lock, QrCode, ArrowRight 
} from 'lucide-react';

const guestSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  specialRequests: z.string().optional(),
});

export default function BookingPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = location.state || {};
  const roomData = searchParams.room || {};
  
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const checkIn = searchParams.checkIn || tomorrow;
  const checkOut = searchParams.checkOut || dayAfter;
  const guests = searchParams.guests || '2';

  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'netbanking'
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Card form state - empty by default with placeholders
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const pricePerNight = Number(roomData.pricePerNight || 18500);
  const hotelName = roomData.hotelName || searchParams.hotelName || 'Luxury Stay';
  const roomType = roomData.type || 'Deluxe Room';

  const nights = Math.max(1, (checkIn && checkOut) ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 2);
  const subtotal = pricePerNight * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      // 1. Create booking on backend
      const bookingData = {
        roomId: Number(roomId),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestCount: parseInt(guests) || 2,
        specialRequests: data.specialRequests || ''
      };
      
      const newBooking = await createBooking(bookingData);
      const bookingObj = newBooking?.data || newBooking;
      setBooking(bookingObj);

      // 2. Prepare Payment Intent
      try {
        const paymentRes = await createPaymentIntent(bookingObj.id);
        const secret = paymentRes?.clientSecret || paymentRes?.data?.clientSecret || 'pi_demo_secret';
        setClientSecret(secret);
      } catch (err) {
        setClientSecret('pi_demo_secret');
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate booking. Please check details.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletePayment = async (e) => {
    e?.preventDefault();
    if (!booking?.id) {
      toast.error('Booking details not found. Please try again.');
      return;
    }

    try {
      setIsProcessingPayment(true);
      // Simulate bank authorization delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      await confirmDemoPayment(booking.id);
      toast.success(`Payment of ₹${total.toLocaleString('en-IN')} confirmed! 🎉`);
      navigate(`/booking/confirm?payment_intent=${booking.id || 'txn_success'}&redirect_status=succeeded`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Payment failed. Please retry.');
    } finally {
      setIsProcessingPayment(false);
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Form & Payment */}
        <div className="flex-[2]">
          {!clientSecret ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Guest Information</h2>
                  <p className="text-sm text-gray-500">Enter primary traveler details for reservation</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input 
                      {...register('firstName')} 
                      placeholder="e.g. Rahul"
                      className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input 
                      {...register('lastName')} 
                      placeholder="e.g. Sharma"
                      className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email"
                      {...register('email')} 
                      placeholder="rahul.sharma@example.com"
                      className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile / Phone Number</label>
                    <input 
                      {...register('phone')} 
                      placeholder="e.g. 9876543210"
                      className={`w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                  <textarea 
                    {...register('specialRequests')} 
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="E.g., High floor, early arrival, king bed preference."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-primary-600 text-white py-3.5 px-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex justify-center items-center shadow-md shadow-primary-600/20"
                >
                  {isLoading ? <LoadingSpinner className="w-6 h-6 text-white" /> : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Gateway</h2>
                    <p className="text-xs text-gray-500">Booking #{booking?.id} reserved • 256-bit SSL encrypted</p>
                  </div>
                </div>
                <div className="flex items-center text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                  <Lock className="w-3.5 h-3.5 mr-1" />
                  <span>Secure Checkout</span>
                </div>
              </div>

              <div className="space-y-6">
                  {/* Payment Method Selector Tabs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gray-100 p-1.5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center justify-center py-2.5 rounded-lg text-xs font-bold transition ${
                        paymentMethod === 'card'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mr-1.5" />
                      Card (RuPay / Visa)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex items-center justify-center py-2.5 rounded-lg text-xs font-bold transition ${
                        paymentMethod === 'upi'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mr-1.5" />
                      UPI / GPay / PhonePe
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`flex items-center justify-center py-2.5 rounded-lg text-xs font-bold transition ${
                        paymentMethod === 'netbanking'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Building className="w-4 h-4 mr-1.5" />
                      NetBanking
                    </button>
                  </div>

                  {/* Tab 1: Card Form */}
                  {paymentMethod === 'card' && (
                    <form onSubmit={handleCompletePayment} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardDetails.cardNumber}
                            onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="4532 8912 3456 7890"
                            required
                          />
                          <div className="absolute right-3 top-3 flex space-x-1">
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">RuPay</span>
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">VISA</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="MM / YY"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">CVV / Security Code</label>
                          <input
                            type="password"
                            maxLength="4"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            placeholder="•••"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Name on Card</label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="Cardholder Name"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-primary-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
                      >
                        {isProcessingPayment ? (
                          <>
                            <LoadingSpinner className="w-5 h-5 text-white" />
                            <span>Processing ₹{total.toLocaleString('en-IN')}...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Pay ₹{total.toLocaleString('en-IN')} & Confirm</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Tab 2: UPI */}
                  {paymentMethod === 'upi' && (
                    <form onSubmit={handleCompletePayment} className="space-y-4 text-center">
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white p-2 rounded-2xl shadow-sm mb-3 flex items-center justify-center text-primary-600">
                          <QrCode className="w-12 h-12" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm">Scan QR Code or Enter UPI ID</h4>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs">
                          Supports Google Pay, PhonePe, Paytm, BHIM, and all Indian banking UPI apps.
                        </p>
                      </div>

                      <div className="text-left">
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Virtual Payment Address (VPA)</label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                          placeholder="username@okhdfcbank"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-primary-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {isProcessingPayment ? (
                          <>
                            <LoadingSpinner className="w-5 h-5 text-white" />
                            <span>Verifying UPI Mandate...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Pay ₹{total.toLocaleString('en-IN')} via UPI</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Tab 3: NetBanking */}
                  {paymentMethod === 'netbanking' && (
                    <form onSubmit={handleCompletePayment} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Select Your Bank</label>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => setSelectedBank(bank)}
                              className={`p-3 rounded-xl border text-xs font-semibold text-left transition ${
                                selectedBank === bank
                                  ? 'border-primary-600 bg-primary-50 text-primary-900 shadow-sm'
                                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessingPayment}
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-primary-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {isProcessingPayment ? (
                          <>
                            <LoadingSpinner className="w-5 h-5 text-white" />
                            <span>Connecting to {selectedBank}...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Pay ₹{total.toLocaleString('en-IN')} with {selectedBank}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b">Booking Summary</h2>
            
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-lg">{hotelName}</h3>
              <p className="text-sm text-gray-600 mt-0.5 font-medium">{roomType}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm space-y-2.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Check-in</span>
                <span className="font-semibold text-gray-900">{format(new Date(checkIn), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Check-out</span>
                <span className="font-semibold text-gray-900">{format(new Date(checkOut), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Guests</span>
                <span className="font-semibold text-gray-900">{guests} Guest(s)</span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">₹{pricePerNight.toLocaleString('en-IN')} x {nights} night(s)</span>
                <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST & Luxury Taxes (12%)</span>
                <span className="font-medium text-gray-900">₹{taxes.toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 mb-4">
              <span>Total Amount</span>
              <span className="text-primary-600">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div className="bg-primary-50/50 p-3 rounded-xl text-xs text-primary-800 space-y-1">
              <p className="font-semibold">✓ Free cancellation up to 48 hours</p>
              <p>✓ Instant email & SMS booking confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
