import {Request, Response} from "express";
import mongoose from "mongoose";
import Media from "../models/Media";
import { redis } from "../config/redis";

export const getTrendingMedia = async (req: Request, res: Response) => {
    const cacheKey = 'media:trending';

    try {
        const cacheData = await redis.get(cacheKey);

        if(cacheData) {
            res.setHeader('X-Cache', 'HIT');
            return res.status(200).json(JSON.parse(cacheData));
        }

        const trending = await Media.find({type: 'movie'})
            .sort({ popularity: -1 })
            .limit(20)
            .select('_id title posterPath popularity');;

        await redis.setex(cacheKey, 3600, JSON.stringify(trending));

        res.setHeader('X-Cache', 'MISS');
        res.status(200).json(trending);
    } catch (error) {
        console.error('Error fetching trending media:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getMediaCatalog = async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 20;
        const cursor = req.query.cursor as string;

        const query = cursor ? { _id: { $gt: cursor } } : {};

        const media = await Media.find(query)
        .sort({ _id: 1 })
        .limit(limit)
        .select('_id title posterPath popularity')

        const nextCursor = media.length === limit ? media[media.length - 1]?._id : null;

        return res.status(200).json({
            data:media,
            nextCursor
        })
    } catch (error) {
        console.error('Error fetching media catalog:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getMediaById = async (req: Request, res: Response) => {
    try {
        const mediaId = req.params.id;



        const media = await Media.findById(mediaId);

        if(!media) {
            return res.status(404).json({ message: 'Media not found' });
        }
        return res.status(200).json(media);
    } catch (error) {
        console.error('Error fetching media details:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}