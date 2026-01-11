import express from "express";
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", createApplication);
router.get("/", getApplications);
router.patch("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;
