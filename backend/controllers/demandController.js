const Demand = require('../models/Demand');

exports.createDemand = async (req, res) => {
  try {
    req.body.ngo = req.user.id;
    const demand = await Demand.create(req.body);
    res.status(201).json({ success: true, data: demand });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getDemands = async (req, res) => {
  try {
    let query = Demand.find().populate('ngo', 'name email');
    const demands = await query;
    res.status(200).json({ success: true, count: demands.length, data: demands });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
