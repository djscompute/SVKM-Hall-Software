import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

//type-admin
export interface adminType extends mongoose.Document {
  readonly _id: mongoose.Types.ObjectId;
  role: string;
  username: string;
  email: string;
  password: string;
  managedHall?: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  comparePasswords(email: string, password: string): Promise<adminType>;
}


// export type EachHallType = {
//   id: string; // UNIQUE KEY. This will be used to query Booking table in a certain time frame.
//   location: EachHallLocationType; // location of the hall
//   about: string[]; // description of the hall. can be buletins
//   timings: EachHallTimingType; // timing of opening and closing of the hall
//   partyArea: EachHallPartyAreaType[]; // sub areas spaces alloted in the  hall
//   pricing: number | undefined; // pricing. can be either price per time OR ask manager for final qoutation
//   additionalFeatures: EachHallAdditonalFeaturesType[]; // additional features and amenities for the hall
//   images: string[]; // array of images of the hall. should be in a file storage. PLS DONT STORE BASE64
// };

//type-hall
// export interface hallType extends mongoose.Document {
//   readonly _id: mongoose.Types.ObjectId;
//   name: string;
//   location: string;
//   capacity: string;
//   facilities?: string[];
//   cost: string;
//   readonly createdAt: Date;
//   readonly updatedAt: Date;
// }

// Schema-admin
const adminSchema = new mongoose.Schema<adminType>(
  {
    role: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    managedHall: { type: String },
  },
  { timestamps: true }
);



// // Schema-hall
// const hallSchema = new mongoose.Schema<hallType>(
//   {
//     name: { type: String, required: true },
//     location: { type: String, required: true },
//     capacity: { type: String, required: true },
//     facilities: { type: [String] },
//     cost: { type: String, required: true },
//   },
//   { timestamps: true }
// );

//Password Encryption
adminSchema.pre("save", async function (next) {
  const admin = this as adminType;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(
      admin.password,
      config.get<string>("SALTROUNDS")
    );
    return next();
  }
  return next();
});

//Verifying Password
adminSchema.method(
  "comparePasswords",
  async function (
    inputEmail: string,
    inputPassword: string
  ): Promise<adminType> {
    const admin: adminType | null = await Admin.findOne({ email: inputEmail });
    // console.log(admin);
    if (admin) {
      const auth: boolean = await bcrypt.compare(inputPassword, admin.password);
      if (!auth) {
        throw Error("Your password is incorrect !!");
      } else {
        return admin;
      }
    }
    throw new Error("Your email is not registered !!");
  }
);

const Admin = mongoose.model<adminType>("admin", adminSchema);
// export const Hall = mongoose.model<hallType>("hall", hallSchema);
export default Admin;
