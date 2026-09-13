import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Booking Inquiry',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast.success('Thank you! Our support team will contact you within 15 minutes.');
    setFormData({ name: '', email: '', phone: '', category: 'Booking Inquiry', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 mb-4">
            <MessageSquare className="w-3.5 h-3.5" /> 24/7 Dedicated Support
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            We're Here to Help
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Have questions about a luxury stay, need corporate group bookings, or need assistance with your reservation? Our Mumbai and Bengaluru guest support teams are available around the clock.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Phone & WhatsApp</h3>
              <p className="text-sm text-gray-500 mb-3">Instant assistance 24/7</p>
              <p className="text-base font-semibold text-primary-600">+91 (022) 4982-3000</p>
              <p className="text-sm font-medium text-gray-700 mt-1">+91 98201 12345 (Priority Support)</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Email Us</h3>
              <p className="text-sm text-gray-500 mb-3">Average response time: &lt; 15 mins</p>
              <p className="text-base font-semibold text-primary-600">support@stayease.in</p>
              <p className="text-sm font-medium text-gray-700 mt-1">help@stayease.in</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Our Offices</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                <strong>Mumbai HQ:</strong> Level 14, Maker Chambers IV, Nariman Point, Mumbai 400021
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Bengaluru Hub:</strong> 4th Floor, Prestige Meridian, MG Road, Bengaluru 560001
              </p>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-sm text-gray-500 mb-8">
              Fill in the details below and our dedicated guest care executive will connect with you right away.
            </p>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center text-green-800 text-sm">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
                <span>Your message has been sent successfully. Check your email or phone for our prompt reply.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikramaditya Rathore"
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="vikram@example.com"
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Inquiry Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                  >
                    <option value="Booking Inquiry">Booking Inquiry</option>
                    <option value="Special Heritage / Palace Request">Special Heritage / Palace Request</option>
                    <option value="Corporate / Group Stay">Corporate / Group Stay</option>
                    <option value="Cancellation / Refund Support">Cancellation / Refund Support</option>
                    <option value="Partner Hotel Onboarding">Partner Hotel Onboarding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Message</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our support team assist you today?"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-primary-600/20 transition flex items-center justify-center space-x-2 text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
