const express = require('express');
const { createDemand, getDemands } = require('../controllers/demandController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, authorize('NGO', 'Admin'), createDemand)
  .get(protect, getDemands);

module.exports = router;
