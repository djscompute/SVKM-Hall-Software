import { Express, NextFunction, Request, Response } from "express";
import multer from "multer";
import {
  addHallHandler,
  removeHallHandler,
  editHallHandler,
  getAllHallsHandler,
  getHallByIdHandler,
} from "./controller/hall.controller";
import {
  createAdminHandler,
  getAdminByEmailHandler,
  getAdminHandler,
  getHallsforAdminHandler,
  loginAdminHandler,
  logoutAdminHandler,
} from "./controller/admin.controller";
import { validateRequest, validateCookie } from "./middleware/validator";
import { AddHallZodSchema, RemoveHallZodSchema } from "./schema/hall.schema";
import {
  CreateAdminZodSchema,
  EmailAdminZodSchema,
  LoginAdminZodSchema,
} from "./schema/admin.schema";
import { requireMasterRole } from "./middleware/accessControl";
import { AddBookingZodSchema } from "./schema/booking.schema";
import { addBookingHandler } from "./controller/booking.controller";

// ImageHandler
import { uploadImageHandler } from "./controller/image.controller";
import { UploadImageZodSchema } from "./schema/image.schema";

// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage: multer.memoryStorage() });

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

  // GET DATA OF A SPECIFIED USER USING UNIQUE EMAIL
  app.get("/getAdmin/:email", [
    validateCookie,
    validateRequest(EmailAdminZodSchema),
    requireMasterRole,
    getAdminByEmailHandler,
  ]);

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

  // GET ALL HALLS
  app.get("/getAllHalls/", [validateCookie, getAllHallsHandler]);

  // GET INFO OF ONE HALL WITH _id
  app.get("/getHall/:id", [
    validateCookie,
    validateRequest(RemoveHallZodSchema),
    getHallByIdHandler,
  ]);

  // FUTURE: GET ALL HALLS WHOM THE MANAGER HAS ACCESS TO
  app.get("/getHallsforAdmin/:email", [
    validateCookie,
    requireMasterRole,
    validateRequest(EmailAdminZodSchema),
    getHallsforAdminHandler,
  ]);

  app.post("/addBooking", [
    validateRequest(AddBookingZodSchema),
    addBookingHandler,
  ]);

  //Logout a admin
  app.get("/logoutAdmin", [logoutAdminHandler]);

  //Uploading image
  app.post(
    "/uploadImage",
    // validateCookie,
    requireMasterRole,
    validateRequest(UploadImageZodSchema),
    upload.single("image"),
    uploadImageHandler
  );
}
