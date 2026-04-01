const express = require('express');
const { getTasks, acceptTask, updateTaskStatus } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getTasks);
router.put('/:id/accept', protect, authorize('Volunteer'), acceptTask);
router.put('/:id/status', protect, authorize('Volunteer', 'Admin'), updateTaskStatus);

module.exports = router;
