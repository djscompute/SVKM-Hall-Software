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
  contact: { type: String },
  email: { type: String },
  gstNo: { type: String },
  panNo: { type: String },
  address: { type: String },
  mobile: { type: String, required: true },
  remark: { type: String },
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
    date: {type:String},
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
    transaction: {
      type: { type: String },
      date: { type: String },
      transactionID: { type: String },
      payeeName: { type: String },
      utrNo: { type: String },
      chequeNo: { type: String },
      bank: { type: String },
    },
    baseDiscount: { type: Number, required: true },
    deposit : { type: Number, required: true },
    isDeposit : { type: Boolean, required: true },
    depositDiscount : { type: Number, required: true },
    hallId: { type: String, required: true },
    session_id: { type: String, required: true },
    booking_type: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    purpose: { type: String, required: true },
    cancellationReason: { type: String },
    enquiryNumber: { type: String },
    managerEmail: {type: String},
    managerName: {type: String},
  },
  { timestamps: true }
);

export const BookingModel = mongoose.model<HallBookingType>(
  "Booking",
  BookingSchema
);
