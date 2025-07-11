const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const sequelize = require('./config/database');

// Load models BEFORE sync
require('./models/user');
require('./models/cartItem');

// Import routes
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT;

// CORS setup
const allowedOrigins = [
  process.env.VITE_FRONTEND_LOCAL_URL?.replace(/\/$/, ''),
  process.env.VITE_FRONTEND_SERVER_URL?.replace(/\/$/, ''),
];

app.use(cors({
  origin: function (origin, callback) {
    const cleanedOrigin = origin?.replace(/\/$/, '');
    if (!origin || allowedOrigins.includes(cleanedOrigin)) {
      callback(null, true);
    } 
    else {
      console.error(`❌ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);

// Health check
app.get('/', (req, res) => {
  res.status(200).send('🚀 Backend is running');
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: '🔍 Route not found' });
});

// DB connect and start server
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected via Sequelize');

    await sequelize.sync({ alter: true });
    console.log('✅ Sequelize models synced with ALTER');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at:
  ▶ Local:   http://localhost:${PORT}
  ▶ Public:  http://13.127.230.171:${PORT}
🌐 Allowed CORS: ${allowedOrigins.join(', ')}`);
    });
  } 
  catch (error) {
    console.error('❌ DB connection failed:', error);
    process.exit(1);
  }
})();
