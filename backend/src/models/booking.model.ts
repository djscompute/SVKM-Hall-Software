import mongoose, { mongo } from "mongoose";
import { EachHallAdditonalFeaturesType } from "./hall.model";
// @ts-ignore
import {
  CustomerType,
  HallBookingType,
  bookingStatusType,
} from "../../../types/global";
export type { CustomerType, HallBookingType, bookingStatusType };
// import {CustomerSchema}  from "./customer.model";

export const CustomerSchema = new mongoose.Schema<CustomerType>({
  username: { type: String, required: true },
  contact: { type: String},
  email: { type: String },
  aadharNo: { type: String },
  panNo: { type: String },
  address: { type: String },
  mobile: { type: String, required: true },
  remark:{type:String},
});

const HallAdditonalFeaturesSchema =
  new mongoose.Schema<EachHallAdditonalFeaturesType>({
    heading: { type: String, required: true },
    desc: { type: String },
    stats: { type: [String] },
    price: { type: Number, required: true },
  });

const BookingSchema = new mongoose.Schema<HallBookingType>(
  {
    user: {
      type: CustomerSchema,
      required: true,
    },
    features: [HallAdditonalFeaturesSchema],
    status: {
      type: String,
      enum: ["CONFIRMED", "TENTATIVE", "EMPTY", "DISABLED", "ENQUIRY"],
      required: true,
    },
    price: { type: Number, required: true },
    discount: { type: Number },
    deposit : { type: Number },
    hallId: { type: String, required: true },
    session_id: { type: String, required: true },
    booking_type: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    purpose: { type: String, required: true },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.model<HallBookingType>(
  "Booking",
  BookingSchema
);
