import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, History as HistoryIcon, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const StaffLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 flex justify-between items-center px-4 lg:px-8 h-16 shrink-0 z-20 w-full sticky top-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 leading-tight">{user?.name}</h2>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">GeoTrack Staff Portal</p>
          </div>
        </div>
        <div className="flex space-x-4 items-center">
            {/* Desktop Nav */}
             <nav className="hidden md:flex space-x-2 mr-6">
              <NavLink to="/staff" end>
                {({ isActive }) => (
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
                    <MapPin size={16} className={isActive ? "text-primary-600" : "text-gray-400"} />
                    <span>Attendance</span>
                  </div>
                )}
              </NavLink>
              <NavLink to="/staff/history">
                {({ isActive }) => (
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
                    <HistoryIcon size={16} className={isActive ? "text-primary-600" : "text-gray-400"} />
                    <span>History</span>
                  </div>
                )}
              </NavLink>
            </nav>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors p-2 lg:bg-gray-50 lg:hover:bg-red-50 lg:text-gray-600 lg:hover:text-red-600 lg:rounded-lg lg:flex lg:items-center lg:space-x-2">
              <span className="hidden lg:inline text-sm font-medium">Sign Out</span>
              <LogOut size={18} />
            </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-8 pb-24 md:pb-8 relative">
        <div className="max-w-4xl mx-auto h-full relative z-10">
           <Outlet />
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-2 pb-safe md:hidden z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NavLink to="/staff" end>
          {({ isActive }) => (
            <div className={`flex flex-col items-center flex-1 py-1.5 px-3 rounded-lg transition-colors ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'}`}>
              <MapPin size={22} className="" />
              <span className="text-[10px] mt-1 font-semibold tracking-wide">Attendance</span>
            </div>
          )}
        </NavLink>
        <NavLink to="/staff/history">
          {({ isActive }) => (
            <div className={`flex flex-col items-center flex-1 py-1.5 px-3 rounded-lg transition-colors ${isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'}`}>
              <HistoryIcon size={22} className="" />
              <span className="text-[10px] mt-1 font-semibold tracking-wide">History</span>
            </div>
          )}
        </NavLink>
      </nav>
    </div>
  );
};

export default StaffLayout;
