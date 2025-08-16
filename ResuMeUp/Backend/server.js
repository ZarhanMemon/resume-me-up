import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
require('dotenv').config();

// Import routes
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resumes.js';
import userRoutes from './routes/users.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com' 
    : 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(json({ limit: '10mb' }));
app.use(urlencoded({ extended: true }));

// Connect to MongoDB
connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🎯 Shadow Realm (MongoDB) connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'active',
    message: 'Shadow Monarch\'s server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'This path leads to the void...'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💀 Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'The shadows have consumed this request',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚔️  Shadow Monarch's server is running on port ${PORT}`);
});