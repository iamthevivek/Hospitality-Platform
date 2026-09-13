import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Search, ChevronDown, ChevronUp, CreditCard, Calendar, ShieldCheck, RefreshCcw, PhoneCall } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'bookings',
    title: 'Bookings & Reservations',
    icon: Calendar,
    faqs: [
      {
        q: 'How do I book a hotel on StayEase?',
        a: 'Simply select your desired destination, check-in and check-out dates, and number of guests. Choose your preferred room, enter your guest details, and complete payment via UPI, RuPay, Visa, Mastercard, or NetBanking. You will receive an instant confirmed booking.'
      },
      {
        q: 'Can I request early check-in or late check-out?',
        a: 'Yes, you can specify your arrival and departure requests in the "Special Requests" box during checkout or message our 24/7 guest support team. While subject to room availability, luxury partner hotels make every effort to accommodate early arrivals.'
      },
      {
        q: 'Where can I find my active bookings and invoice?',
        a: 'Navigate to your Dashboard anytime by clicking "Dashboard" in the top navigation bar. You can view all upcoming, past, and cancelled stays, along with payment receipts in Indian Rupees (₹).'
      }
    ]
  },
  {
    id: 'payments',
    title: 'Payments & Pricing in ₹ INR',
    icon: CreditCard,
    faqs: [
      {
        q: 'What payment methods are supported?',
        a: 'StayEase supports all primary Indian and international payment methods: UPI (Google Pay, PhonePe, Paytm, BHIM, Cred), RuPay cards, Visa, Mastercard, and NetBanking across all major Indian banks (HDFC, ICICI, SBI, Axis, Kotak).'
      },
      {
        q: 'Are the prices inclusive of GST and taxes?',
        a: 'Yes! All prices are displayed in Indian Rupees (₹). The order summary itemizes room charges and the applicable Goods and Services Tax (12% to 18% as per Government of India hospitality tax brackets). There are zero hidden fees.'
      },
      {
        q: 'Is my payment transaction secure?',
        a: 'Absolutely. All transactions are protected by 256-bit bank-grade SSL encryption and processed in strict adherence to RBI (Reserve Bank of India) guidelines and PCI-DSS Level 1 security standards.'
      }
    ]
  },
  {
    id: 'checkin',
    title: 'Check-in & Stay Policies',
    icon: ShieldCheck,
    faqs: [
      {
        q: 'What government photo ID is required for hotel check-in in India?',
        a: 'In accordance with Government of India regulations, all adult guests must present a valid government-issued photo ID at check-in (Aadhaar Card, Passport, Driving License, or Voter ID). Please note that PAN cards are not accepted as valid proof of address by Indian hotels.'
      },
      {
        q: 'What are standard check-in and check-out times?',
        a: 'Standard check-in is usually at 2:00 PM and check-out is at 11:00 AM or 12:00 PM noon. If you require alternate timings, please contact our guest support team.'
      }
    ]
  },
  {
    id: 'cancellations',
    title: 'Cancellations & Refunds',
    icon: RefreshCcw,
    faqs: [
      {
        q: 'How does the cancellation policy work?',
        a: 'Stays cancelled at least 48 hours before the scheduled check-in date are eligible for a 100% full refund with zero cancellation charges. Cancellations between 24 and 48 hours receive a 50% refund. Stays cancelled under 24 hours are non-refundable.'
      },
      {
        q: 'How long do refunds take to reflect in my bank account?',
        a: 'UPI refunds are processed within instant to 24 hours. NetBanking, RuPay, and Debit card refunds typically take 2 to 4 business days. Credit card refunds reflect within 3 to 5 business days.'
      }
    ]
  }
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = FAQ_CATEGORIES.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq => faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
             faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> Help Center & Knowledge Base
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Find quick answers regarding reservations, UPI & card payments, check-in IDs, and cancellation policies.
          </p>

          {/* Search Input */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers (e.g., refund, check-in ID, UPI)..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        {/* Categories & Accordions */}
        <div className="space-y-10">
          {filteredCategories.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
              <p className="text-gray-500 text-sm mb-4">No matching questions found for "{searchQuery}".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary-600 font-semibold text-sm hover:underline"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredCategories.map((category, catIdx) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIdx) => {
                      const key = `${catIdx}-${faqIdx}`;
                      const isOpen = openItems[key];
                      return (
                        <div key={faqIdx} className="border border-gray-100 rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleItem(catIdx, faqIdx)}
                            className="w-full text-left p-4 sm:p-5 flex justify-between items-center bg-gray-50 hover:bg-gray-100/70 transition"
                          >
                            <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{faq.q}</span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="p-4 sm:p-5 bg-white text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support Banner */}
        <div className="mt-12 bg-slate-900 text-white p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Still have questions?</h3>
            <p className="text-sm text-gray-300">Our guest support team is available 24/7 via phone or message.</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-md transition flex-shrink-0"
          >
            <PhoneCall className="w-4 h-4 mr-2" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
