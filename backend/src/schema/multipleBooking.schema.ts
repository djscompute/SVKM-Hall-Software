import z from "zod";

const stringErrorHandler = (fieldName: string) => ({
  invalid_type_error: `${fieldName} can only be a string.`,
  required_error: `${fieldName} cannot be empty`,
});

const TransactionSchema = z.object({
  type: z.string(stringErrorHandler("type")).optional(),
  date: z.string(stringErrorHandler("date")).optional(),
  transactionID: z.string(stringErrorHandler("transactionID")).optional(),
  payeeName: z.string(stringErrorHandler("payeeName")).optional(),
  utrNo: z.string(stringErrorHandler("utrNo")).optional(),
  chequeNo: z.string(stringErrorHandler("chequeNo")).optional(),
  bank: z.string(stringErrorHandler("bank")).optional(),
});

export const MultipleBookingSchema = z.object({
  body: z.object({
    booking_ids: z.array(z.string(stringErrorHandler("booking_id"))),
    transaction: TransactionSchema,
    totalPayable: z.number({
      invalid_type_error: "Total payable must be a number.",
      required_error: "Total payable is required.",
    }),
    status: z.enum(["CONFIRMED", "TENTATIVE", "CANCELLED", "ENQUIRY"]),
  }),
});

export const CheckBookingInMultipleSchema = z.object({
  params: z.object({
    id: z.string({
      invalid_type_error: "Booking ID must be a string.",
      required_error: "Booking ID is required.",
    }),
  }),
});

export type MultipleBookingType = z.infer<typeof MultipleBookingSchema>;