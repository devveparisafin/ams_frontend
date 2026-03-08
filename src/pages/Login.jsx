import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { MapPin } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get or generate a persistent device ID for this browser
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        // Fallback robust UUID generation sequence
        deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        try {
            if (crypto && crypto.randomUUID) deviceId = crypto.randomUUID();
        } catch(e) {}
        localStorage.setItem('deviceId', deviceId);
    }
    
    const success = await login(email, password, deviceId);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 border-r border-slate-200/60 bg-white relative z-10 w-full lg:w-[480px]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <MapPin className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">GeoTrack</h2>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Please sign in to access your portal.
          </p>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm animate-in slide-in-from-top-2">
                  {error}
                </div>
              )}
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Email address</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white sm:text-sm transition duration-200"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white sm:text-sm transition duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-500/30 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
              
              <div className="pt-6 relative">
                 <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                 </div>
                 <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-slate-400">Default Super Admin</span>
                 </div>
              </div>
              
              <div className="text-center pt-2">
                  <p className="text-xs font-mono text-slate-500 bg-slate-50 py-2 rounded-lg border border-slate-100">admin@ams.com / password</p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Right side - Abstract Graphic */}
      <div className="hidden lg:block relative w-0 flex-1 overflow-hidden bg-slate-900">
         <div className="absolute inset-0 h-full w-full object-cover bg-gradient-to-br from-primary-900 via-slate-900 to-primary-800"></div>
         <div className="absolute top-0 left-0 w-full h-full opacity-30 transform -skew-y-12 scale-150">
             <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"></div>
             <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"></div>
         </div>
         <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
             <div className="glass p-8 rounded-2xl max-w-lg shadow-2xl">
                 <MapPin size={48} className="text-primary-300 mx-auto mb-6" />
                 <h2 className="text-3xl font-bold text-white mb-4">Location-Verified Attendance</h2>
                 <p className="text-primary-100/80 leading-relaxed text-lg">
                    Ensure accurate and reliable attendance tracking across all your organization's branches using precise GPS verification technology.
                 </p>
             </div>
         </div>
      </div>
    </div>
  );
};

export default Login;
