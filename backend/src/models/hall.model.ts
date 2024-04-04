import mongoose from "mongoose";
// @ts-ignore
import { EachHallLocationType, EachHallAdditonalFeaturesType, EachHallSessionType, EachHallType } from "../../../types/global"
export type { EachHallLocationType, EachHallAdditonalFeaturesType, EachHallSessionType, EachHallType }

////////////////////
// DEFINING SUB SCHEMAS
////////////////////
const HallLocationSchema = new mongoose.Schema<EachHallLocationType>({
  desc1: { type: String, required: true },
  desc2: { type: String, required: true },
  gmapurl: { type: String },
  iframe: { type: String },
});

const HallAdditonalFeaturesSchema =
  new mongoose.Schema<EachHallAdditonalFeaturesType>({
    heading: { type: String, required: true },
    desc: { type: String, required: true },
    stats: { type: [String], required: true },
    price: { type: Number },
  });

const HallSessionSchema = new mongoose.Schema<EachHallSessionType>({
  active: { type: Boolean, required: true },
  name: { type: String, required: true },
  from: { type: String },
  to: { type: String, required: true },
  price: [
    {
      categoryName: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
});

////////////////////
// DEFINING MAIN SCHEMA
////////////////////
const HallSchema = new mongoose.Schema<EachHallType>(
  {
    name: { type: String, required: true },
    location: { type: HallLocationSchema, required: true },
    about: { type: [String], required: true },
    capacity: { type: String },
    additionalFeatures: {
      type: [HallAdditonalFeaturesSchema],
    },
    images: { type: [String], required: true },
    sessions: { type: [HallSessionSchema], required: true },
  },
  {
    timestamps: true,
  }
);

// Create Mongoose model
export const HallModel = mongoose.model("Halls", HallSchema);
