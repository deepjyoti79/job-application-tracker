import express from "express";
import { uploadResume, viewResume } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/upload-url", uploadResume);
router.get("/:id", viewResume);

export default router;
