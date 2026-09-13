import React from 'react';
import { Scale, FileText, CheckSquare, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-center space-x-3 text-primary-600 mb-3">
            <Scale className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
              Legal Agreement
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: January 2026 • Governing laws of India
          </p>
        </div>

        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing the website, mobile services, or reservation systems of StayEase Hospitality Pvt. Ltd. ("StayEase"), you agree to be bound by these Terms of Service. If you do not accept these terms, you must refrain from making bookings or using our platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. User Eligibility & Accounts</h2>
            <p>
              You must be at least 18 years of age to establish an account and enter into binding reservation contracts on StayEase. You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your profile.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Reservations & Booking Contract</h2>
            <p>
              When you submit a booking request and complete payment, you enter into a legally binding accommodation contract directly with the respective hotel or resort. StayEase acts as a authorized hospitality technology platform facilitating the booking and payment collection.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Pricing, Indian Taxes & Currency (₹)</h2>
            <p>
              All room tariffs and fees displayed on StayEase are denominated in Indian Rupees (₹ INR) unless explicitly toggled otherwise. Prices include applicable Goods and Services Tax (GST) as specified during checkout. You agree to pay all charges incurred under your account using authorized payment instruments (UPI, Credit/Debit cards, or NetBanking).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Check-in Requirements & House Rules</h2>
            <p>
              All guests must comply with the individual house rules, check-in/check-out policies, and security regulations of the booked property. Valid government photo identification (Aadhaar, Passport, Driving License) is mandatory for all adult guests at the time of arrival. Hotels reserve the right to deny check-in to guests failing to provide required IDs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Cancellations, Refunds & Modifications</h2>
            <p>
              Cancellations and refunds are governed strictly by the StayEase Cancellation Policy. Bookings cancelled 48 hours or more prior to the scheduled check-in date are eligible for a full 100% refund. Cancellations made between 24 and 48 hours receive a 50% refund, while cancellations within 24 hours of arrival are non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
            <p>
              StayEase is not liable for indirect, incidental, or punitive damages resulting from property amenities, third-party hotel service deficiencies, or unforeseen force majeure events (natural calamities, transport strikes, or civil disturbances). In all events, StayEase's aggregate liability is limited to the total booking amount received for the reservation in question.
            </p>
          </section>

          <section className="bg-slate-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-2">8. Governing Law & Jurisdiction</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              These Terms of Service are governed by and construed in accordance with the laws of the Republic of India. Any legal dispute, controversy, or claim arising out of or relating to these terms or bookings made through StayEase shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
