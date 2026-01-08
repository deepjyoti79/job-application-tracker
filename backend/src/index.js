import "dotenv/config";
import express from "express";

import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
