import mongoose,{ Schema , Document} from "mongoose";

export interface IInteraction extends Document {
    profileId: string;
    mediaId: mongoose.Types.ObjectId;
    type: 'my_list' | 'watch_history';
}

const InteractionSchema: Schema = new Schema({
    profileId: {type: String, required: true, index: true},
    mediaId: {type: mongoose.Types.ObjectId, required: true, ref: 'Media'},
    type: {type: String, enum: ['my_list', 'watch_history'], required: true},
}, {timestamps: true});

InteractionSchema.index({ profileId: 1, mediaId: 1, type: 1 }, { unique: true });

export default mongoose.model<IInteraction>('Interaction', InteractionSchema);