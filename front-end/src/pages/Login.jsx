import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, Lock, Mail, AlertCircle, ArrowRight, UserCheck, Briefcase, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'ADMIN') {
        navigate('/dashboard/admin');
      } else if (loggedUser.role === 'ORGANISER') {
        navigate('/dashboard/organizer');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'USER') {
      setEmail('rohan@example.com');
      setPassword('user123');
    } else if (role === 'ORGANISER') {
      setEmail('organiser@pvr.com');
      setPassword('organiser123');
    } else if (role === 'ADMIN') {
      setEmail('admin@eventhub.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white max-w-md w-full rounded-lg p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white mx-auto shadow-sm">
            <Ticket className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Sign In to EventHub</h1>
          <p className="text-xs text-slate-500">Access your tickets, bookings, and event dashboard</p>
        </div>

        {/* Demo Login Selector */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-600 block text-center">
            ⚡ Quick Demo Accounts
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('USER')}
              className="py-1 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded text-[11px] font-semibold flex items-center justify-center gap-1"
            >
              <UserCheck className="w-3 h-3 text-red-600" /> Customer
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('ORGANISER')}
              className="py-1 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded text-[11px] font-semibold flex items-center justify-center gap-1"
            >
              <Briefcase className="w-3 h-3 text-blue-600" /> Organiser
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('ADMIN')}
              className="py-1 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded text-[11px] font-semibold flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-purple-600" /> Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-600 font-semibold hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
