import { Express, NextFunction, Request, Response } from "express";
import {
  addHallHandler,
  removeHallHandler,
  editHallHandler,
} from "./controller/hall.controller";
import {
  createAdminHandler,
  getAdminHandler,
  loginAdminHandler,
  logoutAdminHandler,
} from "./controller/admin.controller";
import { validateRequest, validateCookie } from "./middleware/validator";
import {
  AddHallZodSchema,
  RemoveHallZodSchema,
} from "./schema/hall.schema";
import {
  CreateAdminZodSchema,
  LoginAdminZodSchema,
} from "./schema/admin.schema";
import { requireMasterRole } from "./middleware/accessControl";

export default function routes(app: Express) {
  
  app.get("/healthCheck", [
    (req: Request, res: Response) => {
      return res.status(200).send("Hello World");
    },
  ]);

  //Login a admin
  app.post("/loginAdmin", [
    validateRequest(LoginAdminZodSchema),
    loginAdminHandler,
  ]);

  //Create a new admin
  app.post("/createAdmin", [
    validateCookie,
    validateRequest(CreateAdminZodSchema),
    requireMasterRole,
    createAdminHandler,
  ]);

  //Get data of the admin who is sending the requests
  app.get("/getCurrentAdmin", [validateCookie, getAdminHandler]);

  // MAKE: route to get data of a specified user using unique email

  //Add a new hall
  app.post("/addHall", [
    validateCookie,
    requireMasterRole,
    validateRequest(AddHallZodSchema),
    addHallHandler,
  ]);

  //Remove a hall
  app.delete("/removeHall/:id", [
    validateCookie,
    requireMasterRole,
    validateRequest(RemoveHallZodSchema),
    removeHallHandler,
  ]);

  //Edit a hall
  app.post("/editHall/:id", [
    validateCookie,
    requireMasterRole,
    validateRequest(AddHallZodSchema),
    editHallHandler,
  ]);

  //Logout a admin
  app.get("/logoutAdmin", [logoutAdminHandler]);
}
