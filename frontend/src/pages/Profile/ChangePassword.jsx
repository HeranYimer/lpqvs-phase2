import { useState } from "react";
import api from "../../api/axios";
import styles from "./ChangePassword.module.css";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/users/change-password", {
        oldPassword,
        newPassword
      });

      alert(res.data.message);

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleChange} className={styles.form}>
        <h2>Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}