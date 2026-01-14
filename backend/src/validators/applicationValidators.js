import { z } from "zod";
import { objectIdSchema } from "./commonSchemas.js";

const interviewSchema = z.object({
  round: z.string().min(1).optional(),
  date: z.coerce.date().optional(),
  mode: z.string().min(1).optional(),
  result: z.string().min(1).optional(),
  feedback: z.string().min(1).optional(),
});

const offerSchema = z.object({
  salary: z.coerce.number().nonnegative().optional(),
  currency: z.string().min(1).optional(),
  joiningDate: z.coerce.date().optional(),
  accepted: z.boolean().optional(),
});

const baseApplicationSchema = z.object({
  companyName: z.string().min(1).optional(),
  jobTitle: z.string().min(1).optional(),
  jobType: z.enum(["internship", "full-time", "contract", "remote"]).optional(),
  jobLocation: z.string().min(1).optional(),
  jobUrl: z.string().url().optional(),
  status: z
    .enum(["applied", "online_test", "interview", "offer", "rejected"])
    .optional(),
  appliedDate: z.coerce.date().optional(),
  resumeId: objectIdSchema.optional(),
  source: z.string().min(1).optional(),
  notes: z.string().optional(),
  interviews: z.array(interviewSchema).optional(),
  offer: offerSchema.optional(),
});

export const createApplicationSchema = baseApplicationSchema.extend({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
});

export const updateApplicationSchema = baseApplicationSchema.superRefine(
  (data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one field must be provided",
      });
    }
  }
);

export const paramsWithIdSchema = z.object({
  id: objectIdSchema,
});
