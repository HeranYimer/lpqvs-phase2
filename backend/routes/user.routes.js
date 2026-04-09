import express from "express";
import { changePassword } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/change-password", authenticate, changePassword);

export default router;