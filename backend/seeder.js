const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Donation = require('./models/Donation');
const Demand = require('./models/Demand');
const Task = require('./models/Task');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const users = [
  { name: 'Admin User', email: 'admin@feedforward.com', password: 'password123', role: 'Admin' },
  { name: 'Happy Meals NGO', email: 'ngo@feedforward.com', password: 'password123', role: 'NGO' },
  { name: 'Fresh Cafe Donor', email: 'donor@feedforward.com', password: 'password123', role: 'Donor' },
  { name: 'John Delivery Vol', email: 'vol@feedforward.com', password: 'password123', role: 'Volunteer' },
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Donation.deleteMany();
    await Demand.deleteMany();
    await Task.deleteMany();

    console.log('Clearing old data...');

    const createdUsers = await User.create(users);
    
    const admin = createdUsers[0]._id;
    const ngo = createdUsers[1]._id;
    const donor = createdUsers[2]._id;
    const volunteer = createdUsers[3]._id;

    console.log('Users created...');

    // Create Demands for NGO
    await Demand.create({
       ngo: ngo,
       foodType: 'Cooked Food',
       quantityNeeded: 100,
       location: 'Downtown Center',
       status: 'Active'
    });
    
    // Create Donations
    const d1 = await Donation.create({
       donor: donor,
       foodType: 'Cooked Food',
       quantity: 40,
       location: 'Sector 5, Fresh Cafe',
       pickupTime: new Date(Date.now() + 3600000), // In 1 hour
       expiryTime: new Date(Date.now() + 18000000), // In 5 hours
       status: 'Pending'
    });

    const d2 = await Donation.create({
       donor: donor,
       ngo: ngo,
       foodType: 'Packaged',
       quantity: 20,
       location: 'Sector 5, Fresh Cafe',
       pickupTime: new Date(Date.now() - 3600000), 
       expiryTime: new Date(Date.now() + 86400000),
       status: 'Accepted'
    });

    // Create Tasks
    await Task.create({
       donation: d2._id,
       volunteer: volunteer,
       status: 'PickedUp',
       deliveryLocation: 'Downtown Center'
    });

    console.log('Mock Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Donation.deleteMany();
    await Demand.deleteMany();
    await Task.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
