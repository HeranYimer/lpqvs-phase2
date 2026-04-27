import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { updateApplication } from "../../controllers/application/edit.controller.js";

const router = express.Router(); // ✅ create router

router.put(
  "/applications/:id",
  requireAuth,
  checkPermission("updateApplications"),
  updateApplication
);

export default router; // ✅ export it