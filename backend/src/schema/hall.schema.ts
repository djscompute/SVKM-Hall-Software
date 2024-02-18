import z from "zod";
// import { hallType } from "../models/admin.model";

import { EachHallType } from "../models/hall.model";

// export const AddHallZodSchema = z.object({
//   body: z.object({
//     name: z.string({
//       required_error: "Title cannot be empty",
//       invalid_type_error: "Title should be a string value.",
//     }),
//     location: z.string(),
//     capacity: z.string(),
//     facilities: z.array(z.string()).optional(),
//     cost: z.string(),
//   }),
// });

const stringErrorHandler = (feildName: string) => {
  return {
    invalid_type_error: `${feildName} can only be a string.`,
    required_error: `${feildName} cannot be empty`,
  };
};

export const AddHallZodSchema = z.object({
  body: z.object({
    name: z.string(stringErrorHandler("name")),
    location: z.object({
      desc1: z.string(stringErrorHandler("location.desc1")),
      desc2: z.string(stringErrorHandler("location.desc2")),
      gmapurl: z.string(stringErrorHandler("location.gmapurl")).optional(),
      iframe: z.string(stringErrorHandler("location.iframe")).optional(),
    }),
    about: z.array(z.string(stringErrorHandler("about"))),
    timings: z.object({
      from: z.string(stringErrorHandler("timings.from")),
      to: z.string(stringErrorHandler("timings.to")),
    }),
    capacity: z.string(stringErrorHandler("capacity")),
    seating: z.string(stringErrorHandler("seatings")),
    pricing: z.string(stringErrorHandler("pricing")).optional(),
    additionalFeatures: z.array(
      z.object({
        heading: z.string(stringErrorHandler("additionalFeatures.heading")),
        desc: z.string(stringErrorHandler("additionalFeatures.desc")),
        stats: z
          .array(z.string(stringErrorHandler("additionalFeatures.stats")))
          .optional(),
        price: z
          .string(stringErrorHandler("additionalFeatures.price"))
          .optional(),
      })
    ),
    images: z.array(z.string(stringErrorHandler("images"))).optional(),
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

// export const EditHallZodSchema = z.object({
//   params: z.object({
//     id: z.string({
//       required_error: "Id cannot be empty",
//       invalid_type_error: "Id should be a string value.",
//     }),
//   }),
// });

//type
// export type AddHallType = {
//   body: Pick<
//     EachHallType,
//     "name" | "location" | "capacity" | "additionalFeatures" | "pricing"
//   >;
// };
// export type RemoveHallType = { body: Pick<EachHallType, "_id"> };
