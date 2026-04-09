import express from "express";
import { verifyApplication } from "../../controllers/application/verify.controller.js";
import { checkRole } from "../../middleware/role.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/applications/:id/verify",
  requireAuth,
  checkRole(["Officer"]),
  verifyApplication
);

export default router;