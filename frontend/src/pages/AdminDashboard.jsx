import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Users, PackageCheck, AlertTriangle, Activity, BarChart3, Database } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // For charts we need an array
  const activeData = [
    { name: 'Mon', donations: 4, meals: 120 },
    { name: 'Tue', donations: 3, meals: 90 },
    { name: 'Wed', donations: 7, meals: 300 },
    { name: 'Thu', donations: 5, meals: 250 },
    { name: 'Fri', donations: 8, meals: 400 },
    { name: 'Sat', donations: 12, meals: 600 },
    { name: 'Sun', donations: 10, meals: 500 },
  ];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading System Data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Platform Analytics</h1>
          <p className="text-gray-500 text-sm">Real-time overview of the FeedForward network impact.</p>
        </div>
        <button className="bg-white border border-gray-200 shadow-sm text-gray-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center hover:bg-gray-50 transition-colors">
           <Database className="w-4 h-4 mr-2 text-gray-400" /> Export Data
        </button>
      </div>
      
      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Drives', value: stats?.totalDonations || 0, icon: <Activity className="text-blue-600" />, bg: 'bg-blue-50' },
          { title: 'Completed', value: stats?.completedDonations || 0, icon: <PackageCheck className="text-green-600" />, bg: 'bg-green-50' },
          { title: 'Est. CO2 Saved (kg)', value: stats?.co2Saved?.toFixed(1) || 0, icon: <AlertTriangle className="text-teal-600" />, bg: 'bg-teal-50' },
          { title: 'Meals Provided', value: stats?.totalQuantity || 0, icon: <Users className="text-orange-600" />, bg: 'bg-orange-50' },
        ].map((card, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex items-center"
          >
            <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center mr-5`}>
              {React.cloneElement(card.icon, { className: 'w-7 h-7' })}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                 <BarChart3 className="w-5 h-5 mr-2 text-gray-400" /> Weekly Impact
              </h2>
           </div>
           <div className="h-80 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} />
                 <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                 <Bar dataKey="donations" name="Drives Hosted" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={12} />
                 <Bar dataKey="meals" name="Meals Served" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-gray-900/20">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 -mr-20 -mt-20"></div>
           <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4 relative z-10">System Status</h2>
           
           <div className="space-y-6 relative z-10">
              <div>
                 <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">API Health</div>
                 <div className="flex items-center">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></div>
                    <span className="font-medium">All services operational</span>
                 </div>
              </div>
              
              <div>
                 <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Database Load</div>
                 <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full w-[25%] transition-all"></div>
                 </div>
                 <div className="text-xs text-gray-500 mt-2 text-right">25% capacity utilized</div>
              </div>

              <div className="pt-6 border-t border-gray-800">
                 <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-xl text-sm transition-colors border border-gray-700">
                    Manage Application Logs
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
