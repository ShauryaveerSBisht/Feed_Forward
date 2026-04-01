import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { PlusCircle, Clock, CheckCircle, Package, ArrowRight, MapPin, Search } from 'lucide-react';

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'new'
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    foodType: 'Cooked Food',
    quantity: '',
    location: '',
    pickupTime: '',
    expiryTime: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [recommendedNGOs, setRecommendedNGOs] = useState({}); // Map donation ID to array of NGOs

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await api.get('/donations');
      setDonations(res.data.data);
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.post('/donations', formData);
      setMessage({ type: 'success', text: 'Donation created successfully!' });
      setFormData({
        foodType: 'Cooked Food',
        quantity: '',
        location: '',
        pickupTime: '',
        expiryTime: ''
      });
      fetchDonations();
      setActiveTab('history');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error creating donation' });
    }
    setLoading(false);
  };

  const loadRecommendations = async (id) => {
    try {
      const res = await api.get(`/donations/${id}/recommend-ngos`);
      setRecommendedNGOs(prev => ({ ...prev, [id]: res.data.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-blue-100 text-blue-800';
      case 'Assigned': return 'bg-indigo-100 text-indigo-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2 bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            My Donations
          </button>
          <button 
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${activeTab === 'new' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <PlusCircle className="w-4 h-4 mr-1" /> Donate Food
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'} border`}>
          {message.text}
        </div>
      )}

      {activeTab === 'new' ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Create New Donation</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
                <select name="foodType" value={formData.foodType} onChange={handleChange} className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                  <option value="Cooked Food">Cooked Food (Meals)</option>
                  <option value="Raw Ingredients">Raw Ingredients</option>
                  <option value="Bakery">Bakery / Bread</option>
                  <option value="Packaged">Packaged Food</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (Meals/Kg)</label>
                <input type="number" name="quantity" required min="1" value={formData.quantity} onChange={handleChange} className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="e.g. 50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full border-gray-200 rounded-xl pl-10 px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" placeholder="123 Sector 4, City" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Check-in Time</label>
                <input type="datetime-local" name="pickupTime" required value={formData.pickupTime} onChange={handleChange} className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expires By</label>
                <input type="datetime-local" name="expiryTime" required value={formData.expiryTime} onChange={handleChange} className="w-full border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-primary-500/30 transition-all flex justify-center items-center">
              {loading ? 'Publishing...' : <><Package className="w-5 h-5 mr-2" /> Publish Donation</>}
            </button>
          </form>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {donations.length === 0 ? (
             <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
               <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
               <p>No donations yet. Make your first donation today!</p>
             </div>
          ) : (
            donations.map((donation) => (
              <motion.div 
                key={donation._id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(donation.status)}`}>
                    {donation.status}
                  </div>
                  <div className="text-gray-400 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{donation.foodType}</h3>
                <p className="text-gray-600 mb-4">{donation.quantity} Quantity/Meals</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-start text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                    <span className="truncate">{donation.location}</span>
                  </div>
                </div>

                {donation.status === 'Pending' && (
                  <div>
                    <button 
                      onClick={() => loadRecommendations(donation._id)}
                      className="w-full flex items-center justify-center py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors mb-3"
                    >
                      <Search className="w-4 h-4 mr-1" /> Match NGOs
                    </button>
                    {recommendedNGOs[donation._id] && (
                       <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 space-y-2">
                         <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">Recommended NGO Matches</div>
                         {recommendedNGOs[donation._id].length === 0 ? (
                            <span className="text-sm text-gray-500">No immediate matches found.</span>
                         ) : (
                            recommendedNGOs[donation._id].map((req, i) => (
                               <div key={i} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-indigo-50/50">
                                  <span className="font-medium truncate mr-2" title={req.ngo.name}>{req.ngo.name}</span>
                                  <span className="text-indigo-600 text-xs font-bold bg-indigo-50 px-2 py-0.5 rounded whitespace-nowrap">{req.mockDistance}</span>
                               </div>
                            ))
                         )}
                       </div>
                    )}
                  </div>
                )}
                
                {donation.status === 'Completed' && (
                  <div className="flex items-center justify-center text-green-600 bg-green-50 py-2 rounded-lg text-sm font-medium">
                    <CheckCircle className="w-4 h-4 mr-1" /> Reached destination
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
