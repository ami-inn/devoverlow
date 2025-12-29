import { model, models, Schema } from "mongoose";

export interface IQuestionModel {
    title: string;
    content: string;
    tags: Schema.Types.ObjectId[];
    views?: number;
    upVotes?: number;
    downVotes?: number;
    answers?: number;
    author: Schema.Types.ObjectId;
}

const questionSchema = new Schema<IQuestionModel>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  views: { type: Number, default: 0 },
  upVotes :{ type: Number, default: 0 },
  downVotes :{ type: Number, default: 0 },
  answers: { type: Number, default: 0 },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Question = models?.Question || model<IQuestionModel>("Question", questionSchema);

export default Question;