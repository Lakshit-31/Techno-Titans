import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import SearchListing from './pages/SearchListing';
import EventDetails from './pages/EventDetails';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrganiserDashboard from './pages/OrganiserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#F7F7F8] text-slate-800 font-['Inter',sans-serif]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<SearchListing />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/events/:id/seats" element={<SeatSelection />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Customer Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'ORGANISER', 'ADMIN']}>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/confirmation"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'ORGANISER', 'ADMIN']}>
                      <Confirmation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['USER', 'ORGANISER', 'ADMIN']}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Dashboards */}
                <Route
                  path="/dashboard/organizer"
                  element={
                    <ProtectedRoute allowedRoles={['ORGANISER', 'ADMIN']}>
                      <OrganiserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
