const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route files
const auth = require('./routes/auth');
const donations = require('./routes/donations');
const demands = require('./routes/demands');
const tasks = require('./routes/tasks');
const analytics = require('./routes/analytics');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/donations', donations);
app.use('/api/demands', demands);
app.use('/api/tasks', tasks);
app.use('/api/analytics', analytics);

// Base route
app.get('/', (req, res) => {
  res.send('FeedForward API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
