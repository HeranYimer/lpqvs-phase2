import jwt from "jsonwebtoken";
import { findUserByUsername, updateFailedAttempts, resetFailedAttempts, lockUser } from "../services/user.service.js";
import { comparePassword } from "../utils/password.utils.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "ተጠቃሚ አልተገኘም" });
    }

    // 🔒 CHECK LOCK
    if (user.locked_until && new Date() < new Date(user.locked_until)) {
      return res.status(403).json({
        message: "Account locked. Try later."
      });
    }

    const validPassword = await comparePassword(
      password,
      user.password_hash
    );

    if (!validPassword) {
      let attempts = user.failed_attempts + 1;

      if (attempts >= 5) {
        await lockUser(user.id); // lock account
        return res.status(403).json({
          message: "Account locked after 5 failed attempts"
        });
      }

      await updateFailedAttempts(user.id, attempts);

      return res.status(401).json({
        message: "የይለፍ ቃል ትክክል አይደለም"
      });
    }

    // ✅ RESET ON SUCCESS
    await resetFailedAttempts(user.id);

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h"
      }
    );

    res.json({
      message: "በተሳካ ሁኔታ ገብተዋል",
      token,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const logout = (req, res) => {
  res.json({
    message: "Logged out successfully"
  });
};