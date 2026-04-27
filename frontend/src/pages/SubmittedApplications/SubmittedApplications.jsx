import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./SubmittedApplications.module.css";
import { translations } from "./lang";

function SubmittedApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5; // you can change to 10 later
  const [confirm, setConfirm] = useState({ show: false, id: null });
const [search, setSearch] = useState("");
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
  const msg = err.response?.data?.message;

  showToast(
    msg || t.toast.serverError[lang],
    "error"
  );
}
  };

  useEffect(() => {
    loadApplications();
  }, []);
useEffect(() => {
  setCurrentPage(1);
}, [search]);
  // 🗑 DELETE
  const deleteApplication = async (id) => {
    try {
      await api.delete(`/applications/${id}`);
      showToast(t.toast.deleteSuccess[lang], "success");
      loadApplications();
    }catch (err) {
  const code = err.response?.data?.code;

  if (code === "UNDER_10_YEARS") {
    return showToast(t.toast.cannotDelete[lang], "error");
  }

  showToast(t.toast.serverError[lang], "error");
}
  };
const goBack = () => {
  if (role === "officer") return navigate("/officer-dashboard");
  if (role === "supervisor") return navigate("/supervisor-dashboard");
  if (role === "admin") return navigate("/admin-dashboard");
  if (role === "clerk") return navigate("/clerk-dashboard");
 if (role === "auditor") return navigate("/auditor-dashboard");
  navigate("/"); // fallback
};
const filteredApplications = applications.filter((app) => {
  const searchText = search.toLowerCase();

  return (
    (app.name || "").toLowerCase().includes(searchText) ||
    (app.address || "").toLowerCase().includes(searchText) ||
    (app.status || "").toLowerCase().includes(searchText)
  );
});
const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;

const currentApplications = filteredApplications.slice(
  indexOfFirst,
  indexOfLast
);

const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
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
             <button className={styles.backbtn} onClick={goBack}>
  {t.back[lang]}
</button>
      
              <span onClick={toggleLang} className={styles.lang}>
                {lang === "am" ? "English" : "አማርኛ"}
              </span>
            </div>

      {/* TITLE */}
      <h2 className={styles.title}>{t.title[lang]}</h2>
<div className={styles.searchBox}>
  <input
    type="text"
    placeholder={
  t.search?.[lang] || "Search by name, status, or address..."
}
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className={styles.searchInput}
  />
</div>
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
        
  {filteredApplications.length === 0 ? (
    <tr>
      <td colSpan="5" className={styles.noData}>
        {search
          ? (lang === "am"
              ? "ምንም ውጤት አልተገኘም"
              : "No matching applications found")
          : (lang === "am"
              ? "ምንም ውሂብ የለም"
              : "No applications available")}
      </td>
    </tr>
  ) : (
    currentApplications.map((app) => (
      <tr key={app.id}>
        <td>{app.id}</td>
        <td>{app.name}</td>
        <td>{app.status}</td>

        <td>
  <span
    className={styles.actionBtn}
    onClick={() => navigate(`/view-application/${app.id}`)}
  >
    {t.view[lang]}
  </span>

  {/* ✅ EDIT BUTTON */}
  {(role === "officer" || role === "admin") && (
  <span
  className={styles.editBtn}
  onClick={() => navigate(`/edit-application/${app.id}`)}
>
  {t.edit[lang]}
</span>
  )}
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
    ))
  )}
</tbody>
      </table>
<div className={styles.pagination}>
  <button
    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
    disabled={currentPage === 1}
  >
    {t.pagination.prev[lang]}
  </button>

  <span>
    {t.pagination.page[lang]} {currentPage} {t.pagination.of[lang]} {totalPages || 1}
  </span>

  <button
    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
    disabled={currentPage === totalPages || totalPages === 0}
  >
    {t.pagination.next[lang]}
  </button>
</div>
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