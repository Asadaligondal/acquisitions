import express from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.route.js';
import securityMiddleware from './middleware/security.middleware.js';
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(securityMiddleware);

app.use(
  morgan('combined', {
    stream: {
      write: message => logger.info(message.trim()),
    },
  })
);
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.status(200).send('Hello, World!');
});
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(), // ✅ Add this line
    service: 'acquisition-service',
    version: '1.0.0',
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is running smoothly' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
});

export default app;
