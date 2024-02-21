import mongoose, { mongo } from "mongoose";
import { EachHallAdditonalFeaturesType } from "./hall.model";

export type CustomerType = {
  name: string;
  email?: string;
  aadharNo?: string;
  panNo?: string;
  address?: string;
  mobile: string;
};

const CustomerSchema = new mongoose.Schema<CustomerType>({
  name: { type: String, required: true },
  email: { type: String },
  aadharNo: { type: String },
  panNo: { type: String },
  address: { type: String },
  mobile: { type: String, required: true },
});

const HallAdditonalFeaturesSchema =
  new mongoose.Schema<EachHallAdditonalFeaturesType>({
    heading: { type: String, required: true },
    desc: { type: String, required: true },
    stats: { type: [String], required: true },
    price: { type: Number },
  });

export interface HallBookingType extends mongoose.Document {
  readonly _id: mongoose.Types.ObjectId;
  user: CustomerType;
  features: EachHallAdditonalFeaturesType[];
  status: "CONFIRMED" | "TENTATIVE" | "EMPTY" | "DISABLED";
  price: number;
  hallId: string;
  session_id: string;
  from: string;
  to: string;
  time: {
    from: string;
    to: string;
  };
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

const BookingSchema = new mongoose.Schema<HallBookingType>(
  {
    user: {
      type: CustomerSchema,
      required: true,
    },
    features: [HallAdditonalFeaturesSchema],
    status: {
      type: String,
      enum: ["CONFIRMED", "TENTATIVE", "EMPTY", "DISABLED"],
      required: true,
    },
    price: { type: Number, required: true },
    hallId: { type: String, required: true },
    session_id: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    time: {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.model<HallBookingType>(
  "Booking",
  BookingSchema
);
