import mongoose from "mongoose";

//type-customer
export interface customerType extends mongoose.Document {
  readonly _id: mongoose.Types.ObjectId;
  username: string;
  email?: string;
  phone?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
// Schema-customer
const customerSchema = new mongoose.Schema<customerType>(
  {
    username: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);
