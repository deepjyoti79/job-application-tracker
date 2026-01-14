import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().int().positive().optional(),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_ACCESS_KEY: z.string().min(1, "AWS_ACCESS_KEY is required"),
  AWS_SECRET_KEY: z.string().min(1, "AWS_SECRET_KEY is required"),
  AWS_S3_BUCKET: z.string().min(1, "AWS_S3_BUCKET is required"),
});

export const validateEnvironment = (envVars = process.env) => {
  const parsed = envSchema.safeParse(envVars);

  if (!parsed.success) {
    console.error("Invalid environment configuration", parsed.error.flatten());
    process.exit(1);
  }

  return parsed.data;
};
