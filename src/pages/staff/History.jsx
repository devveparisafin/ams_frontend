import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { History as HistoryIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/attendance/history');
      setHistory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto mt-4">
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-3 mb-6">
        <HistoryIcon size={24} className="text-gray-400 hidden md:block" />
        <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Attendance History</h1>
            <p className="text-gray-500 text-sm mt-1">Review your past check-ins and working hours</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {history.length === 0 ? (
           <div className="p-16 text-center text-gray-500 flex flex-col items-center bg-gray-50">
              <Calendar size={32} className="mb-3 text-gray-400" />
              <p className="text-sm font-medium text-gray-900">No records found</p>
              <p className="mt-1 text-xs">Your attendance history will appear here once you start checking in.</p>
           </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {history.map((record) => (
              <div key={record._id} className="p-5 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start space-x-4">
                   <div className="hidden sm:flex w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex-col items-center justify-center text-gray-700">
                      <span className="text-[10px] font-bold uppercase">{new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-lg font-black leading-none">{new Date(record.date).getDate()}</span>
                   </div>
                   <div>
                       <div className="flex items-center space-x-2">
                           <h3 className="font-bold text-gray-900 text-base sm:hidden">{format(new Date(record.date), 'MMM dd, yyyy')}</h3>
                           <h3 className="font-bold text-gray-900 text-base hidden sm:block">{format(new Date(record.date), 'EEEE')}</h3>
                           <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                               record.status === 'PRESENT' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                           }`}>
                               {record.status}
                           </span>
                       </div>
                       
                       <div className="flex text-xs text-gray-500 mt-1.5 space-x-4">
                          <div>
                              <span className="text-gray-400">In:</span> <span className="font-medium text-gray-700">{format(new Date(record.checkIn), 'hh:mm a')}</span>
                          </div>
                          <div>
                              <span className="text-gray-400">Out:</span> <span className="font-medium text-gray-700">{record.checkOut ? format(new Date(record.checkOut), 'hh:mm a') : 'Pending'}</span>
                          </div>
                       </div>
                   </div>
                </div>
                
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 w-full sm:w-auto text-center sm:text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Total Hours</p>
                    <p className="text-xl font-black text-gray-900 leading-none">{record.totalHours || '-'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
