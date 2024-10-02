import Admin, { adminType } from "../models/admin.model";
import _ from "lodash";

export async function getUsers() {
  const temp = await Admin.find();
  const users = _.map(temp, (user) => _.omit(user.toJSON(), "password"));
  return users as Omit<adminType, "password">[];
}

export async function getUserDatabyEmail(email: string) {
  const temp = await Admin.findOne({ email });
  return _.omit(JSON.parse(JSON.stringify(temp)), "password") as Omit<adminType, "password">
}

export async function getUserDatabyUsername(username: string) {
  const temp = await Admin.findOne({ username });
  return _.omit(JSON.parse(JSON.stringify(temp)), "password") as Omit<adminType, "password">
}
export async function getUserDatabyId(id: string) {
  const temp = await Admin.findById(id);
  return _.omit(JSON.parse(JSON.stringify(temp)), "password") as Omit<adminType, "password">
}

