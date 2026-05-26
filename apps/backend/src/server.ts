import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import dotenv from 'dotenv';
import {connectDB} from './config/db';
import { redis } from './config/redis';
import { getMediaById, getMediaCatalog, getTrendingMedia } from './controllers/mediaController';
import { getMyList, toggleMyList } from './controllers/userController';
import { requireAuth } from './middleware/requireAuth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowOrigins = [
  'http://localhost:3000', // For local development
  process.env.FRONTEND_URL // E.g., 'https://my-streaming-app.vercel.app'
]

app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or requests from our allowed list
    if (!origin || allowOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Crucial if you eventually send cookies across domains
}));
app.use(express.json())

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
    // @ts-expect-error - Known typing issue between ioredis and rate-limit-redis
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
    message: { message: 'Too many requests, please try again later.' }
})

app.use('/api', globalLimiter)

app.get('/api/v1/media/trending', getTrendingMedia);
app.get('/api/v1/media', getMediaCatalog);
app.get('/api/v1/media/:id', getMediaById);
app.post('/api/v1/users/list', requireAuth, toggleMyList)
app.get('/api/v1/users/list', requireAuth, getMyList);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
  });
};

startServer();