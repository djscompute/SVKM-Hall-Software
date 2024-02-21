import { z } from "zod";

const stringErrorHandler = (fieldName: string) => ({
  invalid_type_error: `${fieldName} can only be a string.`,
  required_error: `${fieldName} cannot be empty.`,
});

export const AddBookingZodSchema = z.object({
  body: z.object({
    user: z.object({
      name: z.string(stringErrorHandler("name")),
      email: z.string(stringErrorHandler("email")).optional(),
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
    from: z.string(stringErrorHandler("from")),
    to: z.string(stringErrorHandler("to")),
    time: z.object({
      from: z.string(stringErrorHandler("time.from")),
      to: z.string(stringErrorHandler("time.to")),
    }),
  }),
});

//Zod Schema for /getSession route
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
