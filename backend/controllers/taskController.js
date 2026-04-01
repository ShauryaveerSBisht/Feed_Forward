const Task = require('../models/Task');
const Donation = require('../models/Donation');

exports.getTasks = async (req, res) => {
  try {
    let query;

    // Volunteer sees Available and their own tasks
    if (req.user.role === 'Volunteer') {
      query = Task.find({
        $or: [{ status: 'Available' }, { volunteer: req.user.id }]
      });
    } else {
      query = Task.find();
    }

    const tasks = await query.populate({
      path: 'donation',
      populate: { path: 'donor ngo', select: 'name email' }
    });

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.acceptTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    
    if (task.status !== 'Available') {
      return res.status(400).json({ success: false, message: 'Task already accepted' });
    }

    task.volunteer = req.user.id;
    task.status = 'Accepted';
    await task.save();

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    
    // Auth check
    if (req.user.role !== 'Admin' && task.volunteer.toString() !== req.user.id.toString()) {
       return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    task.status = req.body.status; // 'PickedUp' or 'Delivered'
    await task.save();

    // If Delivered, mark donation as Completed
    if(task.status === 'Delivered') {
      await Donation.findByIdAndUpdate(task.donation, { status: 'Completed' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
