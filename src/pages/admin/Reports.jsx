import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { format } from 'date-fns';
import { Download, FileBarChart, Filter, MapPin } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchReports();
    if (user?.role === 'SUPER_ADMIN') {
        fetchBranches();
    }
  }, [user]);

  const fetchBranches = async () => {
    try {
      const { data } = await api.get('/branches');
      setBranches(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/attendance/reports');
      setReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(r => {
      const matchDate = filterDate ? r.date === filterDate : true;
      const matchBranch = filterBranch ? r.branchId?._id === filterBranch : true;
      return matchDate && matchBranch;
  });

  const exportCSV = () => {
    const headers = ['Date', 'Staff Name', 'Branch', 'Check In', 'Check Out', 'Total Hours', 'Status'];
    const rowData = filteredReports.map(r => [
      r.date,
      r.userId?.name,
      r.branchId?.name,
      new Date(r.checkIn).toLocaleTimeString(),
      r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : 'N/A',
      r.totalHours || '-',
      r.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rowData.map(e => e.join(','))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 gap-6">
        <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center space-x-2 tracking-tight">
                <FileBarChart size={20} className="text-gray-400" />
                <span>Attendance Reports</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">View and export real-time attendance data across all branches.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all shadow-sm">
             <Filter size={16} className="text-gray-400" />
             <input 
               type="date" 
               value={filterDate}
               onChange={(e) => setFilterDate(e.target.value)}
               className="bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700 w-full"
             />
          </div>
          {user?.role === 'SUPER_ADMIN' && (
              <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all shadow-sm">
                 <MapPin size={16} className="text-gray-400" />
                 <select 
                   value={filterBranch}
                   onChange={(e) => setFilterBranch(e.target.value)}
                   className="bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700 w-full"
                 >
                     <option value="">All Branches</option>
                     {branches.map(b => (
                         <option key={b._id} value={b._id}>{b.name}</option>
                     ))}
                 </select>
              </div>
          )}
          <button 
            onClick={exportCSV} 
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-700 transition-colors shadow-sm font-medium text-sm"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
             <div className="flex justify-center items-center p-24"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div></div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 text-xs border-b border-gray-200 uppercase tracking-wider font-semibold">
                <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Staff Name</th>
                    <th className="px-6 py-3">Branch</th>
                    <th className="px-6 py-3">Check In</th>
                    <th className="px-6 py-3">Check Out</th>
                    <th className="px-6 py-3">Total Hrs</th>
                    <th className="px-6 py-3">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {filteredReports.map(report => (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{report.date}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium text-sm">{report.userId?.name}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                        {report.branchId?.name ? (
                            <span className="flex items-center space-x-1.5"><MapPin size={14} className="text-gray-400"/><span>{report.branchId.name}</span></span>
                        ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium text-sm">{format(new Date(report.checkIn), 'hh:mm a')}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium text-sm">{report.checkOut ? format(new Date(report.checkOut), 'hh:mm a') : <span className="text-gray-400 italic">Active</span>}</td>
                    <td className="px-6 py-4 font-bold text-gray-800 tracking-tight text-sm">{report.totalHours || '-'}</td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                            report.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            report.status === 'ABSENT' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                            {report.status}
                        </span>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {filteredReports.length === 0 && <div className="p-16 text-center text-gray-500 flex flex-col items-center border-t border-gray-200 bg-gray-50">
                <FileBarChart size={32} className="text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-900">No records found</p>
                <p className="text-xs mt-1">No attendance records match your current filters.</p>
            </div>}
            </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
