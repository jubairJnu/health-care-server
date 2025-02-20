import { Gender } from "@prisma/client";
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

export const doctorCreateValidation = z.object({
  password: z.string({
    required_error: "Pasword Is Required",
  }),
  doctor: z.object({
    email: z.string({
      required_error: "Email is Required",
    }),
    name: z.string({
      required_error: "Name is Required",
    }),
    contactNumber: z.string({
      required_error: "Contact Number Is Required",
    }),
    registrationNumber: z.string({
      required_error: "Registration Number Is Required",
    }),
    gender: z.enum([Gender.FEMALE, Gender.MALE, Gender.OTHER]),

    appointmentFee: z.number({
      required_error: "Appointment Fee Is Required",
    }),
    qualification: z.string({ required_error: "Qualification Is Required" }),
    currentWorkingPlace: z.string({
      required_error: "Current Working Place Is Required",
    }),
    designation: z.string({ required_error: "Designation Is Required" }),
  }),
  // Doctor, Nurse, etc
});
