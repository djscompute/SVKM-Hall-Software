import { z } from "zod";

const stringErrorHandler = (fieldName: string) => ({
  invalid_type_error: `${fieldName} can only be a string.`,
  required_error: `${fieldName} cannot be empty.`,
});
const numberErrorHandler = (fieldName: string) => ({
  invalid_type_error: `${fieldName} can only be a number.`,
  required_error: `${fieldName} cannot be empty.`,
});
const booleanErrorHandler = (fieldName: string) => ({
  invalid_type_error: `${fieldName} can only be a boolean.`,
  required_error: `${fieldName} cannot be empty.`,
});

export const AddBookingZodSchema = z.object({
  body: z.object({
    date: z.string().optional(),
    user: z.object({
      username: z.string(stringErrorHandler("name")),
      contact: z.string(stringErrorHandler("person")),
      email: z.string(stringErrorHandler("email")).email(),
      gstNo: z.string(stringErrorHandler("gstNo")).optional(),
      panNo: z.string(stringErrorHandler("panNo")).optional(),
      address: z.string(stringErrorHandler("address")).optional(),
      mobile: z.string(stringErrorHandler("mobile")),
      remark: z.string(stringErrorHandler("remark")).optional(),
    }),
    features: z.array(
      z.object({
        heading: z.string(stringErrorHandler("heading")),
        desc: z.string(stringErrorHandler("desc")).optional(),
        stats: z.array(z.string(stringErrorHandler("stats"))).optional(),
        price: z.number(numberErrorHandler("price")),
      })
    ),
    status: z.enum(["CONFIRMED", "TENTATIVE", "CANCELLED", "ENQUIRY"]),
    price: z.number(numberErrorHandler("price")),
    transaction: z
      .object({
        type: z.string(stringErrorHandler("type")).optional(),
        date: z.string(stringErrorHandler("date")).optional(),
        transactionID: z.string(stringErrorHandler("transactionID")).optional(),
        payeeName: z.string(stringErrorHandler("payeeName")).optional(),
        utrNo: z.string(stringErrorHandler("utrNo")).optional(),
        chequeNo: z.string(stringErrorHandler("chequeNo")).optional(),
        bank: z.string(stringErrorHandler("bank")).optional(),
      })
      .optional(),
    baseDiscount: z.number(numberErrorHandler("baseDiscount")).min(0, {message: "Discount can't be below 0"}).max(100, {message: "Discount can't exceed 100"}),
    deposit: z.number(numberErrorHandler("deposit")),
    isDeposit: z.boolean(booleanErrorHandler("isDeposit")),
    depositDiscount: z.number(numberErrorHandler("depositDiscount")).min(0, {message: "Discount can't be below 0"}).max(100, {message: "Discount can't exceed 100"}),
    hallId: z.string(stringErrorHandler("hallId")),
    session_id: z.string(stringErrorHandler("session_id")),
    booking_type: z.string(stringErrorHandler("booking_type")),
    from: z.string(stringErrorHandler("from")),
    to: z.string(stringErrorHandler("to")),
    purpose: z.string(stringErrorHandler("purpose")),
    cancellationReason: z
      .string(stringErrorHandler("cancellationReason"))
      .optional(),
    enquiryNumber: z.string(stringErrorHandler("enquiryNumber")).optional(),
  }),
});

export const RemoveBookingZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Id cannot be empty",
      invalid_type_error: "Id should be a string value.",
    }),
  }),
  // cancellationReason: z.string(),
});

//Zod Schema for getting a session by {from, to}
export const getBookingZodSchema = z.object({
  query: z.object({
    from: z.string().refine((from) => from.trim() !== "", {
      message: "from cannot be empty",
      path: ["from"],
    }),
    to: z.string().refine((to) => to.trim() !== "", {
      message: "to cannot be empty",
      path: ["to"],
    }),
    hallId: z.string({
      required_error: " hallIdcannot be empty",
      invalid_type_error: "hallId should be a string value.",
    }),
  }),
});

//Zod schema for getting a session by ID
export const getBookingByIdZodSchema = z.object({
  query: z.object({
    _id: z.string(),
  }),
});

export const EmailZodSchema = z.object({
  body: z.object({
    to: z.string(),
    subject: z.string(),
    text: z.string(),
    filename: z.string(),
    path: z.string().optional(),
  }),
});

export const InquirySchema = z.object({
  body: z.object({
    date: z.string(),
    customerName: z.string(),
    contactPerson: z.string(),
    contactNo: z.string(),
    enquiryNumber: z.string(),
    hallName: z.string(),
    hallLocation: z.string(),
    dateOfEvent: z.string(),
    slotTime: z.string(),
    sessionName: z.string(),
    purposeOfBooking: z.string(),
    hallCharges: z.number(),
    additionalFacilities: z.number(),
    hallDeposit: z.number(),
    totalPayable: z.number(),
    managerEmail: z.string(),
    managerName: z.string(),
  }),
});

export const ConfirmationSchema = z.object({
  body: z.object({
    date: z.string(),
    customerName: z.string(),
    contactPerson: z.string(),
    contactNo: z.string(),
    enquiryNumber: z.string(),
    gstNo: z.string(),
    pan: z.string(),
    modeOfPayment: z.string(),
    additionalPaymentDetails: z.string().optional(),
    hallName: z.string(),
    hallLocation: z.string(),
    dateOfEvent: z.string(),
    slotTime: z.string(),
    sessionType: z.string(),
    purposeOfBooking: z.string(),
    hallCharges: z.number(),
    additionalFacilities: z.number(),
    discountPercent: z.number().min(0, {message: "Discount can't be below 0"}).max(100, {message: "Discount can't exceed 100"}),
    sgst: z.number(),
    cgst: z.number(),
    hallDeposit: z.number(),
    depositDiscount: z.number().min(0, {message: "Discount can't be below 0"}).max(100, {message: "Discount can't exceed 100"}),
    totalPayable: z.number(),
    email: z.string().email(), // Ensuring a valid email format
    managerEmail: z.string(),
    managerName: z.string(),
  }),
});
export const getBookingsByHallZodSchema = z.object({
  params: z.object({
    hallId: z.string({
      invalid_type_error: "Hall ID must be a string.",
      required_error: "Hall ID is required.",
    }),
  }),
});
export const getBookingsByHallAndUserZodSchema = z.object({
  params: z.object({
    hallId: z.string({
      invalid_type_error: "Hall ID must be a string.",
      required_error: "Hall ID is required.",
    }),
  }),
});

// THIS IS A FUNCITON TO CREATE UTC STANDARD TIME DATETIME STRING.
// ZOD SUPPORTS ONLY UTC STANDARD TIME
// function createDateTimeString(year:number, month:number, day:number, hour:number) {
//   // hour is in 24 hours format
//   const date = new Date(Date.UTC(year, month - 1, day, hour, 0, 0));
//   const dateTimeString = date.toISOString();
//   return dateTimeString;
// }

// // Example usage
// const datetimeString = createDateTimeString(2024, 2, 22, 0);
// console.log(datetimeString); // Output: "2020-01-01T00:00:00.000Z"

// EXAMPLE
// from : 2024-02-22T00:00:00.000Z
// to :   2024-02-22T10:00:00.000Z