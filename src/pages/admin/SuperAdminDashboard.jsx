import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, MapPin, CheckCircle, XCircle } from 'lucide-react';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBranches: 0,
    totalStaff: 0,
    presentToday: 0,
    absentToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
         <p className="text-gray-500 mt-1 text-sm">Key metrics across all branches.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Staff" 
          value={stats.totalStaff} 
          icon={<Users size={24} className="text-blue-600" />} 
          bg="bg-blue-50"
          border="border-blue-100" 
        />
        <StatCard 
          title="Total Branches" 
          value={stats.totalBranches} 
          icon={<MapPin size={24} className="text-indigo-600" />} 
          bg="bg-indigo-50"
          border="border-indigo-100" 
        />
        <StatCard 
          title="Present Today" 
          value={stats.presentToday} 
          icon={<CheckCircle size={24} className="text-emerald-600" />} 
          bg="bg-emerald-50"
          border="border-emerald-100" 
        />
        <StatCard 
          title="Absent Today" 
          value={stats.absentToday} 
          icon={<XCircle size={24} className="text-rose-600" />} 
          bg="bg-rose-50"
          border="border-rose-100" 
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
        <h2 className="text-lg font-bold mb-4 text-gray-900">Today's Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Rate</p>
                <div className="flex items-end space-x-2 mt-2">
                    <p className="text-3xl font-black text-gray-900">
                        {stats.totalStaff > 0 ? Math.round((stats.presentToday / stats.totalStaff) * 100) : 0}%
                    </p>
                </div>
            </div>
             <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Locations</p>
                <p className="text-3xl font-black text-gray-900 mt-2">{stats.totalBranches}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bg, border }) => (
  <div className={`bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4`}>
    <div className={`p-3 rounded-lg flex items-center justify-center ${bg}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">{value}</p>
    </div>
  </div>
);

export default SuperAdminDashboard;
