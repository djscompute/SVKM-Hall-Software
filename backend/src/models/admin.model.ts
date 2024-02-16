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
  managedHall?: string;
  comparePasswords(email: string, password: string): Promise<adminType>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
//type-customer
export interface customerType extends mongoose.Document {
  readonly _id: mongoose.Types.ObjectId;
  username: string;
  email?: string;
  phone?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
//type-hall
export interface hallType extends mongoose.Document {
  readonly _id: mongoose.Types.ObjectId;
  name: string;
  location: string;
  capacity: string;
  facilities?: string[];
  cost: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Schema-admin
const adminSchema = new mongoose.Schema<adminType>(
  {
    role: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    managedHall: { type: String }
  },
  { timestamps: true }
);

// Schema-customer
const customerSchema = new mongoose.Schema<customerType>(
  {
    username: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
  },
  { timestamps: true }
);

// Schema-hall
const hallSchema = new mongoose.Schema<hallType>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true},
    capacity: { type: String, required: true},
    facilities: { type: [String] },
    cost: {type: String, required: true }
  },
  { timestamps: true }
);

//Password Encryption
adminSchema.pre("save", async function(next) {
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
  async function(
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
export const Hall = mongoose.model<hallType>("hall", hallSchema);
export default Admin;
