import Admin, { adminType } from "../models/admin.model";
import _ from "lodash";

export default async function createUser(
  payload: Pick<adminType,"role" | "username" | "email" | "password" | "managedHalls" | "contact">
) {
  const user = await Admin.create(payload);
  const result = _.omit(JSON.parse(JSON.stringify(user)), [
    "password",
    "__v",
  ]) as Pick<adminType, "role" | "username" | "email" | "managedHalls"| "contact">;
  return result;
}

// <adminType, keyof adminType>
