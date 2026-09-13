import React from 'react';
import { Shield, Lock, FileText, CheckCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-center space-x-3 text-primary-600 mb-3">
            <Shield className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
              Legal & Compliance
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: January 2026 • Compliant with Digital Personal Data Protection Act (DPDPA 2023)
          </p>
        </div>

        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Overview and Scope</h2>
            <p>
              StayEase Hospitality Pvt. Ltd. ("StayEase", "we", "our", or "us") is dedicated to protecting the privacy of travelers using our platform. This Privacy Policy details how we collect, store, utilize, and protect your personal information when you access our web application, explore hotels, and make reservations across India and internationally.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="mb-2">When using StayEase, we may collect the following categories of information:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li><strong>Personal Identifiers:</strong> Name, email address, telephone/mobile number, and billing address.</li>
              <li><strong>Government Identification Data:</strong> Mandatory identity verification details required by Indian law (Aadhaar, Passport, or Voter ID for hotel guest registries).</li>
              <li><strong>Booking & Stay Preferences:</strong> Check-in/out dates, guest counts, room preferences, and special dietary or accessibility requests.</li>
              <li><strong>Payment Transaction Identifiers:</strong> Bank transaction references, UPI VPAs, and tokenized payment IDs (we do not store raw credit card CVVs or banking passwords).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. How We Use Your Data</h2>
            <p className="mb-2">We process personal data solely for legitimate business and contractual purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Confirming, managing, and servicing your hotel reservations with partner properties.</li>
              <li>Facilitating secure online payments in Indian Rupees (₹) via authorized payment gateways.</li>
              <li>Providing 24/7 Travel Assistant customer care and real-time travel notifications.</li>
              <li>Meeting regulatory compliance and hotel guest recording directives under Indian local municipal and tourism laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Payment Security & RBI Compliance</h2>
            <p>
              All online payment transactions on StayEase are encrypted using 256-bit SSL protocols and processed through PCI-DSS Level 1 certified gateways. In accordance with Reserve Bank of India (RBI) tokenization guidelines, your card details are saved solely in tokenized formats. We never retain your card verification value (CVV) or UPI PIN on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Data Sharing with Partner Hotels</h2>
            <p>
              To honor your reservation, we share only necessary guest information (primary guest name, contact number, email, check-in dates, and special requests) with the hotel or resort you have booked. Partner hotels are bound by confidentiality obligations and may not use your information for unauthorized marketing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Your Rights and Choices</h2>
            <p>
              Under the Digital Personal Data Protection Act (DPDPA 2023), you retain the right to review, update, or request deletion of your account data. You may export your booking history or request account erasure by contacting our Grievance Officer.
            </p>
          </section>

          <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-2">7. Grievance Officer Contact</h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              In accordance with the Information Technology Act 2000 and rules made thereunder, the name and contact details of our Grievance Officer are:
              <br /><br />
              <strong>Name:</strong> Mr. Rajesh Sharma<br />
              <strong>Designation:</strong> Head of Trust & Compliance<br />
              <strong>Address:</strong> Level 14, Maker Chambers IV, Nariman Point, Mumbai 400021, India<br />
              <strong>Email:</strong> grievance@stayease.in • <strong>Phone:</strong> +91 (022) 4982-3010
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
