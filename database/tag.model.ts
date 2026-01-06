import { model, models, Schema } from "mongoose";

export interface ITag {
    _id?: string;
    name: string;
    questions?: number;
}

const tagSchema = new Schema<ITag>({
    name: { type: String, required: true,unique: true },
    questions: { type: Number, default: 0 },
}, { timestamps: true })

const Tag = models?.Tag || model<ITag>("Tag", tagSchema);
export default Tag;


// two different tag model
// tag have name and no of question
// tagquestion have tag id and question id
// many to many relationship between question and tag
// one question can have multiple tags
