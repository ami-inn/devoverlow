import { model, models, Schema } from "mongoose";

export interface IVote {
  author: Schema.Types.ObjectId;
  id: Schema.Types.ObjectId;
  type: "Question" | "Answer";
  voteType: "Upvote" | "Downvote";
}

const voteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["Question", "Answer"], required: true },
    voteType: { type: String, enum: ["Upvote", "Downvote"], required: true },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", voteSchema);

export default Vote;
