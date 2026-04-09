import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./SubmittedApplications.module.css";
import { translations } from "./lang";

function SubmittedApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState({ show: false, id: null });

  const role = (localStorage.getItem("role") || "").toLowerCase();
  const lang = localStorage.getItem("lang") || "am";

  const t = translations.submittedApplications;
const toggleLang = () => {
  localStorage.setItem("lang", lang === "am" ? "en" : "am");
  window.location.reload();
};
  // 🔔 TOAST
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 📥 LOAD DATA
  const loadApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    //   console.log(res.data);
    } catch (err) {
      showToast(t.toast.loadError[lang], "error");
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // 🗑 DELETE
  const deleteApplication = async (id) => {
    try {
      await api.delete(`/applications/${id}`);
      showToast(t.toast.deleteSuccess[lang], "success");
      loadApplications();
    } catch (err) {
      showToast(t.toast.serverError[lang], "error");
    }
  };

  return (
    <div className={styles.page}>

      {/* TOAST */}
      <div className={styles.toastContainer}>
        {toast && (
          <div className={`${styles.toast} ${styles[toast.type]}`}>
            {toast.msg}
          </div>
        )}
      </div>

        {/* HEADER */}
            <div className={styles.header}>
              <button className={styles.backbtn} onClick={() => navigate("/dashboard")}>
                {t.back[lang]}
              </button>
      
              <span onClick={toggleLang} className={styles.lang}>
                {lang === "am" ? "English" : "አማርኛ"}
              </span>
            </div>

      {/* TITLE */}
      <h2 className={styles.title}>{t.title[lang]}</h2>

      {/* TABLE */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t.table.id[lang]}</th>
            <th>{t.table.name[lang]}</th>
            <th>{t.table.status[lang]}</th>
            <th>{t.table.action[lang]}</th>
            <th>{t.table.address[lang]}</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.name}</td>
              <td>{app.status}</td>

              <td>
                <span
                  className={styles.actionBtn}
                  onClick={() =>
                    navigate(`/view-application/${app.id}`)
                  }
                >
                  {t.view[lang]}
                </span>

                {role === "admin" && (
                  <span
                    className={styles.deleteBtn}
                    onClick={() => setConfirm({ show: true, id: app.id })}
                  >
                    {t.delete[lang]}
                  </span>
                )}
              </td>

              <td>{app.address}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {confirm.show && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <p>{t.confirm[lang]}</p>

            <div className={styles.modalActions}>
              <button
                onClick={() => {
                  deleteApplication(confirm.id);
                  setConfirm({ show: false, id: null });
                }}
              >
                {t.yes[lang]}
              </button>

              <button
                onClick={() => setConfirm({ show: false, id: null })}
              >
                {t.no[lang]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmittedApplications;