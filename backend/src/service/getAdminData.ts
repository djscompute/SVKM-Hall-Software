import User, { adminType } from "../models/admin.model";
import _ from "lodash";

export async function getUserDatabyEmail(email: string) {
  const temp = await User.findOne({ email });
  return _.omit(JSON.parse(JSON.stringify(temp)), "password") as Omit<adminType, "password">
}

export async function getUserDatabyUsername(username: string) {
  const temp = await User.findOne({ username });
  return _.omit(JSON.parse(JSON.stringify(temp)), "password") as Omit<adminType, "password">
}

