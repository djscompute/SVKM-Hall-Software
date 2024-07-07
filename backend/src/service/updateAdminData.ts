import Admin, { adminType } from "../models/admin.model";
import _ from "lodash";

export async function updateUserById(userId: string, updateData: Partial<adminType>){
  try {
    const userToUpdate = await Admin.findById(userId);
    if(userToUpdate == null){
        return null
    }
    Object.assign(userToUpdate, updateData)
    const updatedUser = await userToUpdate.save()
    const result = _.omit(JSON.parse(JSON.stringify(updatedUser)), [
        "password",
        "__v",
      ]) as Pick<adminType, "role" | "username" | "email" | "managedHalls"| "contact">;
      return result;
  } catch (error) {
    console.error("Error updating user by id:", error);
    return null;
  }
}

export async function deleteAdminById(id: string) {
  try {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      throw new Error("Admin not found");
    }
    return admin;
  } catch (error) {
    throw error;
  }
}