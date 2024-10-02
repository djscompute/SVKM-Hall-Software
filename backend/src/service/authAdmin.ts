import User, { adminType } from "../models/admin.model";
import _ from "lodash";

export default async function authenticateUser(
  payload: Pick<adminType, "email" | "password">
) {
  const user = new User();
  const userInstance = await user.comparePasswords(
    payload.email,
    payload.password
  );
  let result = _.omit(JSON.parse(JSON.stringify(userInstance)), [
    "password",
  ]) as Omit<adminType, "password">;
  return result;
}
