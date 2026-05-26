import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.REDIS_URL as string);

redis.on("connect", () => {
    console.log('✅ Connected to Upstash Redis');
});

redis.on("error", (err) => {
    console.log('❌ Redis connection error:', err);
});