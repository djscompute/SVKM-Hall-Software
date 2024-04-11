import { Request, Response } from "express";
import logger from "../utils/logger";
import createUser from "../service/createAdmin";
import authenticateUser from "../service/authAdmin";
import { signAccessToken, signRefreshToken } from "../utils/signToken";
import {getUserDatabyEmail, getUserDatabyUsername, getUserDatabyId} from "../service/getAdminData";
import { updateUserById } from "../service/updateAdminData";
import { createSession } from "../service/createSession";
import { deleteSession } from "../service/deleteSession";
import { AuthenticatedRequest } from "../types/requests";
import { HallModel } from "../models/hall.model";
import { adminType } from "../models/admin.model";


export async function updateAdminByIdHandler(req: Request, res: Response) {
  try {
    const { _id, ...updateData } = req.body;

    const existingUser = await getUserDatabyId(_id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (updateData.email) {
      const existingUserByEmail = await getUserDatabyEmail(updateData.email);
      if (existingUserByEmail._id && existingUserByEmail._id.toString() !== _id) {
        return res.status(409).json({ error: 'Admin with this email already exists' });
      }
    }

    if (updateData.username) {
      const existingUserByUsername = await getUserDatabyUsername(updateData.username);
      if (existingUserByUsername._id && existingUserByUsername._id.toString() !== _id) {
        return res.status(409).json({ error: 'Admin with this username already exists' });
      }
    }

    const updatedUser = await updateUserById(_id, updateData);

    if (!updatedUser) {
      return res.status(500).json({ error: 'Failed to update user' });
    }

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('Error updating user by id:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



export async function createAdminHandler(req: Request, res: Response) {
  try {
    const { email, username } = req.body;

    const existingUserByEmail: Omit<adminType, "password"> = await getUserDatabyEmail(email);
    if (!isOmittedAdminTypeEmpty(existingUserByEmail)) {
      return res.status(409).json({ error: "Admin with this email already exists" });
    }

    const existingUserByUsername: Omit<adminType, "password"> = await getUserDatabyUsername(username);
    if (!isOmittedAdminTypeEmpty(existingUserByUsername)) {
      return res.status(409).json({ error: "Admin with this username already exists" });
    }

    const userInstance = await createUser(req.body);
    res.status(200).json(userInstance);

  } catch (error: any) {
    logger.error(error);
    res.status(400).json({ name: error.name, message: error.message });
  }
}

// Function to check if Omit<adminType, "password"> object is empty
function isOmittedAdminTypeEmpty(obj: Omit<adminType, "password">): boolean {
  return Object.keys(obj).length === 0;
}

export async function loginAdminHandler(req: Request, res: Response) {
  try {
    const userInstance = await authenticateUser(req.body);

    //Signing Jwts
    signAccessToken(res, {
      email: userInstance.email,
      username: userInstance.username,
      role: userInstance.role,
    });
    signRefreshToken(res, {
      email: userInstance.email,
      username: userInstance.username,
      role: userInstance.role,
    });

    //Creating a new session
    // await createSession(req,req.body.email,refreshToken)

    res.status(200).json(userInstance);
  } catch (error: any) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      res.status(409).json({ error: "User with this email already exists" });
    }
    logger.error(error);
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function getAdminHandler(req: Request, res: Response) {
  // get the info of the admin
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const email: string = authenticatedReq.userEmail;
    const userInstance = await getUserDatabyEmail(email);

    // if (!userInstance) res.status(404).json({ error: "User not found" });

    res.status(200).json(userInstance);
  } catch (error: any) {
    logger.error(error);
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function logoutAdminHandler(req: Request, res: Response) {
  try {
    //Clearing Cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    //Deleting Session
    //@ts-ignore
    // await deleteSession(req.userEmail);

    res.sendStatus(200);
  } catch (error: any) {
    logger.error(error);
    res.status(400).json({ name: error.name, message: error.message });
  }
}

export async function getAdminByIdHandler(req: Request, res: Response) {
  try {
    const userId = req.params.id; 

    const user = await getUserDatabyId(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching user by id:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export async function getAdminByEmailHandler(req: Request, res: Response) {
  try {
    const userEmail = req.params.email;

    const user = await getUserDatabyEmail(userEmail);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching user by email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function getAdminByUsernameHandler(req: Request, res: Response) {
  try {
    const userUsername = req.params.username;

    const user = await getUserDatabyUsername(userUsername);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching user by username:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getHallsforAdminHandler(req: Request, res: Response) {
  try {
    const userEmail = req.params.email;

    const user = await getUserDatabyEmail(userEmail);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const managedHalls = user.managedHalls || null;

    const allManagedHallsArray = await Promise.all(
      managedHalls?.map(async (eachHallId) => {
        const hall = await HallModel.findById(eachHallId);
        return hall;
      }) || []
    );

    return res.status(200).json(allManagedHallsArray);
  } catch (error: any) {
    console.error("Error fetching user by email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
