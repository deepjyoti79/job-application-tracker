import express from "express";
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";
import { validate } from "../middlewares/validate.js";
import {
  createApplicationSchema,
  updateApplicationSchema,
  paramsWithIdSchema,
} from "../validators/applicationValidators.js";

const router = express.Router();

router.post("/", validate(createApplicationSchema), createApplication);
router.get("/", getApplications);
router.patch(
  "/:id",
  validate(paramsWithIdSchema, "params"),
  validate(updateApplicationSchema),
  updateApplication
);
router.delete("/:id", validate(paramsWithIdSchema, "params"), deleteApplication);

export default router;
