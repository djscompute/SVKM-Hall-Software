import mongoose from "mongoose";

export interface ConstantsType extends mongoose.Document {
  readonly _id: mongoose.Types.ObjectId;
  constantName: string;
  value: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

const constantsSchema = new mongoose.Schema<ConstantsType>(
  {
    constantName: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

const ConstantsModel = mongoose.model<ConstantsType>("constants", constantsSchema);

export default ConstantsModel;
