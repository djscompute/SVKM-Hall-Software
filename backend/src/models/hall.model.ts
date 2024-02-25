import mongoose from "mongoose";

////////////////////
// DEFINING TYPES
////////////////////
export type EachHallLocationType = {
  readonly _id: string;
  desc1: string; // short form of the location
  desc2: string; // full address of the location
  gmapurl?: string; // google map url for the place
  iframe?: string; // google map iframe embed to display on page
};

export type EachHallAdditonalFeaturesType = {
  readonly _id: string;
  heading: string; // heading of the additional feature. (eg. PODIUM )
  desc: string; // description about what the feature is
  stats?: string[]; // stats about the feature for example dimensions, duration, anything
  price?: number; //  price obviously per hour or something.
};

export type EachHallSessionType = {
  readonly _id: string;
  active: boolean;
  name: string;
  from?: string;
  to: string;
  price: { categoryName: string; price: number }[];
};

// ================================================
// this will be in Halls Table
// ================================================
export interface EachHallType {
  readonly _id: string; // UNIQUE KEY. This will be used to query Booking table in a certain time frame.
  name: string; // damn i forgot this
  location: EachHallLocationType; // location of the hall
  about: string[]; // description of the hall. can be buletins
  capacity: string; // obvio
  seating: string; // obvio
  pricing: number | undefined; // pricing. can be either price per time OR ask manager for final qoutation
  additionalFeatures?: EachHallAdditonalFeaturesType[]; // additional features and amenities for the hall
  images: string[]; // array of images of the hall. should be in a file storage. PLS DONT STORE BASE64
  sessions: EachHallSessionType[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

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
    seating: { type: String },
    pricing: { type: String },
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
