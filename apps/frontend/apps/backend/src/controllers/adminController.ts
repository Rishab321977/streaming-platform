import {Request, Response} from "express";
import {redis} from '../config/redis';
import Media from "../models/Media";

export const updateMovieTitle = async (req: Request, res: Response) => {
    try {
    const { id } = req.params;
    const { newTitle } = req.body;

    // 1. Update the Source of Truth (MongoDB)
    await Media.findByIdAndUpdate(id, { title: newTitle });

    // 2. Surgical Cache Invalidation
    // We wipe the global trending cache so the next request grabs fresh data
    await redis.del('media:trending');

    // If we cached individual movies, we would delete that specific key too
    // await redis.del(`media:${id}`);

    return res.status(200).json({ message: 'Movie updated and cache cleared.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}