import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { Ticket, Search, MapPin, User, LogOut, ChevronDown, ShieldCheck, Briefcase, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, selectedCity, setSelectedCity } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCityModal, setShowCityModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Dynamic Cities State
  const [citiesList, setCitiesList] = useState([]);
  const [citySearchInput, setCitySearchInput] = useState('');
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoadingCities(true);
      const res = await API.get('/cities');
      setCitiesList(res.data);
    } catch (err) {
      console.error('Failed to load cities:', err);
      // Fallback list if API fails
      setCitiesList([
        { name: 'Mumbai', slug: 'mumbai' },
        { name: 'Delhi', slug: 'delhi' },
        { name: 'Bengaluru', slug: 'bengaluru' },
        { name: 'Hyderabad', slug: 'hyderabad' },
        { name: 'Chennai', slug: 'chennai' },
        { name: 'Pune', slug: 'pune' },
        { name: 'Kolkata', slug: 'kolkata' },
        { name: 'Ahmedabad', slug: 'ahmedabad' },
        { name: 'Jaipur', slug: 'jaipur' },
        { name: 'Udaipur', slug: 'udaipur' },
      ]);
    } finally {
      setLoadingCities(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Live filter cities based on user search input
  const filteredCities = citiesList.filter((city) =>
    city.name.toLowerCase().includes(citySearchInput.trim().toLowerCase())
  );

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm">
            <Ticket className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            Event<span className="text-red-600">Hub</span>
          </span>
        </Link>

        {/* Central Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Movies, Concerts, Standup Comedy, Sports..."
              className="w-full bg-slate-100 border border-slate-200 focus:bg-white focus:border-red-500 rounded-md py-2 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all"
            />
          </div>
        </form>

        {/* Right Action Items */}
        <div className="flex items-center gap-4 shrink-0">
          {/* City Selector Button */}
          <button
            onClick={() => {
              setCitySearchInput('');
              setShowCityModal(true);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-slate-200/70 px-3 py-1.5 rounded-md border border-slate-200 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* User Menu / Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                  {user.name}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : user.role === 'ORGANISER'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {user.role}
                </span>
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1.5 text-xs z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600"
                  >
                    <User className="w-4 h-4 text-slate-400" /> Profile & Booking History
                  </Link>

                  {user.role === 'ORGANISER' && (
                    <Link
                      to="/dashboard/organizer"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600"
                    >
                      <Briefcase className="w-4 h-4 text-slate-400" /> Organiser Dashboard
                    </Link>
                  )}

                  {user.role === 'ADMIN' && (
                    <Link
                      to="/dashboard/admin"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-400" /> Admin Control Center
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                      navigate('/login');
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 border-t border-slate-100 font-semibold"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Category Links Sub-bar */}
      <div className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between overflow-x-auto gap-6 whitespace-nowrap">
          <div className="flex items-center gap-6">
            <Link to={`/events?category=movies&city=${encodeURIComponent(selectedCity)}`} className="hover:text-white transition-colors">Movies</Link>
            <Link to={`/events?category=concerts&city=${encodeURIComponent(selectedCity)}`} className="hover:text-white transition-colors">Concerts</Link>
            <Link to={`/events?category=comedy&city=${encodeURIComponent(selectedCity)}`} className="hover:text-white transition-colors">Comedy</Link>
            <Link to={`/events?category=sports&city=${encodeURIComponent(selectedCity)}`} className="hover:text-white transition-colors">Sports</Link>
            <Link to={`/events?category=kids&city=${encodeURIComponent(selectedCity)}`} className="hover:text-white transition-colors">Kids</Link>
            <Link to={`/events?category=workshops&city=${encodeURIComponent(selectedCity)}`} className="hover:text-white transition-colors">Workshops</Link>
          </div>

          <Link to={`/events?city=${encodeURIComponent(selectedCity)}`} className="text-red-400 hover:text-red-300 font-medium text-[11px]">
            Browse All Events →
          </Link>
        </div>
      </div>

      {/* Searchable City Selector Modal */}
      {showCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" /> Select Your City
              </h3>
              <button
                onClick={() => setShowCityModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                autoFocus
                value={citySearchInput}
                onChange={(e) => setCitySearchInput(e.target.value)}
                placeholder="Type to search city (e.g. Mumbai, Jaipur)..."
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded-md py-2 pl-9 pr-3 text-xs text-slate-800 outline-none"
              />
            </div>

            {/* Cities List */}
            <div className="overflow-y-auto flex-1 max-h-64 space-y-1.5 pr-1">
              {loadingCities ? (
                <p className="text-xs text-slate-400 text-center py-4">Loading cities...</p>
              ) : filteredCities.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No matching cities found</p>
              ) : (
                filteredCities.map((c) => {
                  const isSelected = selectedCity === c.name;
                  return (
                    <button
                      key={c._id || c.name}
                      onClick={() => {
                        setSelectedCity(c.name);
                        setShowCityModal(false);
                      }}
                      className={`w-full p-2.5 rounded-md text-left text-xs font-semibold border flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-red-50 border-red-500 text-red-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        📍 {c.name}
                      </span>
                      {isSelected && <span className="text-[10px] font-bold uppercase text-red-600">Selected</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
