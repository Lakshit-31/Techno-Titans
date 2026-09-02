import { useRef } from "react";
import { Link } from "react-router-dom";

export default function EventCarousel({ title, events, isDark = false, showTag = false }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!events || events.length === 0) return null;

  return (
    <div className={`py-8 ${isDark ? "bg-[#2b3149] text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="relative group">
          {/* Left Button */}
          <button 
            onClick={() => scroll("left")}
            className={`absolute left-0 top-1/3 -translate-y-1/2 -ml-4 z-10 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md ${isDark ? "bg-gray-800 text-white border border-gray-600" : "bg-white text-gray-800"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Carousel Container */}
          <div 
            ref={scrollRef} 
            className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          >
            {events.map((event) => (
              <Link 
                key={event._id} 
                to={`/events/${event._id}`}
                className="flex-none w-40 sm:w-48 md:w-56 snap-start group/card cursor-pointer"
              >
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-200 shadow-sm transition-transform duration-300 group-hover/card:scale-105">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                      <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span className="text-sm font-medium leading-tight">No Image</span>
                    </div>
                  )}
                  {showTag && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-center text-xs py-1 font-bold tracking-widest uppercase">
                      Premiere
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className={`text-lg font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                    {event.title}
                  </h3>
                  <p className={`text-sm truncate mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {event.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Button */}
          <button 
            onClick={() => scroll("right")}
            className={`absolute right-0 top-1/3 -translate-y-1/2 -mr-4 z-10 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md ${isDark ? "bg-gray-800 text-white border border-gray-600" : "bg-white text-gray-800"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
