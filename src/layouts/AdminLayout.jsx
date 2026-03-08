import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, FileBarChart, LogOut } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <MapPin className="text-primary-600 mr-2" size={24} strokeWidth={2.5} />
          <span className="text-xl font-bold text-gray-900 tracking-tight">GeoTrack</span>
        </div>
        
        <div className="px-6 py-4">
             <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Role</p>
                <p className="text-sm font-medium text-gray-900">{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Branch Admin'}</p>
             </div>
        </div>
        
        <nav className="flex-1 px-4 py-2 space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Platform</p>
          <NavLink to="/admin" end>
            {({ isActive }) => (
              <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-150 ${isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <LayoutDashboard size={20} className={`shrink-0 ${isActive ? "text-primary-600" : "text-gray-400"}`} />
                <span>Dashboard</span>
              </div>
            )}
          </NavLink>
          
          {user?.role === 'SUPER_ADMIN' && (
            <NavLink to="/admin/branches">
              {({ isActive }) => (
              <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-150 ${isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <MapPin size={20} className={`shrink-0 ${isActive ? "text-primary-600" : "text-gray-400"}`} />
                <span>Branches</span>
              </div>
              )}
            </NavLink>
          )}

          <NavLink to="/admin/staff">
            {({ isActive }) => (
              <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-150 ${isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <Users size={20} className={`shrink-0 ${isActive ? "text-primary-600" : "text-gray-400"}`} />
                <span>Staff</span>
              </div>
            )}
          </NavLink>

          <NavLink to="/admin/reports">
            {({ isActive }) => (
              <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-150 ${isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                <FileBarChart size={20} className={`shrink-0 ${isActive ? "text-primary-600" : "text-gray-400"}`} />
                <span>Reports</span>
              </div>
            )}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={handleLogout} className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-3 rounded-lg w-full transition-colors font-medium">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center md:hidden shrink-0">
          <div className="flex items-center space-x-2">
            <MapPin className="text-primary-600" size={24} />
            <span className="text-lg font-bold text-gray-900">GeoTrack</span>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors"><LogOut size={20} /></button>
        </header>

        {/* Desktop Top Header */}
        <header className="hidden md:flex bg-white border-b border-gray-200 h-16 items-center justify-between px-8 sticky top-0 z-10 w-full shrink-0">
            <div className="text-sm font-medium text-gray-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-700 text-sm">{user?.name}</span>
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-sm border border-gray-200">
                    {user?.name?.charAt(0)}
                </div>
            </div>
        </header>

        <div className="flex-1 p-6 lg:p-10 overflow-auto w-full">
          <div className="max-w-6xl mx-auto">
             <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
