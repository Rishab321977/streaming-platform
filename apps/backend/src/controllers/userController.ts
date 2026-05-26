import { Request, Response } from "express"
import Interaction from "../models/Interaction"
import { AuthRequest } from "../middleware/requireAuth"

export const toggleMyList = async (req: AuthRequest, res: Response) => {
  try {
    const { mediaId } = req.body
    const profileId = req.user?.id

    if (!profileId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const existing = await Interaction.findOne({
      profileId,
      mediaId,
      type: "my_list",
    })

    if (existing) {
      await Interaction.deleteOne({ _id: existing._id })
      return res
        .status(200)
        .json({ message: "Removed from list", isInList: false })
    } else {
      await Interaction.create({ profileId, mediaId, type: "my_list" })
      return res.status(200).json({ message: "Added to list", isInList: true })
    }
  } catch (error) {
    console.error("Error toggling list:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getMyList = async (req: AuthRequest, res: Response) => {
  try {
    const profileId = req.user?.id

    if (!profileId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const interactions = await Interaction.find({ profileId, type: "my_list" })
      .populate("mediaId", "_id title posterPath popularity")
      .sort({ createdAt: -1 }) // Newest additions first

      const savedMovies = interactions.filter(i => i.mediaId !== null).map(i => i.mediaId)
      return res.status(200).json(savedMovies);
  } catch (error) {
    console.error("Error fetching my list:", error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
