import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./ViewApplication.module.css";
import { translations } from "./lang";

function ViewApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

const lang = localStorage.getItem("lang") || "am";
const t = translations[lang];
const toggleLang = () => {
  localStorage.setItem("lang", lang === "am" ? "en" : "am");
  window.location.reload();
};
  const [application, setApplication] = useState(null);
  const [docs, setDocs] = useState([]);
  const [role, setRole] = useState("");

  const [checks, setChecks] = useState({
    land: "",
    marital: "",
    kebele: "",
    fayida: "",
    land_comment: "",
    marital_comment: "",
    kebele_comment: "",
    fayida_comment: ""
  });
const [decisionComment, setDecisionComment] = useState("");
const [message, setMessage] = useState(null);

  useEffect(() => {
    setRole((localStorage.getItem("role") || "").toLowerCase());
    loadApplication();
    loadDocs();
  }, [id]);

const showMessage = (text, type = "success") => {
  setMessage({ text, type });

  setTimeout(() => setMessage(null), 3000);
};

  // ================= LOAD DATA =================
 const loadApplication = async () => {
  try {
    const res = await api.get(`/applications/${id}`);
    setApplication(res.data);
  } catch (err) {
    console.error(err);
    showMessage(t.connectionError, "error");
  }
};

  const loadDocs = async () => {
    try {
      const res = await api.get(`/applications/${id}/documents`);
      setDocs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setChecks({ ...checks, [e.target.id]: e.target.value });
  };

  // ================= SAVE VERIFICATION =================
  const saveVerification = async () => {
  const data = [
  {
    item_name: "Land",
    status: checks.land,
    comment: checks.land_comment
  },
  {
    item_name: "Marital",
    status: checks.marital,
    comment: checks.marital_comment
  },
  {
    item_name: "Kebele",
    status: checks.kebele,
    comment: checks.kebele_comment
  },
  {
    item_name: "Fayida",
    status: checks.fayida,
    comment: checks.fayida_comment
  }
];

    if (data.some(c => !c.status)) {
      return showMessage(t.fillAll, "error");
    }

    try {
    const res = await api.post(`/applications/${id}/verify`, { checks: data });

const eligibility = res.data.eligibility;

// ✅ Update UI immediately
setApplication(prev => ({
  ...prev,
  eligibility
}));

// ✅ Translated message
const translatedEligibility =
  eligibility === "Eligible"
    ? (lang === "am" ? "ብቁ" : "Eligible")
    : (lang === "am" ? "ብቁ አይደለም" : "Not Eligible");

showMessage(
  `${t.successSave} - ${t.eligibility}: ${translatedEligibility}`
);
    } catch {
      showMessage(t.errorSave, "error");
    }
  };

  // ================= DECISION =================
const makeDecision = async (decision) => {
  try {
    await api.post(`/applications/${id}/decision`, {
      decision,
      comment: decisionComment
    });

    showMessage(
      decision === "Approved"
        ? t.successApprove
        : t.successReject,
      "success"
    );

    setDecisionComment("");
    loadApplication();
  } catch (err) {
    console.error(err);
    showMessage(t.errorDecision, "error");
  }
};

  if (!application) return <p>Loading...</p>;

  return (
   <div className={styles.page}>
      {/* Language toggle */}
    <div className={styles.header}>
  <button
    className={styles.backbtn}
    onClick={() => navigate("/applications/submitted")}
  >
    {t.back}
  </button>

  <span onClick={toggleLang} className={styles.lang}>
    {lang === "am" ? "English" : "አማርኛ"}
  </span>
</div>

      <h2>{t.title}</h2>

   {message && (
  <div className={`${styles.toast} ${styles[message.type]}`}>
    {message.text}
  </div>
)}

      {/* DETAILS */}
     <div className={styles.card}>
  <p><b>{t.id}:</b> {application.id}</p>
  <p><b>{t.name}:</b> {application.name}</p>
  <p><b>{t.fayida}:</b> {application.fayida_id || "-"}</p>
  <p><b>{t.kebele}:</b> {application.kebele_id || "-"}</p>
  <p><b>{t.address}:</b> {application.address}</p>
  <p><b>{t.marital}:</b> {application.marital_status}</p>
  <p><b>{t.status}:</b> {application.status}</p>
  <p><b>{t.eligibility}:</b> {application.eligibility || "Not evaluated"}</p>
  <p><b>{t.comment}:</b> {application.notes || "-"}</p>
</div>

      {/* DOCUMENTS */}
  {role === "officer" || role === "clerk" && (
  <>
    <h3>{t.documents}</h3>

    <div className={`${styles.card} ${styles.docs}`}>
      {docs.length === 0 ? (
        <p>{t.noDocs}</p>
      ) : (
        docs.map((doc, i) => (
          <a
            key={i}
            href={`http://localhost:5000/uploads/${doc.file_path}`}
            target="_blank"
          >
            {
              doc.doc_type === "signature" ? t.signature :
              doc.doc_type === "fayida_id" ? t.fayida_id_doc :
              doc.doc_type === "kebele_id" ? t.kebele_id_doc :
              doc.doc_type
            }
          </a>
        ))
      )}
    </div>
  </>
)}
    

      {/* CHECKLIST */}
      {role === "officer" && (
        <div className={styles.card}>
          <h3>{t.checklist}</h3>

          {["land", "marital", "kebele", "fayida"].map(item => (
            <div key={item}>
              <label>{t[item]}</label>

            <select id={item} value={checks[item]} onChange={handleChange}>
  <option value="">{t.select}</option>
  <option value="verified">{t.verified}</option>
  <option value="not_verified">{t.notVerified}</option>
</select>

              <input
                type="text"
                id={`${item}_comment`}
                placeholder={t.comment}
                onChange={handleChange}
              />
            </div>
          ))}

         <button
  type="button"
  onClick={() => {
    console.log("CHECKS STATE:", checks);
    saveVerification();
  }}
>
  {t.save}
</button>
        </div>
      )}

      {/* DECISION */}
    {role === "supervisor" && (
  <div className={styles.card}>
    <h3>{t.decision}</h3>

  <textarea
  className={styles.textarea}
  placeholder={t.writeComment}
  value={decisionComment}
  onChange={(e) => setDecisionComment(e.target.value)}
/>

    <div className={styles.decisionBtns}>
      <button onClick={() => makeDecision("Approved")}>
        {t.approve}
      </button>

      <button onClick={() => makeDecision("Rejected")}>
        {t.reject}
      </button>
    </div>
  </div>
)}
    </div>
  );
}

export default ViewApplication;