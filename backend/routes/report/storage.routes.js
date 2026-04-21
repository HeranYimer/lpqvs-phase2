import express from "express";
import { getStorageUsage } from "../../controllers/report/storage.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { checkRole } from "../../middleware/role.middleware.js";

const router = express.Router();

// ================= STORAGE ROUTE =================
router.get(
  "/storage-usage",
  requireAuth,
  checkRole(["Admin"]),
  getStorageUsage
);

export default router;