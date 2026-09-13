import React, { useState } from 'react';
import { Briefcase, MapPin, Heart, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const OPEN_ROLES = [
  {
    id: 'fs-eng',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Bengaluru (Hybrid)',
    type: 'Full-time',
    description: 'Lead high-scale development of StayEase core booking engine with React 18, Spring Boot 3, and real-time payment integrations.'
  },
  {
    id: 'product-designer',
    title: 'Lead Product Designer (UI/UX)',
    department: 'Design',
    location: 'Mumbai (Hybrid)',
    type: 'Full-time',
    description: 'Craft world-class digital hospitality interfaces, design systems, and mobile guest journeys for luxury palatial & boutique stays.'
  },
  {
    id: 'ai-nlp-eng',
    title: 'AI & NLP Travel Assistant Engineer',
    department: 'Artificial Intelligence',
    location: 'Bengaluru / Remote',
    type: 'Full-time',
    description: 'Build and fine-tune intelligent travel assistant models, real-time hotel recommendation pipelines, and guest assistance systems.'
  },
  {
    id: 'hotel-partnerships',
    title: 'Director of Luxury Hotel Partnerships',
    department: 'Business & Operations',
    location: 'Mumbai / New Delhi',
    type: 'Full-time',
    description: 'Expand and nurture our exclusive portfolio of heritage palaces, 5-star chains (Taj, Oberoi, Leela), and boutique luxury villas across India.'
  },
  {
    id: 'guest-relations-lead',
    title: 'VIP Guest Relations & Hospitality Lead',
    department: 'Hospitality Experience',
    location: 'Mumbai (On-site)',
    type: 'Full-time',
    description: 'Deliver bespoke guest itineraries, handle high-profile customer care, and orchestrate memorable stays for our top-tier members.'
  }
];

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleApply = (roleTitle) => {
    toast.success(`Application initiated for "${roleTitle}". Please forward your resume to careers@stayease.in!`);
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-4 tracking-wider uppercase">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> We're Hiring!
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Build the Future of Indian Luxury Travel
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Join our mission to revolutionize how travelers discover, book, and experience India’s finest heritage palaces and global 5-star destinations.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-50 p-8 rounded-2xl border border-gray-200">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">₹1,00,000 Travel Stipend</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every team member receives an annual travel credit to experience and review partner luxury properties across Rajasthan, Goa, and beyond.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border border-gray-200">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Comprehensive Health Care</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Top-tier health and medical insurance covering you and your family, mental wellness credits, and annual executive health checkups.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Hybrid & Flexible Culture</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Work from our modern offices in Nariman Point (Mumbai) or MG Road (Bengaluru), or collaborate remotely with flexible working hours.
            </p>
          </div>
        </div>

        {/* Open Roles Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-200 gap-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Current Openings</h2>
              <p className="text-sm text-gray-500">Explore open opportunities across engineering, product, and hospitality.</p>
            </div>
            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full self-start sm:self-auto">
              {OPEN_ROLES.length} Open Positions
            </span>
          </div>

          <div className="space-y-4">
            {OPEN_ROLES.map((role) => (
              <div
                key={role.id}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm hover:border-primary-300 hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-md">
                      {role.department}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {role.location}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                  <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">{role.description}</p>
                </div>

                <button
                  onClick={() => handleApply(role.title)}
                  className="inline-flex items-center px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-sm transition flex-shrink-0"
                >
                  Apply Now <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* General Application Note */}
        <div className="mt-16 bg-slate-900 text-white p-8 rounded-2xl text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-bold mb-2">Don't see the right role?</h3>
          <p className="text-sm text-gray-300 mb-4">
            We are always eager to meet passionate engineers, hospitality specialists, and designers. Send your resume to{' '}
            <span className="text-primary-400 font-semibold">careers@stayease.in</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
