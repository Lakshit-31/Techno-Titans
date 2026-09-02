import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/events?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="w-full">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and Search */}
            <div className="flex items-center flex-1">
              <Link to="/" className="text-2xl font-extrabold tracking-tight" style={{color: '#f84464'}}>
                EventHub
              </Link>
              <div className="hidden sm:block ml-8 flex-1 max-w-2xl">
                <form onSubmit={handleSearch} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#f84464] focus:border-[#f84464] sm:text-sm"
                    placeholder="Search for Movies, Events, Plays, Sports and Activities"
                  />
                </form>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-6 ml-6">
              <div className="hidden md:flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer">
                Mumbai <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </div>
              {!user ? (
                <Link to="/login" className="bg-[#f84464] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-red-600 transition-colors">
                  Sign in
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700 font-medium">Hi, {user.name.split(' ')[0]}</span>
                  {user.role === "event_manager" ? (
                    <Link to="/manager/dashboard" className="text-sm font-medium text-[#f84464] hover:text-red-700">Dashboard</Link>
                  ) : (
                    <Link to="/user/dashboard" className="text-sm font-medium text-[#f84464] hover:text-red-700">Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-gray-900">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Navbar */}
      <div className="bg-[#222539] hidden md:block text-gray-300 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-10 items-center">
            <div className="flex space-x-6">
              <Link to="/events" className="hover:text-white transition-colors">Movies</Link>
              <Link to="/events" className="hover:text-white transition-colors">Stream</Link>
              <Link to="/events" className="hover:text-white transition-colors">Events</Link>
              <Link to="/events" className="hover:text-white transition-colors">Plays</Link>
              <Link to="/events" className="hover:text-white transition-colors">Sports</Link>
              <Link to="/events" className="hover:text-white transition-colors">Activities</Link>
            </div>
            <div className="flex space-x-6 text-xs">
              <Link to="/" className="hover:text-white transition-colors">ListYourShow</Link>
              <Link to="/" className="hover:text-white transition-colors">Corporates</Link>
              <Link to="/" className="hover:text-white transition-colors">Offers</Link>
              <Link to="/" className="hover:text-white transition-colors">Gift Cards</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
