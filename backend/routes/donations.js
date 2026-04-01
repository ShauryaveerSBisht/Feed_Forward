const express = require('express');
const { createDonation, getDonations, acceptDonation, recommendNGOs } = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, authorize('Donor', 'Admin'), createDonation)
  .get(protect, getDonations);

router.route('/:id/accept')
  .put(protect, authorize('NGO', 'Admin'), acceptDonation);

router.route('/:id/recommend-ngos')
  .get(protect, authorize('Donor', 'Admin'), recommendNGOs);

module.exports = router;
