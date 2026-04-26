const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
require('express-async-errors');

const authRoutes = require('../server/routes/auth');
const taskRoutes = require('../server/routes/tasks');
const aiRoutes = require('../server/routes/ai');
const errorHandler = require('../server/middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.use(errorHandler);

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI)
    .catch(err => console.error('DB connection failed:', err));
}

module.exports = app;
