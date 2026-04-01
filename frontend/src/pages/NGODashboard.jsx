import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Check, X, MapPin, Package, AlertCircle } from 'lucide-react';

const NGODashboard = () => {
  const { user } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);
  
  const fetchAvailableDonations = async () => {
    try {
      const res = await api.get('/donations');
      setDonations(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAvailableDonations();
  }, []);

  const handleAccept = async (id) => {
    setLoadingAction(id);
    try {
      await api.put(`/donations/${id}/accept`);
      // Update local state by refetching
      fetchAvailableDonations();
    } catch (err) {
      alert(err.response?.data?.message || 'Error accepting donation');
    }
    setLoadingAction(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NGO Operations Panel</h1>
        <p className="text-gray-600 mt-1">Hello, {user?.name}. Find and accept available food drives.</p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
           <AlertCircle className="w-5 h-5 text-indigo-500 mr-2" />
           Your Active Requirement: <strong className="ml-1 text-gray-900">Cooked Food (Any Quantity)</strong>
        </div>
        <button className="text-sm font-medium text-primary-600 hover:text-primary-700">Update Demands</button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {donations.filter(d => d.status === 'Pending' || d.ngo?._id === user?._id).map((donation) => (
            <motion.div 
              key={donation._id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`bg-white rounded-2xl p-6 shadow-sm border ${donation.status === 'Pending' ? 'border-indigo-100 hover:shadow-indigo-100/50 hover:border-indigo-200' : 'border-green-100'} transition-all relative overflow-hidden`}
            >
              {donation.status === 'Accepted' && (
                 <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Accepted by You
                 </div>
              )}

              <div className="flex items-start space-x-4 mb-4 mt-2">
                <div className={`p-3 rounded-xl ${donation.status === 'Pending' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{donation.foodType}</h3>
                  <p className="text-gray-500 text-sm">from <span className="font-semibold text-gray-700">{donation.donor?.name || 'Unknown Donor'}</span></p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-16 text-gray-400">Qty:</span>
                  <span className="font-semibold text-gray-800">{donation.quantity} serves/kg</span>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <span className="font-medium w-16 text-gray-400 mt-0.5">Where:</span>
                  <span className="flex-1 truncate group relative cursor-help">
                    <MapPin className="w-4 h-4 inline-block -mx-0.5 mr-0.5 text-gray-400" />
                    {donation.location}
                    <div className="absolute hidden group-hover:block z-10 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg -top-10 left-0">
                      {donation.location}
                    </div>
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium w-16 text-gray-400">Expires:</span>
                  <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded font-medium">{new Date(donation.expiryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>

              {donation.status === 'Pending' && (
                <div className="flex space-x-3">
                  <button 
                    disabled={loadingAction === donation._id}
                    onClick={() => handleAccept(donation._id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl shadow-sm text-sm transition-colors flex justify-center items-center"
                  >
                    {loadingAction === donation._id ? 'Accepting...' : 'Accept Drive'}
                  </button>
                  <button className="px-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition-colors border border-gray-200 shadow-sm">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {(donation.status === 'Accepted' || donation.status === 'Completed') && (
                <div className="text-center py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                   Volunteers will pick this up soon.
                </div>
              )}
            </motion.div>
          ))}
          
          {donations.filter(d => d.status === 'Pending' || d.ngo?._id === user?._id).length === 0 && (
             <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
               <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
               <p className="text-lg">No food drives available in your matching radar currently.</p>
               <p className="text-sm mt-1">We will notify you when donors post new items.</p>
             </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NGODashboard;
