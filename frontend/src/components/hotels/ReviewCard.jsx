import React from 'react';
import StarRating from '../common/StarRating';
import { format } from 'date-fns';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
            {review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.reviewerName || 'Anonymous'}</h4>
            <p className="text-xs text-gray-500">
              {review.createdAt ? format(new Date(review.createdAt), 'MMM d, yyyy') : 'Recently'}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
}
