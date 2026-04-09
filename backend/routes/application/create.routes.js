import express from "express";
import upload from "../../config/upload.js";
import { createApplication } from "../../controllers/application/create.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { checkRole } from "../../middleware/role.middleware.js";

const router = express.Router();

const uploadMiddleware = upload.fields([
  { name: "signature", maxCount: 1 },
  { name: "fayida_doc", maxCount: 1 },
  { name: "kebele_doc", maxCount: 1 }
]);

router.post(
  "/applications",
  requireAuth,
  checkRole(["Officer"]),
  (req, res) => {

    uploadMiddleware(req, res, (err) => {

      // 🚨 HANDLE MULTER ERRORS PROPERLY
      if (err) {

        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: {
  am: "የፋይል መጠን ከ 5 ሜባ መብለጥ አይችልም",
  en: "File size must not exceed 5MB"
}
          });
        }

        if (err.code === "INVALID_FILE_TYPE") {
          return res.status(400).json({
            message: {
  am: "የተሳሳተ የፋይል አይነት (PDF, JPG, PNG ብቻ)",
  en: "Invalid file type (PDF, JPG, PNG only)"
}
          });
        }

        return res.status(400).json({
          message: {
  am: err.message || "የሰቀላ ስህተት",
  en: err.message || "Upload error"
}
        });
      }

      createApplication(req, res);
    });
  }
);

export default router;