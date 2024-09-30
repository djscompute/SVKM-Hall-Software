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
      contact: z
        .string({
          invalid_type_error: "Contact number can only be a string.",
          required_error: "Contact number cannot be empty.",
        })
        .regex(/^\d{10}$/, "Contact number must be 10 digits long."),
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
      managedHalls: z.array(z.string()).optional(),
    })
    .strict(),
});

export const UpdateAdminZodSchema = z.object({
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
      contact: z
        .string({
          invalid_type_error: "Contact number can only be a string.",
          required_error: "Contact number cannot be empty.",
        })
        .regex(/^\d{10}$/, "Contact number must be 10 digits long."),
      email: z
        .string({
          invalid_type_error: "New Admin email can only be string.",
          required_error: "New Admin email cannot be empty.",
        })
        .email("The email is not valid."),
      _id: z.
        string({
          invalid_type_error: "_id must be string",
          required_error: "_id must be passed"
        }),
      managedHalls: z.array(z.string()).optional(),
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

export const EmailAdminZodSchema = z.object({
  params: z.object({
    email: z.string({
      required_error: "Email cannot be empty",
      invalid_type_error: "Email should be a string value.",
    }),
  }),
});

export const IdAdminZodSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: "ID cannot be empty",
      invalid_type_error: "ID should be a string value.",
    }),
  }),
});

export const DeleteAdminZodSchema = z.object({
  body: z
    .object({
      _id: z.string({
        required_error: "_id cannot be empty",
        invalid_type_error: "_id should be a string value.",
      }),
    })
    .strict(),
});




//type
export type CreateAdminReqType = {
  body: Pick<adminType, "username" | "email" | "password">;
};

export type LoginAdminReqType = {
  body: Pick<adminType, "email" | "password">;
};

export type DeleteAdminReqType = {
  body: Pick<adminType, "_id">;
};

// type createadminType = z.infer<typeof CreateUserZodSchema>
