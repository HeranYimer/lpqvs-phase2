import db from "../config/db.js";
import { comparePassword, hashPassword, validatePassword } from "../utils/password.utils.js";

export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    const user = rows[0];

    const match = await comparePassword(oldPassword, user.password_hash);

    if (!match) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message: "Password must be 8+ chars, uppercase, lowercase, number"
      });
    }

    const hashed = await hashPassword(newPassword);

    await db.query(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [hashed, userId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};