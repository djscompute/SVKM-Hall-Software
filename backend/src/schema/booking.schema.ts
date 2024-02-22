import { z } from "zod";

const stringErrorHandler = (fieldName: string) => ({
  invalid_type_error: `${fieldName} can only be a string.`,
  required_error: `${fieldName} cannot be empty.`,
});

export const AddBookingZodSchema = z.object({
  body: z.object({
    user: z.object({
      name: z.string(stringErrorHandler("name")),
      email: z.string(stringErrorHandler("email")).email().optional(),
      aadharNo: z.string(stringErrorHandler("aadharNo")).optional(),
      panNo: z.string(stringErrorHandler("panNo")).optional(),
      address: z.string(stringErrorHandler("address")).optional(),
      mobile: z.string(stringErrorHandler("mobile")),
    }),
    features: z.array(
      z.object({
        heading: z.string(stringErrorHandler("heading")),
        desc: z.string(stringErrorHandler("desc")).optional(),
        stats: z.array(z.string(stringErrorHandler("stats"))).optional(),
        price: z.number(stringErrorHandler("price")),
      })
    ),
    status: z.enum(["CONFIRMED", "TENTATIVE", "EMPTY", "DISABLED"]),
    price: z.number(stringErrorHandler("price")),
    hallId: z.string(stringErrorHandler("hallId")),
    session_id: z.string(stringErrorHandler("session_id")),
    from: z.string(stringErrorHandler("from")).datetime(),
    to: z.string(stringErrorHandler("to")).datetime(),
    time: z.object({
      from: z.string(stringErrorHandler("time.from")),
      to: z.string(stringErrorHandler("time.to")),
    }),
  }),
});

//Zod Schema for getting a session by {from, to}
export const getSessionZodSchema = z.object({
  query: z.object({
    from: z.string().refine((from) => from.trim() !== '', {
      message: "from cannot be empty",
      path: ['from'],
    }),
    to: z.string().refine((to) => to.trim() !== '', {
      message: "to cannot be empty",
      path: ['to'],
    }),
  }),
});

//Zod schema for getting a session by ID
export const getSessionByIdZodSchema = z.object({
  query: z.object({
    _id: z.string()
  })
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
