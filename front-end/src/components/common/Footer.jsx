import React from 'react';
import { Ticket, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white font-bold">
                <Ticket className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white">EventHub</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Book tickets for Movies, Standup Comedy, Music Concerts, Sports, and Workshops near you with instant confirmation.
            </p>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold uppercase text-[11px] mb-3 tracking-wider">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/events?category=movies" className="hover:text-white">Movies</Link></li>
              <li><Link to="/events?category=concerts" className="hover:text-white">Concerts & Live</Link></li>
              <li><Link to="/events?category=comedy" className="hover:text-white">Standup Comedy</Link></li>
              <li><Link to="/events?category=sports" className="hover:text-white">Sports & Games</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold uppercase text-[11px] mb-3 tracking-wider">Account & Roles</h4>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-white">Customer Login</Link></li>
              <li><Link to="/register" className="hover:text-white">Register as Organiser</Link></li>
              <li><Link to="/profile" className="hover:text-white">My Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-200 font-bold uppercase text-[11px] mb-3 tracking-wider">Developer & API</h4>
            <a
              href="http://localhost:5000/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-red-500" /> Swagger OpenAPI Docs (/api/docs)
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-slate-500 text-[11px] flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 EventHub Ticketing Platform. All rights reserved.</p>
          <p>Local MongoDB: mongodb://localhost:27017/eventhub</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
