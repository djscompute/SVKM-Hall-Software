import { Express, Request, Response } from "express";
import {
  addHallHandler,
  removeHallHandler,
  editHallHandler
} from "./controller/hall.controller";
import {
  createAdminHandler,
  getAdminHandler,
  loginAdminHandler,
  logoutAdminHandler,
} from "./controller/admin.controller";
import { validateRequest, validateCookie } from "./middleware/validator";
import { AddHallZodSchema, RemoveHallZodSchema, EditHallZodSchema } from "./schema/hall.schema";
import { CreateAdminZodSchema, LoginAdminZodSchema } from "./schema/admin.schema";

export default function routes(app: Express) {
  //heathcheck route
  app.get("/healthCheck", [
    (req: Request, res: Response) => {
      return res.status(200).send("Hello World");
    },
  ]);

  //Create a new admin
  app.post("/createAdmin", [
    validateRequest(CreateAdminZodSchema),
    createAdminHandler,
  ]);

  //Login a admin
  app.post("/loginAdmin", [
    validateRequest(LoginAdminZodSchema),
    loginAdminHandler,
  ]);

  //Get admin data
  app.get("/getAdmin", [
    validateCookie,
    getAdminHandler
  ]);

  //Add a new hall
  app.post("/addHall", [
    // validateCookie,
    validateRequest(AddHallZodSchema),
    addHallHandler,
  ]);

  //Remove a hall
  app.delete("/removeHall/:id", [
    validateCookie,
    validateRequest(RemoveHallZodSchema),
    removeHallHandler,
  ]);

  //Edit a hall
  app.delete("/editHall/:id", [
    validateCookie,
    validateRequest(EditHallZodSchema),
    editHallHandler,
  ]);

  //Logout a admin
  app.get("/logoutAdmin", [logoutAdminHandler]);
}
