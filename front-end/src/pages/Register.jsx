import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, Lock, Mail, User, MapPin, Phone, AlertCircle, ArrowRight, CheckCircle2, UserCheck, Briefcase } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const newUser = await register({
        name,
        email,
        password,
        phone,
        city,
        role,
      });

      if (newUser.role === 'ORGANISER') {
        navigate('/dashboard/organizer');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white max-w-lg w-full rounded-lg p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white mx-auto shadow-sm">
            <Ticket className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create an Account</h1>
          <p className="text-xs text-slate-500">Sign up to book tickets or list your events</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Tabs */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">I want to register as:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('USER')}
              className={`p-3 rounded border text-left flex items-center justify-between transition-all ${
                role === 'USER'
                  ? 'bg-red-50 border-red-500 text-red-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-red-600" />
                <span className="text-xs">Customer</span>
              </div>
              {role === 'USER' && <CheckCircle2 className="w-4 h-4 text-red-600" />}
            </button>

            <button
              type="button"
              onClick={() => setRole('ORGANISER')}
              className={`p-3 rounded border text-left flex items-center justify-between transition-all ${
                role === 'ORGANISER'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span className="text-xs">Organiser</span>
              </div>
              {role === 'ORGANISER' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
            </button>
          </div>

          {role === 'ORGANISER' && (
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 border border-amber-200 rounded mt-2">
              ⚠️ Note: Organiser accounts start as <strong>PENDING</strong> and require Admin approval before publishing live events.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Full Name / Business Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Sharma or PVR Events"
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-2 pl-9 pr-3 text-xs outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-2 pl-9 pr-3 text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-2 pl-9 pr-3 text-xs outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Default City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-2 px-3 text-xs outline-none"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Boston">Boston</option>
                <option value="San Francisco">San Francisco</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-2 pl-9 pr-3 text-xs outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Create Account <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="text-red-600 font-semibold hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
