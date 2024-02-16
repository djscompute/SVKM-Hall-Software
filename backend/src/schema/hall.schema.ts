import z from "zod";
import { hallType } from "../models/admin.model";

export const AddHallZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Title cannot be empty",
      invalid_type_error: "Title should be a string value.",
    }),
    location: z.string(),
    capacity: z.string(),
    facilities: z.array(z.string()).optional(),
    cost: z.string()
  }),
});

export const RemoveHallZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Id cannot be empty",
      invalid_type_error: "Id should be a string value.",
    }),
  }),
});

export const EditHallZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "Id cannot be empty",
      invalid_type_error: "Id should be a string value.",
    }),
  }),
});

//type
export type AddHallType = { body: Pick<hallType, "name" | "location" | "capacity" | "facilities" | "cost"> };
export type RemoveHallType = { body: Pick<hallType, "_id"> };
