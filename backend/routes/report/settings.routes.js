import express from "express";
import {
  getSettings,
  updateSettings
} from "../../controllers/report/setting.controller.js";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { checkRole } from "../../middleware/role.middleware.js";

const router = express.Router();

// GET system settings (all roles can view)
router.get("/settings", requireAuth, getSettings);

// UPDATE system settings (Admin only)
router.put("/settings", requireAuth, checkRole(["Admin"]), updateSettings);

export default router;