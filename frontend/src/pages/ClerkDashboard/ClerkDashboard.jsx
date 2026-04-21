import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./ClerkDashboard.module.css";
import { translations } from "./lang";

function ClerkDashboard() {
  const navigate = useNavigate();

  const lang = localStorage.getItem("lang") || "am";
  const t = translations[lang];

  // 🔒 ROLE CHECK
  useEffect(() => {
    const role = (localStorage.getItem("role") || "").toLowerCase();

    if (!role) return navigate("/");
    if (role !== "clerk") return navigate("/");
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
              <Link to="/new-application">{t.create}</Link>
            </li>

            <li>
              <Link to="/applications/submitted">{t.myApps}</Link>
            </li>
          </ul>
          <li>
  <Link to="/upload-documents">{t.upload}</Link>
</li>
        </aside>
        {/* CONTENT */}
        <main className={styles.content}>
          <h3>{t.welcome}</h3>

          <div className={styles.cards}>
            <div className={styles.card}>
              <h4>{t.action1}</h4>
              <p>{t.action1Desc}</p>
            </div>

            <div className={styles.card}>
              <h4>{t.action2}</h4>
              <p>{t.action2Desc}</p>
            </div>
          </div>
        </main>

      </div>
    </>
  );
}

export default ClerkDashboard;