import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCcw, CheckCircle2, AlertCircle, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CancellationPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-center space-x-3 text-primary-600 mb-3">
            <RefreshCcw className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
              Guest Friendly
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Clear, transparent refund tiers for all hotel and palace reservations on StayEase.
          </p>
        </div>

        {/* Visual Timeline / Tiers */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Standard Refund Windows</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold mb-4">
                100%
              </div>
              <h3 className="font-bold text-emerald-950 text-base mb-1">Free Cancellation</h3>
              <p className="text-xs text-emerald-700 font-semibold mb-3">48+ Hours Before Check-in</p>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Full 100% refund of room tariff and GST. Zero cancellation fee deducted.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold mb-4">
                50%
              </div>
              <h3 className="font-bold text-amber-950 text-base mb-1">Partial Refund</h3>
              <p className="text-xs text-amber-700 font-semibold mb-3">24 to 48 Hours Before</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                50% refund credited back to your original payment method. 50% retained for room hold.
              </p>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl">
              <div className="w-10 h-10 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center font-bold mb-4">
                0%
              </div>
              <h3 className="font-bold text-rose-950 text-base mb-1">Non-Refundable</h3>
              <p className="text-xs text-rose-700 font-semibold mb-3">Under 24 Hours / No-Show</p>
              <p className="text-xs text-rose-800 leading-relaxed">
                Non-refundable as the property room is held and cannot be reallocated on short notice.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">How Refunds Are Credited</h2>
            <p className="mb-3">
              Refunds are automatically routed back to your original mode of payment in Indian Rupees (₹ INR):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-bold text-gray-900 mb-1">UPI (GPay / PhonePe / Paytm)</p>
                <p className="text-gray-500">Instant to 24 hours</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-bold text-gray-900 mb-1">RuPay / Debit Cards / NetBanking</p>
                <p className="text-gray-500">2 to 4 business days</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-bold text-gray-900 mb-1">Credit Cards (Visa / Mastercard)</p>
                <p className="text-gray-500">3 to 5 business days</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">How to Cancel a Booking</h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
              <li>Log in to your StayEase account and open your <strong>Dashboard</strong>.</li>
              <li>Locate your upcoming booking under the <strong>Upcoming Stays</strong> tab.</li>
              <li>Click the <strong>Cancel Booking</strong> button.</li>
              <li>Review the calculated refund amount and confirm. The cancellation will be processed instantly.</li>
            </ol>
          </section>

          <section className="bg-slate-50 p-6 rounded-2xl border border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-2">Emergency Medical or Force Majeure Waivers</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              In cases of certified medical emergencies, government travel bans, or severe flight cancellations, our guest support team can coordinate with the property general manager to request special credit vouchers or date adjustments. Please contact our 24/7 support desk at <span className="font-semibold text-primary-600">support@stayease.in</span> or call <span className="font-semibold text-primary-600">+91 (022) 4982-3000</span>.
            </p>
          </section>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm shadow-md transition"
            >
              Go to My Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
