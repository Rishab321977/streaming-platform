import mongoose ,{Schema, Document} from "mongoose"

export interface IMedia extends Document {
    tmdbId: number;
    type: 'movie' | 'tv';
    title: string;
    overview: string;
    releaseDate: Date;
    posterPath: string;
    backdropPath: string;
    genres: string[];
    popularity: number;
}

const MediaSchema: Schema = new Schema({
    tmdbId: { type: Number, required: true, unique: true },
  type: { type: String, enum: ['movie', 'tv'], required: true },
  title: { type: String, required: true },
  overview: { type: String, required: true },
  releaseDate: { type: Date },
  posterPath: { type: String },
  backdropPath: { type: String },
  genres: [{ type: String }],
  popularity: { type: Number, default: 0 },
}, { timestamps: true }
)

MediaSchema.index({ popularity: -1 });

export default mongoose.model<IMedia>('Media', MediaSchema);