import React from 'react';
import { Link } from 'react-router-dom';
import { MdStar, MdLocationOn } from 'react-icons/md';

const RestaurantCard = ({ restaurant }) => {
  const { id, name, imageUrl, cuisineType, rating, isOpen, address } = restaurant;

  return (
    <Link 
      to={`/restaurant/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60'} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Open/Closed status badge */}
        <span className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm ${
          isOpen ? 'bg-emerald-500' : 'bg-rose-500'
        }`}>
          {isOpen ? 'Open Now' : 'Closed'}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-lg font-bold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 rounded-md bg-amber-50 px-2 py-0.5 text-sm font-bold text-amber-600">
            <MdStar size={16} />
            <span>{rating?.toFixed(1) || '4.5'}</span>
          </div>
        </div>

        <p className="text-xs font-medium text-slate-400 capitalize mb-4">
          {cuisineType || 'Fast Food, Indian'}
        </p>

        <div className="mt-auto flex items-center gap-1 text-xs text-slate-500">
          <MdLocationOn className="shrink-0 text-slate-400" size={14} />
          <span className="line-clamp-1">{address || 'No Address Provided'}</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
