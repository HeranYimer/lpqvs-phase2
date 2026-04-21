import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";

// ✅ NEW MODULAR ROUTES
import createRoutes from "./routes/application/create.routes.js";
import uploadRoutes from "./routes/application/upload.routes.js";
import verifyRoutes from "./routes/application/verify.routes.js";
import decisionRoutes from "./routes/application/decision.routes.js";
import getRoutes from "./routes/application/get.routes.js";
import dashboardRoutes from "./routes/report/dashboard.routes.js";
import filterRoutes from "./routes/report/filter.routes.js";
import summaryRoutes from "./routes/report/summary.routes.js";
import adminRoutes from "./routes/report/admin.routes.js";
import storageRoutes from "./routes/report/storage.routes.js";
import settingsRoutes from "./routes/report/settings.routes.js"
import fayidaRoutes from "./routes/fayida.routes.js";
dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ ROUTES
app.use("/api", authRoutes);
app.use("/api", createRoutes);
app.use("/api", uploadRoutes);
app.use("/api", verifyRoutes);
app.use("/api", decisionRoutes);
app.use("/api", getRoutes);
app.use("/api/reports", dashboardRoutes);
app.use("/api/reports", filterRoutes);
app.use("/api/reports", summaryRoutes);
app.use("/api/", adminRoutes);
// ✅ STATIC FILES
app.use("/uploads", express.static("uploads"));
app.use("/api", storageRoutes);
app.use("/api", settingsRoutes);
app.use("/api", fayidaRoutes);
// ✅ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {

  console.error("🔥 ERROR:", err); // 👈 ADD THIS

if (err.code === "LIMIT_FILE_SIZE") {
  return res.status(400).json({
    message: "FILE_TOO_LARGE"
  });
}

  res.status(500).json({
    message: err.message || "Server error"
  });
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {

  console.log(`Server running on port ${PORT}`);

  try {
    await db.query("SELECT 1");
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database cnnection failed:", err);
  }

});