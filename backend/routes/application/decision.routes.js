import express from "express";
import { makeDecision } from "../../controllers/application/decision.controller.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/applications/:id/decision",
  requireAuth,
  checkPermission("makeDecision"),
  makeDecision
);

export default router;