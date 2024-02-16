import z from "zod";
import { adminType } from "../models/admin.model";

export const CreateAdminZodSchema = z.object({
  body: z.object({
    role: z.enum(['Master', 'Manager']).superRefine((val) => {
      if (val !== "Master" && val !== "Manager") {
        throw new Error("The role must be either 'Master' or 'Manager'.");
      }
      return true;
    }),
    username: z.string({
      invalid_type_error: "The username can only be a string.",
      required_error: "The username cannot be empty.",
    }).min(5),
    email: z.string({
      invalid_type_error: "The email can only be string.",
      required_error: "The email cannot be empty.",
    })
    .email("The email is not valid."),
    password: z.string({
      invalid_type_error: "The password can only be a string.",
      required_error: "The password cannot be empty.",
    }),
    managedHall: z.string().optional(),
  }).strict(),
});

export const LoginAdminZodSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          invalid_type_error: "The email can only be string.",
          required_error: "The email cannot be empty.",
        })
        .email("The email is not valid."),

      password: z.string({
        invalid_type_error: "The password can only be string.",
        required_error: "The password cannot be empty.",
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
