import { model, models, Schema } from "mongoose";


export interface IInteraction {
    user : Schema.Types.ObjectId;
    action : string;
    actionId : Schema.Types.ObjectId; // questionid or answerid 
    actionType : "Question" | "Answer";

}

const interactionSchema = new Schema<IInteraction>({
    user : { type: Schema.Types.ObjectId, ref: "User", required: true },
    action : { type: String, required: true },
    actionId : { type: Schema.Types.ObjectId, required: true }, // questionid or answerid 
    actionType : { type: String, enum: ["Question", "Answer"], required: true },
}, { timestamps: true })

const Interaction = models?.Interaction || model<IInteraction>("Interaction", interactionSchema);

export default Interaction;