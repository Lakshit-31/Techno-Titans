import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/events/EventCard';
import { Search, Filter, RefreshCw, MapPin, Tag } from 'lucide-react';

const categoriesList = [
  { label: 'All Categories', value: '' },
  { label: 'Movies', value: 'movies' },
  { label: 'Concerts', value: 'concerts' },
  { label: 'Comedy', value: 'comedy' },
  { label: 'Sports', value: 'sports' },
  { label: 'Kids', value: 'kids' },
  { label: 'Workshops', value: 'workshops' },
];

const SearchListing = () => {
  const { selectedCity, setSelectedCity } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [citiesList, setCitiesList] = useState(['All Cities']);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [city, setCity] = useState(searchParams.get('city') || selectedCity || '');

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    const urlCity = searchParams.get('city');
    if (urlCity) {
      setCity(urlCity);
    } else if (selectedCity) {
      setCity(selectedCity);
    }
  }, [searchParams, selectedCity]);

  useEffect(() => {
    fetchFilteredEvents();
  }, [searchParams, selectedCity]);

  const fetchCities = async () => {
    try {
      const res = await API.get('/cities');
      const names = res.data.map((c) => c.name);
      setCitiesList(['All Cities', ...names]);
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    }
  };

  const fetchFilteredEvents = async () => {
    try {
      setLoading(true);

      const params = {};
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (searchParams.get('category')) params.category = searchParams.get('category');
      
      const effectiveCity = searchParams.get('city') || selectedCity;
      if (effectiveCity && effectiveCity !== 'All Cities') {
        params.city = effectiveCity;
      }

      const res = await API.get('/events', { params });
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const newParams = {};
    if (search.trim()) newParams.search = search.trim();
    if (category) newParams.category = category;
    if (city && city !== 'All Cities') {
      newParams.city = city;
      setSelectedCity(city);
    }

    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setCity('All Cities');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Explore Events & Movies</h1>
        <p className="text-xs text-slate-500">Filter by category, city, or search keywords</p>
      </div>

      {/* Filter Toolbar Box */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Keyword Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies, concerts..."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-1.5 pl-9 pr-3 text-xs outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-1.5 pl-9 pr-3 text-xs outline-none appearance-none"
            >
              {categoriesList.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* City Dropdown */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-1.5 pl-9 pr-3 text-xs outline-none appearance-none"
            >
              {citiesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs text-slate-600">
            Showing <strong className="text-slate-900">{events.length}</strong> results {city && city !== 'All Cities' && <span>in <strong className="text-red-600">{city}</strong></span>}
          </span>

          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-lg bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg border border-slate-200 space-y-3">
          <Filter className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Events Match Your Filters</h3>
          <p className="text-xs text-slate-500">Try changing your search terms or selecting a different city.</p>
          <button
            onClick={resetFilters}
            className="px-4 py-1.5 rounded bg-red-600 text-white text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchListing;
