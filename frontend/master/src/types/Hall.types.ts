////////////////////
// DEFINING TYPES
////////////////////
export type EachHallLocationType = {
  desc1: string; // short form of the location
  desc2: string; // full address of the location
  gmapurl?: string; // google map url for the place
  iframe?: string; // google map iframe embed to display on page
};

export type EachHallTimingType = {
  from: string; // time from which the halls opens on the day.
  to: string; // time till which the hall remains open on a day.
};

export type EachHallAdditonalFeaturesType = {
  heading: string; // heading of the additional feature. (eg. PODIUM )
  desc: string; // description about what the feature is
  stats?: string[]; // stats about the feature for example dimensions, duration, anything
  price?: number; //  price obviously per hour or something.
};


export type EachHallSlotDuration = {
  session: string;
  duration: string;
};

// ================================================
// this will be in Halls Table
// ================================================
export interface EachHallType {
  readonly _id: string; // UNIQUE KEY. This will be used to query Booking table in a certain time frame.
  name: string; // damn i forgot this
  location: EachHallLocationType; // location of the hall
  about: string[]; // description of the hall. can be buletins
  timings: EachHallTimingType; // timing of opening and closing of the hall
  capacity: string; // obvio
  seating: string; // obvio
  pricing: number | undefined; // pricing. can be either price per time OR ask manager for final qoutation
  additionalFeatures: EachHallAdditonalFeaturesType[]; // additional features and amenities for the hall
  images: string[]; // array of images of the hall. should be in a file storage. PLS DONT STORE BASE64
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
