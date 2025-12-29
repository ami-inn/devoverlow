import { model, models, Schema } from "mongoose";


export interface IModel {

}

const modelSchema = new Schema<IModel>({

})

const Model = models?.Model || model<IModel>("Model", modelSchema);

export default Model;