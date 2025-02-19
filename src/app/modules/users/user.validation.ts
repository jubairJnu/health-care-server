import { z } from "zod";

export const userValidation = z.object({
  password: z.string({
    required_error: "Pasword Is Required",
  }),
  admin: z.object({
    email: z.string({
      required_error: "Email is Required",
    }),
    name: z.string({
      required_error: "Name is Required",
    }),
    contactNumber: z.string({
      required_error: "Contact Number Is Required",
    }),
  }),
});
