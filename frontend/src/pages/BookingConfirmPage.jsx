import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Home, ArrowRight, Loader2 } from 'lucide-react';

export default function BookingConfirmPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const paymentIntent = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    if (redirectStatus === 'succeeded') {
      setStatus('success');
    } else if (redirectStatus === 'failed') {
      setStatus('failed');
    } else {
      setStatus('success'); // Default to success for demo
    }
  }, [redirectStatus]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <p className="text-gray-600 text-lg">Confirming your booking...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">❌</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          Your payment could not be processed. Please try again.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          <Home className="h-5 w-5" />
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Success Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Animated Check */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="h-14 w-14 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Booking Confirmed! 🎉</h1>
        <p className="text-gray-600 text-lg mb-2">
          Your reservation has been successfully confirmed.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          A confirmation email will be sent to your registered email address.
        </p>

        {paymentIntent && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              Payment Reference
            </p>
            <p className="font-mono text-sm text-gray-700 break-all">{paymentIntent}</p>
          </div>
        )}

        {/* What's Next */}
        <div className="bg-indigo-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-indigo-900 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-indigo-800">
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">✓</span>
              Check your email for a confirmation with all booking details
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">✓</span>
              Present your booking ID at check-in
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">✓</span>
              Standard check-in is 3:00 PM, check-out is 11:00 AM
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">✓</span>
              Contact the hotel directly for early check-in requests
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Calendar className="h-5 w-5" />
            View My Bookings
          </Link>
          <Link
            to="/hotels"
            className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 border-2 border-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
          >
            Browse More Hotels
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Support */}
      <p className="text-center text-gray-500 text-sm mt-6">
        Need help?{' '}
        <a href="mailto:support@stayease.com" className="text-indigo-600 hover:underline">
          Contact support
        </a>
      </p>
    </div>
  );
}
