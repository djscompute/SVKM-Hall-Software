import mongoose from "mongoose";
// Transaction
const TransactionSchema = new mongoose.Schema({
  type: String,
  date: String,
  transactionID: String,
  payeeName: String,
  utrNo: String,
  chequeNo: String,
  bank: String,
}, { _id: false });  // Prevent Mongoose from creating an _id for subdocuments


const MultipleBookingSchema = new mongoose.Schema({
  booking_ids: {
    type: [String],
    required: true
  },
  transaction: {
    type: TransactionSchema,
    required: true
  },
  totalPayable: {
    type: Number,
    required: true
  }
}, { timestamps: true });  


export const MultipleBookingModel = mongoose.model("MultipleBooking", MultipleBookingSchema);


export interface ITransaction {
  type?: string;
  date?: string;
  transactionID?: string;
  payeeName?: string;
  utrNo?: string;
  chequeNo?: string;
  bank?: string;
}

export interface IMultipleBooking {
  booking_ids: string[];
  transaction: ITransaction;
  totalPayable: number;
}