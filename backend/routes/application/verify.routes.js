import express from "express";
import { verifyApplication } from "../../controllers/application/verify.controller.js";
import { checkPermission } from "../../middleware/permission.middleware.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/applications/:id/verify",
  requireAuth,
  checkPermission("performVerification"),
  verifyApplication
);

export default router;