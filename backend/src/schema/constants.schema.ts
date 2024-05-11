import { constant } from "lodash";
import  z from "zod";

export const ConstantsZodSchema = z.object({
    body: z
    .object({
        constantName: z.string({
            invalid_type_error: "Constant name must be a string.",
            required_error: "Constant name cannot be empty.",
        }),
        value: z.number({
            invalid_type_error: "Value must be a number.",
            required_error: "Value cannot be empty.",
        }),
    })
});

export const DeleteConstantZodSchema = z.object({
    body: z
    .object({
        constantName : z.string({
            invalid_type_error: "Constant name should be of type String",
            required_error : "Constant name cannot be empty"
        })
    })
})
