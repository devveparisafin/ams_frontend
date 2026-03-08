import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import useAuthStore from '../../store/useAuthStore';
import { MapPin, Navigation, Clock, CheckCircle, XCircle } from 'lucide-react';

const StaffDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('Checking location...');
  const [attendanceToday, setAttendanceToday] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const { user } = useAuthStore();

  useEffect(() => {
    checkTodayAttendance();
  }, []);

  const checkTodayAttendance = async () => {
    try {
      const { data } = await api.get('/attendance/history');
      const todayString = new Date().toISOString().split('T')[0];
      const todayRecord = data.find(record => record.date === todayString);
      setAttendanceToday(todayRecord || null);
    } catch (error) {
      console.error(error);
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported by your browser');
      } else {
        setLocationStatus('Acquiring GPS coordinates...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            reject('Unable to retrieve your location. Please ensure location services are enabled.');
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    });
  };

  const handleAttendance = async (type) => {
    setLoading(true);
    let coords;
    
    try {
      coords = await getLocation();
    } catch (error) {
      setNotification({ show: true, message: error, type: 'error' });
      setLoading(false);
      setLocationStatus('');
      return;
    }

    setLocationStatus(`Verifying location with branch...`);

    try {
      if (type === 'check-in') {
        await api.post('/attendance/check-in', coords);
        setNotification({ show: true, message: 'Check-In Successful!', type: 'success' });
      } else {
        await api.post('/attendance/check-out', coords);
        setNotification({ show: true, message: 'Check-Out Successful!', type: 'success' });
      }
      checkTodayAttendance();
    } catch (error) {
      const msg = error.response?.data?.message || 'Attendance failed';
      let extra = '';
      if (error.response?.data?.distance) {
          extra = `\nYou are ${error.response.data.distance}m away. Max allowed is ${error.response.data.allowedRadius}m.`;
      }
      setNotification({ show: true, message: msg + extra, type: 'error' });
    } finally {
      setLoading(false);
      setLocationStatus('');
    }
  };

  const renderAction = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-3 py-6">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
           <p className="text-gray-500 font-medium text-sm">{locationStatus}</p>
        </div>
      );
    }

    if (!attendanceToday) {
      return (
        <button 
          onClick={() => handleAttendance('check-in')}
          className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex flex-col items-center justify-center space-y-1 shadow-sm"
        >
          <Navigation size={24} className="text-gray-300" />
          <span>Mark Check-In</span>
        </button>
      );
    }

    if (attendanceToday && !attendanceToday.checkOut) {
      return (
        <button 
          onClick={() => handleAttendance('check-out')}
          className="w-full py-4 bg-white border border-gray-300 text-gray-900 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center space-y-1 shadow-sm"
        >
          <Clock size={24} className="text-gray-500" />
          <span>Mark Check-Out</span>
        </button>
      );
    }

    return (
      <div className="flex flex-col items-center space-y-2 p-6 bg-gray-50 rounded-xl border border-gray-200 w-full text-center">
        <CheckCircle size={32} className="text-green-600 mb-1" />
        <h3 className="text-sm font-bold text-gray-900">Attendance Completed</h3>
        <p className="text-gray-500 text-xs">Total Hours: {attendanceToday.totalHours}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto py-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-xl shadow-card border border-gray-200 overflow-hidden">
         <div className="p-6 sm:p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                   <h1 className="text-xl font-bold text-gray-900 tracking-tight">Today's Attendance</h1>
                   <p className="text-gray-500 text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                   <MapPin size={20} className="text-primary-600" />
                </div>
            </div>
            
            <div className="min-h-[140px] flex items-center justify-center mb-2">
              {renderAction()}
            </div>
         </div>
         
         {attendanceToday && (
            <div className="bg-gray-50 p-6 border-t border-gray-200 grid grid-cols-2 gap-4 text-center">
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Check In</p>
                    <p className="text-lg font-bold text-gray-900">
                        {new Date(attendanceToday.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Check Out</p>
                    <p className="text-lg font-bold text-gray-900">
                        {attendanceToday.checkOut ? new Date(attendanceToday.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </p>
                </div>
            </div>
         )}
      </div>

       <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3">
          <div className="mt-0.5 shrink-0 text-blue-600">
             <Navigation size={18} />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-blue-900">Location Services Required</h4>
            <p className="text-xs text-blue-800/80 mt-1 leading-relaxed">Please ensure your device GPS is turned on and your browser has permission to access your location before marking attendance.</p>
          </div>
      </div>

      {notification.show && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-card animate-in zoom-in-95 duration-200 text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
               {notification.type === 'success' ? (
                   <CheckCircle className="text-green-600" size={24} />
               ) : (
                   <XCircle className="text-red-600" size={24} />
               )}
            </div>
            <h2 className="text-lg font-bold mb-2 text-gray-900">
                {notification.type === 'success' ? 'Success' : 'Error'}
            </h2>
            <p className="text-sm text-gray-500 mb-6 whitespace-pre-wrap">{notification.message}</p>
            
            <button 
              onClick={() => setNotification({ ...notification, show: false })}
              className="px-4 py-2 w-full text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors shadow-sm"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
