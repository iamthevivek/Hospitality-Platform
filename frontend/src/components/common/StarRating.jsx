import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, className = "w-4 h-4" }) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`${className} ${rating >= star ? 'text-accent-400 fill-accent-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
}
