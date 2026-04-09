import db from "../config/db.js";

export const findUserByUsername = async (username) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );
  return rows[0];
};

export const updateFailedAttempts = async (id, attempts) => {
  await db.query(
    "UPDATE users SET failed_attempts = ? WHERE id = ?",
    [attempts, id]
  );
};

export const resetFailedAttempts = async (id) => {
  await db.query(
    "UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?",
    [id]
  );
};

export const lockUser = async (id) => {
  const lockTime = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await db.query(
    "UPDATE users SET locked_until = ? WHERE id = ?",
    [lockTime, id]
  );
};