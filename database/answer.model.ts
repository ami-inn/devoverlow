import { model, models, Schema, Types } from "mongoose";

export interface IAAnswerModel {
  author: Types.ObjectId;
  question: Types.ObjectId;
  content: string;
  upVotes?: number;
  downVotes?: number;
}

const answerSchema = new Schema<IAAnswerModel>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true }, // which question this answer belongs to // one question can have multiple answers but one answer belongs to one question
    content: { type: String, required: true },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Answer = models?.Answer || model<IAAnswerModel>("Answer", answerSchema);

export default Answer;
