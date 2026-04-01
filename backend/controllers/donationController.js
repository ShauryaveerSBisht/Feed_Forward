const Donation = require('../models/Donation');
const Demand = require('../models/Demand');

// @desc    Create new donation
// @route   POST /api/donations
// @access  Private (Donor)
exports.createDonation = async (req, res) => {
  try {
    req.body.donor = req.user.id;
    const donation = await Donation.create(req.body);

    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private
exports.getDonations = async (req, res) => {
  try {
    let query;

    // Donor sees only their donations
    if (req.user.role === 'Donor') {
      query = Donation.find({ donor: req.user.id });
    } 
    // NGO sees pending donations and donations assigned to them
    else if (req.user.role === 'NGO') {
      // Mock logic: NGOs see Pending ones and their Accepted ones
      query = Donation.find({
        $or: [{ status: 'Pending' }, { ngo: req.user.id }]
      });
    }
    // Admin and Volunteer see all
    else {
      query = Donation.find();
    }

    const donations = await query.populate('donor', 'name email').populate('ngo', 'name email');

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Accept a donation (NGO)
// @route   PUT /api/donations/:id/accept
// @access  Private (NGO)
exports.acceptDonation = async (req, res) => {
  try {
    let donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    if (donation.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Donation already accepted or assigned' });
    }

    donation = await Donation.findByIdAndUpdate(req.params.id, {
      ngo: req.user.id,
      status: 'Accepted'
    }, { new: true, runValidators: true });

    // Mock Task Creation
    const Task = require('../models/Task');
    await Task.create({
      donation: donation._id,
      deliveryLocation: donation.location
    });

    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get Recommended NGOs for a Donation (MOCK)
// @route   GET /api/donations/:id/recommend-ngos
// @access  Private (Donor)
exports.recommendNGOs = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });

    // Mock Rule-based logic: Find NGOs with Demands of same foodType
    const demands = await Demand.find({ foodType: donation.foodType, status: 'Active' }).populate('ngo', 'name email');
    
    // In a real scenario we use geo-spatial query here. For now, map to NGOs.
    const ngos = demands.map(d => ({
        ngo: d.ngo,
        demandRequirement: d.quantityNeeded,
        mockDistance: Math.floor(Math.random() * 10) + 1 + ' km' // Mock distance
    }));

    res.status(200).json({
      success: true,
      count: ngos.length,
      data: ngos
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
