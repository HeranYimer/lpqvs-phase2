import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./Login.module.css";
import { translations } from "./lang";

function Login() {
  const navigate = useNavigate();

  const [lang, setLang] = useState("am");

  // ✅ NEW TRANSLATION FUNCTION
  const t = (key) => translations[key][lang];

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(null);

  const toggleLang = () => {
    setLang(lang === "am" ? "en" : "am");
  };

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/login", {
      username,
      password
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);

    // ✅ ALL navigation here
if (res.data.role === "Admin") {
  navigate("/admin-dashboard");

} else if (res.data.role === "Supervisor") {
  navigate("/supervisor-dashboard");

} else if (res.data.role === "Officer") {
  navigate("/officer-dashboard");

} else if (res.data.role === "Clerk") {
  navigate("/clerk-dashboard");

} else if (res.data.role === "Auditor") {
  navigate("/auditor-dashboard");

} else {
  // fallback safety
  navigate("/");
}
  } catch (err) {
    setMessage({ type: "error", text: t("error") });
    setTimeout(() => setMessage(null), 3000);
  }
};
  return (
    <div className={styles.container}>
      <div className={styles.card}>

        {/* 🌍 LANGUAGE SWITCH */}
        <div className={styles.langSwitch} onClick={toggleLang}>
          {lang === "am" ? "English" : "አማርኛ"}
        </div>

        {/* HEADER */}
        <div className={styles.header}>
          <h1 className={styles.title}>{t("loginTitle")}</h1>
          <p className={styles.subtitle}>{t("subtitle")}</p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className={styles.form}>

          <label>{t("username")}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>{t("password")}</label>

          <div className={styles.passwordWrapper}>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <span
              className={styles.eye}
              onClick={() => setShow(!show)}
            >
              {show ? "🙈" : "👁️"}
            </span>
          </div>

          <button className={styles.button}>
            {t("login")}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;