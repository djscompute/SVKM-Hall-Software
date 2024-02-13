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

export type EachHallPartyAreaType = {
  areaName: string; // name of the sub area in the hall
  capacity: number; // capacity in peoples
  seating: number; // seats
};

export type EachHallAdditonalFeaturesType = {
  heading: string; // heading of the additional feature. (eg. PODIUM )
  desc: string; // description about what the feature is
  stats: string[]; // stats about the feature for example dimensions, duration, anything
  price?: number; //  price obviously per hour or something.
};

// ================================================
// this will be in Halls Table
// ================================================
export type EachHallType = {
  id: string; // UNIQUE KEY. This will be used to query Booking table in a certain time frame.
  location: EachHallLocationType; // location of the hall
  about: string[]; // description of the hall. can be buletins
  timings: EachHallTimingType; // timing of opening and closing of the hall
  partyArea: EachHallPartyAreaType[]; // sub areas spaces alloted in the  hall
  pricing: number | undefined; // pricing. can be either price per time OR ask manager for final qoutation
  additionalFeatures: EachHallAdditonalFeaturesType[]; // additional features and amenities for the hall
  images: string[]; // array of images of the hall. should be in a file storage. PLS DONT STORE BASE64
};

// ================================================
// This will be in Customers Table
// ================================================
export type CustomerType = {
  id: string; // unique customer id
  name: string; // name
  email?: string; // email ( maybe UNIQUE KEY )
  aadharNo?: string; // adhar no. ( dont know if this is required )
  panNo?: string; // pan no. ( dont know if this is required )
  address?: string; // address
  mobile?: string; // mobile number ( maybe UNIQUE )
};

// ================================================
// This will be in Bookings Table
// ================================================
export type HallBookingType = {
  id: string; // UNIQUE KEY
  user: CustomerType; // the User who booked this hall
  features: EachHallAdditonalFeaturesType[]; // the Ammenities which the user has booked for himself
  partyArea: EachHallPartyAreaType[]; // the Areas which he has booked for himself
  status: "CONFIRMED" | "TENTATIVE" | "EMPTY" | "DISABLED"; // payment and booking status is reflected here
  price: number; // obvio bro
  date: {
    from: string; // start date
    to: string; // end date
  };
  time: {
    from: string; // start time
    to: string; // end time
  };
};

// ================================================
// This will be in Users Table
// ================================================

export type UserType = {
  id: string; // UNIQUE KEY
  role: "MANAGER" | "MASTER"; // obvio
  password: string; // hashed
  lastOnline: string; // not needed but daal denge
  Halls: string[]; // will be id of the halls he has access to
};

// ================================================
// This will be in Messages Table
// ================================================

export type MessageType = {
  id: string; // UNIQUE KEY
  to: string; // id of the Manager
  content: string; // anything. Maybe MarkDown. or InnerHtml
  created_at: string; // obvio
  read: boolean; // obvio
};

// operations required in the database
// 1. Create / Update a New Hall
// 2. User applies for a date in the calender. Bookings Table Create
// 3. Check for unread messages with to as a managers id
// 4. Get a months or days booking from the booking table with a filter for hall id
// and many more to think about
