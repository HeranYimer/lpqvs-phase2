import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AuditorDashboard.module.css";
import { translations } from "./lang";

function AuditorDashboard() {
  const navigate = useNavigate();

  const lang = localStorage.getItem("lang") || "am";
  const t = translations[lang];

  // 🔒 ROLE CHECK
  useEffect(() => {
    const role = (localStorage.getItem("role") || "").toLowerCase();

    if (!role) return navigate("/");
    if (role !== "auditor") return navigate("/");
  }, []);

  // 🌍 LANGUAGE SWITCH
  const toggleLang = () => {
    localStorage.setItem("lang", lang === "am" ? "en" : "am");
    window.location.reload();
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* HEADER */}
      <div className={styles.header}>
        <h2>{t.title}</h2>

        <div>
          <span className={styles.lang} onClick={toggleLang}>
            {lang === "am" ? "English" : "አማርኛ"}
          </span>

          <button onClick={logout}>{t.logout}</button>
        </div>
      </div>

      <div className={styles.container}>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <ul>
            <li>
              <Link to="/applications/submitted">{t.viewApps}</Link>
            </li>

            <li>
              <Link to="/reports">{t.reports}</Link>
            </li>

            <li>
              <Link to="/audit-logs">{t.logs}</Link>
            </li>
          </ul>
        </aside>

        {/* CONTENT */}
        <main className={styles.content}>
          <h3>{t.welcome}</h3>

          <div className={styles.cards}>
            <div className={styles.card}>
              <h4>{t.readonly}</h4>
              <p>{t.readonlyDesc}</p>
            </div>

            <div className={styles.card}>
              <h4>{t.monitor}</h4>
              <p>{t.monitorDesc}</p>
            </div>
          </div>
        </main>

      </div>
    </>
  );
}

export default AuditorDashboard;