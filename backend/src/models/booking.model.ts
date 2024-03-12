import mongoose, { mongo } from "mongoose";
import { EachHallAdditonalFeaturesType } from "./hall.model";
// @ts-ignore
import {
  CustomerType,
  HallBookingType,
  bookingStatusType,
} from "../../../types/global";
export type { CustomerType, HallBookingType, bookingStatusType };
import { CustomerSchema } from "./customer.model";

// export const CustomerSchema = new mongoose.Schema<CustomerType>({
//   username: { type: String, required: true },
//   email: { type: String },
//   aadharNo: { type: String },
//   panNo: { type: String },
//   address: { type: String },
//   mobile: { type: String, required: true },
// });

const HallAdditonalFeaturesSchema =
  new mongoose.Schema<EachHallAdditonalFeaturesType>({
    heading: { type: String, required: true },
    desc: { type: String},
    stats: { type: [String]},
    price: { type: Number, required: true  },
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
