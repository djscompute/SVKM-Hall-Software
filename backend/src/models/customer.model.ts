import mongoose from "mongoose";
// @ts-ignore
import { CustomerType } from "../../../types/global"
export type { CustomerType }

// Schema-customer
export const CustomerSchema = new mongoose.Schema<CustomerType>(
  {
    username: { type: String, required: true },
    email: { type: String,required: true },
    aadharNo: { type: String },
    panNo: { type: String },
    address: { type: String },
    mobile: { type: String, required: true },
  },
  { timestamps: true }
);
