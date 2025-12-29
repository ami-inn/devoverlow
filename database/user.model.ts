import { model,models, Schema } from "mongoose";

// frontend know about the user interface
export interface IUser {
    name: string;
    username : string;
    email: string;
    // password: string;
    bio?: string;
    image: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
    createdAt?: Date;
    updatedAt?: Date;
}


const userSchema = new Schema({
    name: { type: String, required: true },
    username : { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    // password: { type: String, required: true },
    bio:{ type: String, default: "" },
    image: { type: String,required:true },
    location : { type: String, default: "" },
    portfolio: { type: String, default: "" },
    reputation: { type: Number, default: 0 },
},{ timestamps: true });

const User = models.User || model<IUser>('User', userSchema);

export default User;