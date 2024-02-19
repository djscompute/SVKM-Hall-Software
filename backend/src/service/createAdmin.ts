import Admin, { adminType } from "../models/admin.model";
import _ from "lodash";

export default async function createUser(
  payload: Pick<adminType,"role" | "username" | "email" | "password" | "managedHalls">
) {
  const user = await Admin.create(payload);
  const result = _.omit(JSON.parse(JSON.stringify(user)), [
    "password",
    "__v",
  ]) as Pick<adminType, "_id" | "role" | "username" | "email" | "password" | "managedHalls">;
  return result;
}

// <adminType, keyof adminType>
