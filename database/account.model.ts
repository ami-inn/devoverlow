

// account onver version of the spectific user
// single user multiple accounts

import { model, models, Schema } from "mongoose";

export interface IAccount {
  userId: string;
  name: string;
  Image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
}

const accountSchema = new Schema({
    userId : { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    Image: { type: String },
    password: {type:String},
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
   
})

const Account = models?.Account || model<IAccount>("Account", accountSchema);

export default Account;