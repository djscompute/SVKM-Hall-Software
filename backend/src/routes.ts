import { Express, NextFunction, Request, Response } from "express";

import multer from "multer";
import {
  addHallHandler,
  removeHallHandler,
  editHallHandler,
  getAllHallsHandler,
  getHallByIdHandler,
  deleteHallHandler
} from "./controller/hall.controller";
import {
  createAdminHandler,
  deleteAdminByIdHandler,
  getAdminByEmailHandler,
  getAdminByIdHandler,
  getAdminHandler,
  getAdmins,
  getHallsforAdminHandler,
  getManagerByHallId,
  loginAdminHandler,
  logoutAdminHandler,
  updateAdminByIdHandler,
} from "./controller/admin.controller";
import { validateRequest, validateCookie, validateLogin } from "./middleware/validator";
import { AddHallZodSchema, RemoveHallZodSchema } from "./schema/hall.schema";
import {
  CreateAdminZodSchema,
  DeleteAdminZodSchema,
  EmailAdminZodSchema,
  IdAdminZodSchema,
  LoginAdminZodSchema,
  UpdateAdminZodSchema,
} from "./schema/admin.schema";
import {
  requireManagerRole,
  requireMasterRole,
} from "./middleware/accessControl";
import {
  AddBookingZodSchema,
  getBookingsByHallZodSchema,
  RemoveBookingZodSchema,
  getBookingByIdZodSchema,
  getBookingZodSchema,
  getBookingsByHallAndUserZodSchema,
  EmailZodSchema,
  InquirySchema,
  ConfirmationSchema
} from "./schema/booking.schema";
import {
  addBookingHandler,
  editBookingHandler,
  generateInquiryHandler,
  generateConfirmationHandler,
  getBookingByIdHandler,
  getBookingHandler,
  getBookingHandlerWithoutUser,
  getBookingsByHallHandler,
  getBookingsByUserandHallHandler,
  removeBookingHandler,
  sendEmailHandler,
} from "./controller/booking.controller";

//Constants
import { ConstantsZodSchema } from "./schema/constants.schema";
import { createConstantHandler, getAllConstantsHandler, updateConstantByNameHandler, deleteConstantByNameHandler } from "./controller/constants.controller";

// ImageHandler
import { uploadImageHandler } from "./controller/image.controller";
import { UploadImageZodSchema } from "./schema/image.schema";
import { 
  getAdditionalFeatureReportHandler,
  getAllHallNamesAndIdsHandler,
  getBookingConfirmationReportHandler,
  getBookingInformationReportHandler,
  getBookingTypeCountsHandler, 
  getCollectionDetailsHandler,
  getHallBookingsCountHandler, 
  getHallInformationReportHandler, 
  getInteractionCountHandler,
  getMonthwiseCollectionDetailsHandler,
  getSessionWiseBookingHandler,
  getSessionsWithCategoriesByHallNameHandler
} from "./controller/dashboard.controller";
import { getAllHallNamesAndIds } from "./service/getHallConfig";

import { MultipleBookingSchema, CheckBookingInMultipleSchema } from "./schema/multipleBooking.schema";
import { addMultipleBookingHandler, getMultipleBookingHandler,  checkBookingInMultipleHandler } from "./controller/multipleBooking.controller";
//try 
import { getSessionName } from "./service/getSessionName";

// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage: multer.memoryStorage() });

export default function routes(app: Express) {
  app.get("/healthCheck", [
    (req: Request, res: Response) => {
      return res.status(200).send("Hello World");
    },
  ]);

  //Chek if user is logged in
  app.get("/isLoggedIn", [validateLogin, (req: Request, res: Response) => {
    return res.status(200).json({ isLoggedIn: true });
  }]);

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

  //Get all admins
  app.get("/getAllAdmins", [
    validateCookie,
    requireMasterRole,
    getAdmins,
  ]);

  //Get data of the admin who is sending the requests
  app.get("/getCurrentAdmin", [validateCookie, getAdminHandler]);

  // GET DATA OF A SPECIFIED USER USING UNIQUE EMAIL
  app.get("/getAdmin/email/:email", [
    validateCookie,
    validateRequest(EmailAdminZodSchema),
    requireMasterRole,
    getAdminByEmailHandler,
  ]);

  // GET DATA OF A SPECIFIED USER USING UNIQUE _ID
  app.get("/getAdmin/id/:id", [
    validateCookie,
    validateRequest(IdAdminZodSchema),
    requireMasterRole,
    getAdminByIdHandler,
  ]);

  app.post("/updateAdmin", [
    validateCookie,
    validateRequest(UpdateAdminZodSchema),
    requireMasterRole,
    updateAdminByIdHandler,
  ])
  app.post("/deleteAdmin", [
    validateCookie,
    validateRequest(DeleteAdminZodSchema),
    requireMasterRole,
    deleteAdminByIdHandler,
  ]);
  //Constants routes
  app.post("/createConstant", [
    validateCookie,
    validateRequest(ConstantsZodSchema),
    requireMasterRole,
    createConstantHandler,
  ]);
  app.get("/getAllConstants", [
    validateCookie,
    requireMasterRole,
    getAllConstantsHandler,
  ]);
  app.post("/updateConstant" ,[
    validateCookie,
    validateRequest(ConstantsZodSchema),
    requireMasterRole,
    updateConstantByNameHandler
    ])
    app.delete("/deleteConstant", [
      validateCookie,
      requireMasterRole,
      deleteConstantByNameHandler,
    ]);




  //Add a new hall
  app.post("/addHall", [
    validateCookie,
    requireMasterRole,
    validateRequest(AddHallZodSchema),
    addHallHandler,
  ]);

  //Remove Hall completely
  app.delete("/halls/:id", [
    validateCookie,
    requireMasterRole,
    validateRequest(RemoveHallZodSchema),
    deleteHallHandler,
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
    validateRequest(RemoveHallZodSchema),
    validateRequest(AddHallZodSchema),
    editHallHandler,
  ]);

  // GET ALL HALLS
  app.get("/getAllHalls/", [getAllHallsHandler]);

  // GET INFO OF ONE HALL WITH _id
  app.get("/getHall/:id", [
    validateRequest(RemoveHallZodSchema),
    getHallByIdHandler,
  ]);

  // FUTURE: GET ALL HALLS WHOM THE MANAGER HAS ACCESS TO
  app.get("/getHallsforAdmin/:email", [
    validateCookie,
    requireManagerRole,
    validateRequest(EmailAdminZodSchema),
    getHallsforAdminHandler,
  ]);

  app.post("/addBooking", [
    validateRequest(AddBookingZodSchema),
    addBookingHandler,
  ]);

  app.post("/editBooking/:id", [
    validateCookie,
    requireManagerRole,
    validateRequest(RemoveBookingZodSchema),
    validateRequest(AddBookingZodSchema),
    // validateRequest(EditBookingZodSchema),
    editBookingHandler,
  ]);

  app.post("/removeBooking/:id", [
    validateCookie,
    requireMasterRole,
    validateRequest(RemoveBookingZodSchema),
    removeBookingHandler,
  ]);

  //Get Booking between from and to
  app.get("/getBooking", [
    validateRequest(getBookingZodSchema),
    getBookingHandler,
  ]);

  //Get Booking between from and to without user
  app.get("/getBookingWithoutUser", [
    validateRequest(getBookingZodSchema),
    getBookingHandlerWithoutUser,
  ]);

  //Get Booking by ID
  app.get("/getBookingByID", [
    validateRequest(getBookingByIdZodSchema),
    getBookingByIdHandler,
  ]);

  // Get Booking by hall ID
  app.get("/getBookingByHall/:hallId", [
    validateRequest(getBookingsByHallZodSchema),
    getBookingsByHallHandler
  ]);
  // Get Booking By Hall and User
  app.get("/getBookingByHallAndUser/:userPhone/:HallId", [
    // validateRequest(getBookingsByHallAndUserZodSchema),
    getBookingsByUserandHallHandler
  ]);

  // Multiple Booking routes
  app.post("/multipleBookings", [
    validateRequest(MultipleBookingSchema),
    addMultipleBookingHandler
  ]);

  app.get("/multipleBookings/:id", getMultipleBookingHandler);

  app.get("/checkBookingInMultiple/:id", [
    validateRequest(CheckBookingInMultipleSchema),
    checkBookingInMultipleHandler
  ]);

  //Logout a admin
  app.get("/logoutAdmin", [logoutAdminHandler]);

  //Uploading image
  app.post(
    "/uploadImage",
    validateCookie,
    requireMasterRole,
    validateRequest(UploadImageZodSchema),
    upload.single("image"),
    uploadImageHandler
  );



  {/********************* Dashboard Routes Begin *********************/}
  app.post(
    "/dashboard/getHallWiseBookingsCount",
    validateCookie,
   
    getHallBookingsCountHandler
  )
  app.post(
    "/dashboard/getSessionWiseBookings",
    validateCookie,
    
    getSessionWiseBookingHandler
  )
  app.post(
    "/dashboard/getBookingTypeCounts",
    validateCookie,
    
    getBookingTypeCountsHandler
  )
  app.post(
    "/dashboard/getCollectionDetails",
    validateCookie,
    
    getCollectionDetailsHandler
  )
  app.post(
    "/dashboard/getMonthwiseCollectionDetails",
    validateCookie,
   
    getMonthwiseCollectionDetailsHandler
  )
  app.post(
    "/dashboard/getTotalInteraction",
    validateCookie,
    
    getInteractionCountHandler
  )
  app.post(
    "/dashboard/generateBookingInformationReport",
    validateCookie,
    
    getBookingInformationReportHandler
  )
  app.post(
    "/dashboard/generateBookingConfirmationReport",
    // validateCookie,
    // requireMasterRole,
    getBookingConfirmationReportHandler,
  )
  app.post(
    "/dashboard/generateAdditionalFeatureReport",
    validateCookie,
    
    getAdditionalFeatureReportHandler
  )

  app.post(
    "/dashboard/generateHallInformationReport",
    validateCookie,
    
    getHallInformationReportHandler
  )
  {/********************* Dashboard Routes End *********************/}

  {/********************* Helper Routes Begin *********************/}
  app.get(
    '/getAllHallNameID',
    getAllHallNamesAndIdsHandler
  )
  app.get(
    '/getSessionAndCategoryByHall',
    getSessionsWithCategoriesByHallNameHandler
  )

  app.get(
    '/getManagerByHallId',
    validateRequest(getBookingByIdZodSchema),
    getManagerByHallId,
  )
  {/********************* Helper Routes End*********************/}

  {/********************* Email Routes Begin *********************/}

  app.post(
    "/generateInquiry",
    validateRequest(InquirySchema),
    generateInquiryHandler,
  )

  app.post(
    "/generateConfirmation",
    validateRequest(ConfirmationSchema),
    generateConfirmationHandler,
  )

  app.post(
    "/sendEmail",
    validateRequest(EmailZodSchema),
    sendEmailHandler,
  )
  {/********************* Email Routes End *********************/}

}
