import express from "express";
import { uploadResume, viewResume } from "../controllers/resumeController.js";
import { validate } from "../middlewares/validate.js";
import {
  uploadSchema,
  resumeParamsSchema,
} from "../validators/resumeValidators.js";

const router = express.Router();

router.post("/upload-url", validate(uploadSchema), uploadResume);
router.get(
	"/:id",
	validate(resumeParamsSchema, "params"),
	viewResume
);

export default router;
