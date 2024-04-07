///////////////////////////////////////////////////////////////////////
// CAN BE OUT DATED
// REFER MODELS FOLDER
///////////////////////////////////////////////////////////////////////

export type EachHallLocationType = {
  readonly _id?: string;
  desc1: string; // short form of the location
  desc2: string; // full address of the location
  gmapurl?: string; // google map url for the place
  iframe?: string; // google map iframe embed to display on page
};

export type EachHallAdditonalFeaturesType = {
  readonly _id?: string;
  heading: string; // heading of the additional feature. (eg. PODIUM )
  desc: string; // description about what the feature is
  stats?: string[]; // stats about the feature for example dimensions, duration, anything
  price: number; //  price obviously per hour or something.
};

export type EachHallSessionType = {
  readonly _id?: string;
  active: boolean;
  name: string;
  from: string;
  to: string;
  price: { categoryName: string; price: number }[];
};

// ================================================
// this will be in Halls Table
// ================================================
export interface EachHallType {
  readonly _id?: string; // UNIQUE KEY. This will be used to query Booking table in a certain time frame.
  name: string; // damn i forgot this
  person: string;
  location: EachHallLocationType; // location of the hall
  about: string[]; // description of the hall. can be buletins
  capacity: string; // obvio
  additionalFeatures?: EachHallAdditonalFeaturesType[]; // additional features and amenities for the hall
  images: string[]; // array of images of the hall. should be in a file storage. PLS DONT STORE BASE64
  sessions: EachHallSessionType[];
  eventRestrictions: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export type bookingStatusType =
  | "CONFIRMED"
  //| "TENTATIVE"
  | "CANCELLED"
  | "ENQUIRY";

// ================================================
// This will be in Bookings Table
// ================================================
export type HallBookingType = {
  readonly _id: string;
  user: CustomerType; // the User who booked this hall
  features: EachHallAdditonalFeaturesType[]; // the Ammenities which the user has booked for himself
  status: bookingStatusType; // payment and booking status is reflected here
  price: number; // obvio bro
  hallId: string;
  session_id: string; // the sesison id
  from: string; // starting time of session
  to: string; // ending time of session
  time: {
    from: string; // start time
    to: string; // end time
  };
  purpose: string //purpose for which the hall is being booked by the user (event type)
};

// ================================================
// This will be in Admin Table
// ================================================

export interface adminType {
  readonly _id: string;
  role: string;
  username: string;
  contact: String;
  email: string;
  password: string;
  managedHalls?: string[];  // id of the halls which he has the access to
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ================================================
// This will be in Customers Table
// ================================================
export type CustomerType = {
  readonly _id: string; // unique customer id
  username: string; // name
  contact: string;
  email?: string; // email ( maybe UNIQUE KEY )
  //aadharNo?: string; // adhar no. ( dont know if this is required )
  //panNo?: string; // pan no. ( dont know if this is required )
  //address?: string; // address
  mobile: string; // mobile number ( maybe UNIQUE )
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
