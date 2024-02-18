import z from "zod";
import { adminType } from "../models/admin.model";

export const CreateAdminZodSchema = z.object({
  body: z
    .object({
      role: z.enum(["MASTER", "MANAGER"]).superRefine((val) => {
        if (val !== "MASTER" && val !== "MANAGER") {
          throw new Error("The role must be either 'MASTER' or 'MANAGER'.");
        }
        return true;
      }),
      username: z
        .string({
          invalid_type_error: "New Admin username can only be a string.",
          required_error: "New Admin username cannot be empty.",
        })
        .min(5),
      email: z
        .string({
          invalid_type_error: "New Admin email can only be string.",
          required_error: "New Admin email cannot be empty.",
        })
        .email("The email is not valid."),
      password: z.string({
        invalid_type_error: "New Admin password can only be a string.",
        required_error: "New Admin password cannot be empty.",
      }),
      managedHall: z.array(z.string()).optional(),
    })
    .strict(),
});

export const LoginAdminZodSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          invalid_type_error: "Admin email can only be string.",
          required_error: "Admin email cannot be empty.",
        })
        .email("Admin email is not valid."),
      password: z.string({
        invalid_type_error: "Admin password can only be string.",
        required_error: "Admin password cannot be empty.",
      }),
    })
    .strict(), // throws error if there is any unknown keys in the input
});

//type
export type CreateAdminReqType = {
  body: Pick<adminType, "username" | "email" | "password">;
};

export type LoginAdminReqType = {
  body: Pick<adminType, "email" | "password">;
};

// type createadminType = z.infer<typeof CreateUserZodSchema>
