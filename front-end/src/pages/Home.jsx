import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/events/EventCard';
import { Film, Music, Smile, Trophy, Heart, Briefcase, ArrowRight, MapPin } from 'lucide-react';

const categoryButtons = [
  { name: 'Movies', slug: 'movies', icon: Film, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { name: 'Concerts', slug: 'concerts', icon: Music, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { name: 'Comedy', slug: 'comedy', icon: Smile, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { name: 'Sports', slug: 'sports', icon: Trophy, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { name: 'Kids', slug: 'kids', icon: Heart, color: 'text-pink-600 bg-pink-50 border-pink-200' },
  { name: 'Workshops', slug: 'workshops', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
];

const Home = () => {
  const { selectedCity } = useAuth();
  const navigate = useNavigate();

  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [cityEvents, setCityEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeEvents();
  }, [selectedCity]);

  const fetchHomeEvents = async () => {
    try {
      setLoading(true);
      const [featRes, cityRes] = await Promise.all([
        API.get('/events', { params: { isFeatured: true, city: selectedCity } }),
        API.get('/events', { params: { city: selectedCity } }),
      ]);

      const cityEvs = cityRes.data || [];
      const featEvs = featRes.data || [];

      // If no featured events exist for this specific city, display top city events
      const displayFeatured = featEvs.length > 0 ? featEvs : cityEvs;

      setFeaturedEvents(displayFeatured);
      setCityEvents(cityEvs);
    } catch (err) {
      console.error('Failed to load home events:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Featured Banner Row / Hero */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase text-red-600 tracking-wider">
                Trending in {selectedCity}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Recommended Movies & Live Shows
              </h1>
            </div>

            <Link
              to={`/events?city=${encodeURIComponent(selectedCity)}`}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              See All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Featured Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 rounded-lg bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
              No shows currently featured in {selectedCity}. Check out all events below!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredEvents.slice(0, 4).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Icons Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categoryButtons.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.slug}
                onClick={() => navigate(`/events?category=${cat.slug}&city=${encodeURIComponent(selectedCity)}`)}
                className={`p-3.5 rounded-lg border text-center flex flex-col items-center gap-2 hover:shadow-sm transition-all ${cat.color}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-bold">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Events in Selected City */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-extrabold text-slate-900">Events in {selectedCity}</h2>
          </div>
          <Link to={`/events?city=${encodeURIComponent(selectedCity)}`} className="text-xs font-bold text-red-600 hover:text-red-700">
            View All ({cityEvents.length})
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-lg bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : cityEvents.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-slate-200 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700">No events currently scheduled in {selectedCity}</p>
            <p className="text-xs text-slate-500">Try changing your city in the top bar to explore shows in other cities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cityEvents.slice(0, 6).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
