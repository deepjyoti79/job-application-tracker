import { z } from "zod";
import { objectIdSchema } from "./commonSchemas.js";

export const uploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  contentType: z.literal("application/pdf"),
});

export const resumeParamsSchema = z.object({
  id: objectIdSchema,
});
