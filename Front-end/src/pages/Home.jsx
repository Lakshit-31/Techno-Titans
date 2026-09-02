import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EventCarousel from "../components/EventCarousel";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/events")
      .then(res => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading events...</div>;
  if (events.length === 0) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900">No events found</h2>
      <p className="text-gray-500 mt-2">Check back later for exciting new events!</p>
    </div>
  );

  // Group events by category dynamically
  const eventsByCategory = events.reduce((acc, event) => {
    const cat = event.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(event);
    return acc;
  }, {});

  const categories = Object.keys(eventsByCategory);

  // Take the first up to 5 events for the main top banner
  const bannerEvents = events.slice(0, 5);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Main Top Banner (BookMyShow style) */}
      <div className="w-full bg-gray-200">
        <div className="max-w-7xl mx-auto flex overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-4 sm:px-6 lg:px-8 space-x-4">
          {bannerEvents.map((event) => (
            <Link key={`banner-${event._id}`} to={`/events/${event._id}`} className="flex-none w-[85vw] md:w-[60vw] lg:w-[40vw] snap-center shrink-0">
              <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden bg-gray-300">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-xl md:text-2xl font-bold truncate">{event.title}</h2>
                  <p className="text-sm md:text-base opacity-90 truncate">{event.category} • {event.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Dynamic Category Rows */}
      {categories.map((category, index) => {
        // Make the second category dark themed (Premiere style) just to mimic the visual UI
        const isDarkSection = index === 1;
        const showPremiereTag = isDarkSection;
        
        return (
          <EventCarousel 
            key={category} 
            title={`Recommended ${category}`} 
            events={eventsByCategory[category]} 
            isDark={isDarkSection}
            showTag={showPremiereTag}
          />
        );
      })}

      {/* Promotional Banner Middle */}
      {events.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
          <Link to="/events" className="block w-full">
            <div className="w-full h-24 md:h-32 bg-[#f84464] rounded-lg shadow-sm flex items-center justify-between px-8 text-white overflow-hidden relative">
              <div className="z-10">
                <h3 className="text-xl md:text-2xl font-bold">Endless Entertainment Anywhere</h3>
                <p className="text-sm md:text-base mt-1 opacity-90">Discover the best events happening around you.</p>
              </div>
              <div className="hidden md:block z-10">
                <button className="bg-white text-[#f84464] px-6 py-2 rounded-full font-bold">Browse All</button>
              </div>
              {/* Decorative circle */}
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-white opacity-10 rounded-full"></div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
