import { ZodError } from "zod";

const formatError = (error) => {
  if (error instanceof ZodError) {
    return error.flatten();
  }
  return { formErrors: ["Validation failed"], fieldErrors: {} };
};

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: formatError(result.error),
      });
    }

    req[source] = result.data;
    next();
  };
};
