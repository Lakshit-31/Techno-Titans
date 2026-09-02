import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/manager/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!stats) return <div className="text-center py-10">Failed to load dashboard.</div>;

  const statCards = [
    { name: "Total Events", value: stats.totalEvents },
    { name: "Published Events", value: stats.publishedEvents },
    { name: "Total Tickets", value: stats.totalTickets },
    { name: "Tickets Sold", value: stats.ticketsSold },
    { name: "Available Tickets", value: stats.availableTickets },
    { name: "Total Revenue", value: `₹${stats.totalRevenue}` },
  ];

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Manager Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/manager/events/create" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700">
            Create Event
          </Link>
          <Link to="/manager/events" className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Manage Events
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((item) => (
            <div key={item.name} className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
              <dt>
                <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
              </dt>
              <dd className="pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
