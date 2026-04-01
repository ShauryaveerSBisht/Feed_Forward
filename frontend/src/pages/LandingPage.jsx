import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartHandshake, Utensils, Truck, LineChart, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary-50 text-primary-600 font-semibold text-sm mb-6 border border-primary-100 shadow-sm">
              Smart Food Donation & Waste Management
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
              Share <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-600">Meals.</span><br />
              Save the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Planet.</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10">
              Connect surplus food from restaurants, hostels, and households with NGOs and volunteers instantly. Reduce waste, feed hope.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1">
                Start Donating <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-xl text-gray-700 bg-white border-2 border-gray-100 hover:border-primary-100 hover:bg-gray-50 transition-all">
                Partner as NGO
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How FeedForward Works</h2>
            <p className="mt-4 text-lg text-gray-600">A seamless ecosystem for zero-waste food distribution.</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { title: 'Donors Post', icon: <Utensils className="h-8 w-8" />, desc: 'Restaurants & individuals list surplus food quickly with details and expiry times.', color: 'bg-orange-100 text-orange-600' },
              { title: 'Smart Match', icon: <LineChart className="h-8 w-8" />, desc: 'Our algorithm instantly notifies nearby NGOs with matching requirements.', color: 'bg-blue-100 text-blue-600' },
              { title: 'NGO Accepts', icon: <HeartHandshake className="h-8 w-8" />, desc: 'NGOs review available food and accept what they need to serve their community.', color: 'bg-rose-100 text-rose-600' },
              { title: 'Volunteers Deliver', icon: <Truck className="h-8 w-8" />, desc: 'Registered volunteers get notified to pick up and deliver the food safely.', color: 'bg-primary-100 text-primary-600' },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 rounded-3xl p-12 relative overflow-hidden text-center text-white shadow-xl shadow-primary-500/20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <h2 className="text-3xl font-bold mb-4 relative z-10">Join the Movement Today!</h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto relative z-10">Whether you have food to give, hands to help, or people to feed, there is a place for you in the FeedForward network.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 relative z-10 text-center border-y border-primary-500 py-8">
               <div>
                  <div className="text-4xl font-extrabold mb-2">1,200+</div>
                  <div className="text-primary-200">Meals Served</div>
               </div>
               <div>
                  <div className="text-4xl font-extrabold mb-2">450 kg</div>
                  <div className="text-primary-200">Food Saved</div>
               </div>
               <div>
                  <div className="text-4xl font-extrabold mb-2">1.1 Tons</div>
                  <div className="text-primary-200">CO₂ Prevented</div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
