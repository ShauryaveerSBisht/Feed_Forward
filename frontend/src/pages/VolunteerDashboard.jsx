import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Package, MapPin, ArrowRight, CheckCircle2, Truck, Navigation, Phone, Check } from 'lucide-react';

const VolunteerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAction = async (id, action) => {
    setLoadingAction(id + action); // Ex: '123accept'
    try {
      if (action === 'accept') {
        await api.put(`/tasks/${id}/accept`);
      } else if (action === 'pickup') {
         await api.put(`/tasks/${id}/status`, { status: 'PickedUp' });
      } else if (action === 'deliver') {
         await api.put(`/tasks/${id}/status`, { status: 'Delivered' });
      }
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing action');
    }
    setLoadingAction(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-primary-600 rounded-3xl p-8 text-white mb-8 shadow-xl shadow-primary-500/20 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
           <Truck className="w-64 h-64 -mb-10 -mr-10" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Volunteer Portal</h1>
          <p className="text-primary-100 mb-6 max-w-xl">Every delivery you make ensures someone doesn't go to bed hungry. Welcome back, {user?.name}.</p>
          <div className="flex gap-4">
             <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 flex-1">
                <div className="text-primary-100 text-sm font-medium">Deliveries Made</div>
                <div className="text-3xl font-extrabold">{tasks.filter(t => t.status === 'Delivered' && t.volunteer === user?._id).length}</div>
             </div>
             <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 flex-1">
                <div className="text-primary-100 text-sm font-medium">Active Tasks</div>
                <div className="text-3xl font-extrabold">{tasks.filter(t => t.status !== 'Delivered' && t.volunteer === user?._id).length}</div>
             </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-end">
         <h2 className="text-xl font-bold text-gray-900 border-b-2 border-primary-500 pb-2 inline-block">Available Deliveries</h2>
         <button onClick={fetchTasks} className="text-sm font-medium text-primary-600 hover:text-primary-700 transition">Refresh Board</button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div 
              key={task._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl p-6 shadow-sm border ${task.status === 'Available' ? 'border-gray-200 hover:shadow-md' : 'border-primary-200 ring-1 ring-primary-100'} transition-all flex flex-col`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <Package className={`w-10 h-10 p-2 rounded-xl border mr-3 ${task.status === 'Available' ? 'bg-orange-50 text-orange-500 border-orange-100' : 'bg-primary-50 text-primary-600 border-primary-100'}`} />
                  <div>
                    <h3 className="font-bold text-gray-900">{task.donation?.foodType || 'Food Delivery'}</h3>
                    <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">{task.status}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative pl-6 space-y-4 my-2 border-l-2 border-dashed border-gray-200 flex-1">
                 <div className="relative">
                    <div className="absolute w-3 h-3 bg-white border-2 border-orange-400 rounded-full -left-[31px] top-1"></div>
                    <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Pickup from</div>
                    <div className="font-medium text-gray-800 text-sm leading-tight group relative cursor-help">
                       {task.donation?.location}
                       <div className="absolute hidden group-hover:block z-10 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg -top-10 left-0">{task.donation?.location}</div>
                    </div>
                    {task.status !== 'Available' && task.donation?.donor && (
                       <div className="flex items-center text-xs text-gray-500 mt-2 bg-gray-50 p-1.5 rounded inline-flex">
                          <Phone className="w-3 h-3 mr-1" />
                          {task.donation.donor.name}
                       </div>
                    )}
                 </div>
                 
                 <div className="relative pt-2">
                    <div className="absolute w-3 h-3 bg-white border-2 border-primary-500 rounded-full -left-[31px] top-3"></div>
                    <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Deliver to</div>
                    <div className="font-medium text-gray-800 text-sm leading-tight group relative cursor-help">
                       {task.deliveryLocation}
                       <div className="absolute hidden group-hover:block z-10 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg -top-10 left-0">{task.deliveryLocation}</div>
                    </div>
                    {task.status !== 'Available' && task.donation?.ngo && (
                       <div className="flex items-center text-xs text-gray-500 mt-2 bg-gray-50 p-1.5 rounded inline-flex">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                          {task.donation.ngo.name}
                       </div>
                    )}
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                {task.status === 'Available' && (
                  <button 
                    disabled={loadingAction === task._id + 'accept'}
                    onClick={() => handleTaskAction(task._id, 'accept')}
                    className="w-full bg-gray-900 hover:bg-black text-white font-medium py-3 rounded-xl text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    {loadingAction === task._id + 'accept' ? 'Accepting...' : 'Accept Delivery'}
                  </button>
                )}

                {task.status === 'Accepted' && task.volunteer === user?._id && (
                  <div className="grid grid-cols-2 gap-3">
                     <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl text-sm transition-all">
                        <Navigation className="w-4 h-4 mr-1.5" /> Map
                     </button>
                     <button 
                       disabled={loadingAction === task._id + 'pickup'}
                       onClick={() => handleTaskAction(task._id, 'pickup')}
                       className="flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl text-sm transition-all shadow-md shadow-primary-500/20"
                     >
                       {loadingAction === task._id + 'pickup' ? '...' : <><Truck className="w-4 h-4 mr-1.5" /> Picked Up</>}
                     </button>
                  </div>
                )}

                {task.status === 'PickedUp' && task.volunteer === user?._id && (
                  <button 
                    disabled={loadingAction === task._id + 'deliver'}
                    onClick={() => handleTaskAction(task._id, 'deliver')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-green-500/20 flex justify-center items-center"
                  >
                    {loadingAction === task._id + 'deliver' ? 'Confirming...' : <><Check className="w-5 h-5 mr-1" /> Mark Delivered</>}
                  </button>
                )}

                {task.status === 'Delivered' && (
                  <div className="w-full bg-gray-50 text-gray-500 font-medium py-3 rounded-xl text-sm flex justify-center items-center border border-gray-200">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" /> Task Delivered
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {tasks.length === 0 && (
             <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
               <Truck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
               <p className="text-lg font-medium text-gray-600">No active delivery tasks at the moment.</p>
               <p className="text-sm mt-1">Take a break. We'll show new deliveries here when available.</p>
             </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
