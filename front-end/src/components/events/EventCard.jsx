import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Star } from 'lucide-react';

const EventCard = ({ event }) => {
  const categoryName = event.category?.name || 'Event';

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200">
      {/* Cover Banner Image */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'}
          alt={event.title}
          className="w-full h-full object-cover"
        />

        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
          {categoryName}
        </span>

        {event.isFeatured && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold uppercase">
            FEATURED
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{event.language || 'English'}</span>
            <span>{event.durationMinutes ? `${event.durationMinutes} mins` : ''}</span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-red-600 transition-colors">
            {event.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-snug">
            {event.description}
          </p>
        </div>

        {/* Venue & Action Footer */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>

          <Link
            to={`/events/${event._id}`}
            className="w-full py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold text-center block transition-colors shadow-xs"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
