import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ShieldCheck, Users, Calendar, CheckCircle2, XCircle, RefreshCw, Star, Trash2, MapPin, Plus, Edit2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingOrganisers, setPendingOrganisers] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('organisers'); // 'organisers' | 'users' | 'events' | 'cities'

  // New City Form state
  const [newCityName, setNewCityName] = useState('');
  const [creatingCity, setCreatingCity] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, pendingRes, eventsRes, citiesRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/organisers/pending'),
        API.get('/admin/events'),
        API.get('/cities?includeInactive=true'),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setPendingOrganisers(pendingRes.data);
      setAllEvents(eventsRes.data);
      setCities(citiesRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrganiser = async (id) => {
    try {
      await API.put(`/admin/organisers/${id}/approve`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve organiser');
    }
  };

  const handleRejectOrganiser = async (id) => {
    try {
      await API.put(`/admin/organisers/${id}/reject`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject organiser');
    }
  };

  const handleToggleFeature = async (eventId) => {
    try {
      await API.put(`/admin/events/${eventId}/feature`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to toggle featured status');
    }
  };

  // City Management Actions
  const handleCreateCity = async (e) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    try {
      setCreatingCity(true);
      await API.post('/cities', { name: newCityName.trim() });
      setNewCityName('');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add city');
    } finally {
      setCreatingCity(false);
    }
  };

  const handleToggleCityActive = async (city) => {
    try {
      await API.put(`/cities/${city._id}`, { isActive: !city.isActive });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update city status');
    }
  };

  const handleDeleteCity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this city?')) return;
    try {
      await API.delete(`/cities/${id}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete city');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-extrabold">Admin Control Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Platform governance, organiser approvals, events moderation, city directory, and system statistics
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Stats
        </button>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 font-semibold block">Customers</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1">{stats?.totalUsers || 0}</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 font-semibold block">Organisers</span>
          <span className="text-xl font-extrabold text-blue-600 mt-1">{stats?.totalOrganisers || 0}</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-amber-200 bg-amber-50/50 text-center">
          <span className="text-[11px] text-amber-800 font-semibold block">Pending Approvals</span>
          <span className="text-xl font-extrabold text-amber-700 mt-1">{stats?.pendingOrganisers || 0}</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 font-semibold block">Total Events</span>
          <span className="text-xl font-extrabold text-slate-900 mt-1">{stats?.totalEvents || 0}</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-500 font-semibold block">Total Revenue</span>
          <span className="text-xl font-extrabold text-emerald-600 mt-1">₹{stats?.totalRevenue || 0}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('organisers')}
          className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'organisers' ? 'bg-red-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          Pending Approvals ({pendingOrganisers.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'users' ? 'bg-red-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'events' ? 'bg-red-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          All Events ({allEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('cities')}
          className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'cities' ? 'bg-red-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" /> City Management ({cities.length})
        </button>
      </div>

      {/* Tab Content 1: Pending Organisers */}
      {activeTab === 'organisers' && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
          {pendingOrganisers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No pending organiser approval requests at this time.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Organiser Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">City</th>
                  <th className="p-3">Requested At</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pendingOrganisers.map((org) => (
                  <tr key={org._id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{org.name}</td>
                    <td className="p-3 text-slate-600">{org.email}</td>
                    <td className="p-3">{org.city}</td>
                    <td className="p-3 text-slate-500">{new Date(org.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleApproveOrganiser(org._id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectOrganiser(org._id)}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[11px] rounded border border-red-200"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab Content 2: All Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">City</th>
                <th className="p-3">Role</th>
                <th className="p-3">Organiser Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{u.name}</td>
                  <td className="p-3 text-slate-600">{u.email}</td>
                  <td className="p-3">{u.city}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : u.role === 'ORGANISER'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    {u.role === 'ORGANISER' ? (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.organiserStatus === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : u.organiserStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {u.organiserStatus}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content 3: All Events */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Event Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">City</th>
                <th className="p-3">Organiser</th>
                <th className="p-3">Featured</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {allEvents.map((ev) => (
                <tr key={ev._id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{ev.title}</td>
                  <td className="p-3">{ev.category?.name}</td>
                  <td className="p-3">{ev.city}</td>
                  <td className="p-3">{ev.organiser?.name}</td>
                  <td className="p-3">
                    {ev.isFeatured ? (
                      <span className="text-xs font-bold text-red-600">★ Featured</span>
                    ) : (
                      <span className="text-slate-400">Normal</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleFeature(ev._id)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded border border-slate-200"
                    >
                      {ev.isFeatured ? 'Unfeature' : 'Feature on Hero'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Content 4: City Management */}
      {activeTab === 'cities' && (
        <div className="space-y-4">
          {/* Add City Form */}
          <form onSubmit={handleCreateCity} className="bg-white p-4 rounded-lg border border-slate-200 flex gap-3 items-center">
            <input
              type="text"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              placeholder="Enter new city name (e.g., Goa, Chandigarh)..."
              className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded px-3 py-1.5 text-xs outline-none"
            />
            <button
              type="submit"
              disabled={creatingCity || !newCityName.trim()}
              className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Add City
            </button>
          </form>

          {/* Cities Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">City Name</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {cities.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">📍 {c.name}</td>
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{c.slug}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          c.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {c.isActive !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-3 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleCityActive(c)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        {c.isActive !== false ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDeleteCity(c._id)}
                        className="p-1 rounded text-red-600 hover:bg-red-50"
                        title="Delete City"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
