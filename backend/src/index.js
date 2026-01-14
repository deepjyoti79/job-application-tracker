import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./utils/db.js";
import { verifyToken } from "./middlewares/verifyToken.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { validateEnvironment } from "./validators/envValidators.js";
const env = validateEnvironment();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = env.PORT ?? 5000;

app.use("/api/auth", authRoutes);
app.use("/api/resume", verifyToken, resumeRoutes);
app.use("/api/application", verifyToken, applicationRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
