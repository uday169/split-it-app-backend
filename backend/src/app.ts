import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import groupRoutes from './routes/group.routes';
import expenseRoutes from './routes/expense.routes';
import balanceRoutes from './routes/balance.routes';
import settlementRoutes from './routes/settlement.routes';
import activityRoutes from './routes/activity.routes';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
// Allow requests from web frontend and mobile apps
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) {
        return callback(null, true);
      }
      
      // Allow configured frontend URL
      if (origin === config.frontendUrl) {
        return callback(null, true);
      }
      
      // Allow localhost origins for development
      if (config.nodeEnv === 'development' && 
          (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'))) {
        return callback(null, true);
      }
      
      // Reject all other origins
      callback(null, false);
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - general
const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api/', generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    },
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/activity', activityRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
