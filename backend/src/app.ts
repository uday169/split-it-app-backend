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
      
      // Allow localhost origins for development and testing
      if ((config.nodeEnv === 'development' || config.nodeEnv === 'test') && 
          (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1'))) {
        return callback(null, true);
      }
      
      // Allow Android emulator (10.0.2.2) in development and testing
      if ((config.nodeEnv === 'development' || config.nodeEnv === 'test') && 
          (origin.startsWith('http://10.0.2.2') || origin.startsWith('https://10.0.2.2'))) {
        return callback(null, true);
      }
      
      // Allow local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x) in development and testing
      // This allows physical devices on the same network to access the API
      if (config.nodeEnv === 'development' || config.nodeEnv === 'test') {
        // More precise regex that validates IP octets are within valid range (0-255)
        const octet = '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
        const localNetworkPattern = new RegExp(
          `^https?:\\/\\/(` +
          `192\\.168\\.${octet}\\.${octet}|` +       // 192.168.0.0/16
          `10\\.${octet}\\.${octet}\\.${octet}|` +   // 10.0.0.0/8
          `172\\.(1[6-9]|2[0-9]|3[01])\\.${octet}\\.${octet}` + // 172.16.0.0/12
          `)(:\\d+)?$`
        );
        if (localNetworkPattern.test(origin)) {
          return callback(null, true);
        }
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
