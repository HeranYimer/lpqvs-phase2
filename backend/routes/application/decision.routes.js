import express from "express";
import { makeDecision } from "../../controllers/application/decision.controller.js";
import { checkRole } from "../../middleware/role.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/applications/:id/decision",
  requireAuth,
  checkRole(["Supervisor"]),
  makeDecision
);

export default router;