const Donation = require('../models/Donation');
const User = require('../models/User');

exports.getAnalytics = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const completedDonations = await Donation.countDocuments({ status: 'Completed' });
    
    // Calculate total quantity (assuming quantity is numeric for kg/meals)
    const donations = await Donation.find();
    const totalQuantity = donations.reduce((acc, curr) => acc + curr.quantity, 0);

    // Mock Impact (e.g. 1 kg = 2.5 kg CO2 saved)
    const co2Saved = totalQuantity * 2.5;

    res.status(200).json({
      success: true,
      data: {
        totalDonations,
        completedDonations,
        totalQuantity,
        co2Saved
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
