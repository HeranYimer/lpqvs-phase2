import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./AdminSettings.module.css";
import { translations } from "./lang";

function AdminSettings() {
  const navigate = useNavigate();

  const [lang, setLang] = useState(localStorage.getItem("lang") || "am");
  const t = translations.settings[lang];

  const [systemName, setSystemName] = useState("LPQVS");
  const [systemPhase, setSystemPhase] = useState("Phase I");
  const [backendStatus, setBackendStatus] = useState("checking");
  const [message, setMessage] = useState(null);

  const role = (localStorage.getItem("role") || "").toLowerCase();

  // ================= LOAD SETTINGS =================
  const loadSettings = async () => {
    try {
      const res = await api.get("/settings");
      setSystemName(res.data.system_name || "LPQVS");
      setSystemPhase(res.data.system_phase || "Phase I");
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CHECK BACKEND =================
const checkBackend = async () => {
  try {
    const res = await api.get("/reports/admin-overview");

    setBackendStatus(res.status === 200 ? "connected" : "error");

  } catch {
    setBackendStatus("offline");
  }
};
  useEffect(() => {
    loadSettings();
    checkBackend();
  }, []);

  // ================= LANGUAGE TOGGLE =================
  const toggleLang = () => {
    const newLang = lang === "am" ? "en" : "am";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  // ================= SAVE SETTINGS =================
  const saveSettings = async () => {
    try {
      await api.put("/settings", {
        system_name: systemName,
        system_phase: systemPhase
      });

      setMessage({ type: "success", text: t.saved });

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: t.error });
    }
  };

  return (
    <div className={styles.page}>

      {/* ================= HEADER ================= */}
      <div className={styles.header}>
        <button
          className={styles.backbtn}
          onClick={() => navigate("/admin-dashboard")}
        >
          {t.back}
        </button>

        <span className={styles.lang} onClick={toggleLang}>
          {lang === "am" ? "English" : "አማርኛ"}
        </span>
      </div>

      {/* TITLE */}
      <h2>⚙️ {t.title}</h2>
{message && (
  <div className={`${styles.message} ${styles[message.type]}`}>
    {message.text}
  </div>
)}
      <div className={styles.container}>
        <main className={styles.content}>

          <div className={styles.cards}>

            <div className={styles.card}>
              <h4>{t.name}</h4>
              <input
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
              />
            </div>

            <div className={styles.card}>
              <h4>{t.phase}</h4>
              <input
                value={systemPhase}
                onChange={(e) => setSystemPhase(e.target.value)}
              />
            </div>

            <div className={styles.card}>
              <h4>{t.role}</h4>
              <p>{role === "admin" ? t.admin : role}</p>
            </div>

            <div className={styles.card}>
              <h4>{t.backend}</h4>
              <p>
  {backendStatus === "connected" && t.connected}
  {backendStatus === "error" && t.errorStatus}
  {backendStatus === "offline" && t.offline}
  {backendStatus === "checking" && "Checking..."}
</p>
            </div>

          </div>

          <br />

          <button onClick={saveSettings}>
            💾 {t.save}
          </button>

        </main>
      </div>
    </div>
  );
}

export default AdminSettings;