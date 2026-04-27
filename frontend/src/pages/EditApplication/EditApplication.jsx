import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { translations } from "./lang";
import styles from "./EditApplication.module.css"

function EditApplication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const lang = localStorage.getItem("lang") || "am";
 const t = translations.editApplication;

  const [form, setForm] = useState({
    name: "",
    date_of_birth: "",
    fayida_id: "",
    kebele_id: "",
    address: "",
    marital_status: "single"
  });

  const [message, setMessage] = useState(null);

  // ✅ LOAD EXISTING DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get(`/applications/${id}`);

        const data = res.data;
        setForm({
          name: data.name || "",
          date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split("T")[0]
  : "",
          fayida_id: data.fayida_id || "",
          kebele_id: data.kebele_id || "",
          address: data.address || "",
          marital_status: data.marital_status || "single"
        });

      } catch (err) {
        console.error("Load error:", err);
        navigate("/"); // fallback
      }
    };
    
    loadData();
    
  }, [id]);

  // 🧾 HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🚀 UPDATE
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.put(`/applications/${id}`, form);

    setMessage({
      type: "success",
      text: t.success[lang]
    });

  } catch (err) {
    setMessage({
      type: "error",
      text: t.error[lang]
    });
  }

  setTimeout(() => setMessage(null), 3000);
};

  return (
    <div className={styles.page}>
      <div className={styles.header}>
  <button className={styles.backbtn} onClick={() => navigate(-1)}>
    {t.back[lang]}
  </button>

  <span
    className={styles.lang}
    onClick={() => {
      const newLang = lang === "am" ? "en" : "am";
      localStorage.setItem("lang", newLang);
      window.location.reload();
    }}
  >
    {lang === "am" ? "English" : "አማርኛ"}
  </span>
</div>
      <h2>{t.title[lang]}</h2>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>

  <label>{t.labels.name[lang]}</label>
  <input
    name="name"
    value={form.name}
    onChange={handleChange}
    required
  />

  <label>{t.labels.dob[lang]}</label>
  <input
    type="date"
    name="date_of_birth"
    value={form.date_of_birth}
    onChange={handleChange}
    required
  />

  <label>{t.labels.fayida[lang]}</label>
  <input
    name="fayida_id"
    value={form.fayida_id}
    onChange={handleChange}
  />

  <label>{t.labels.kebele[lang]}</label>
  <input
    name="kebele_id"
    value={form.kebele_id}
    onChange={handleChange}
    required
  />

  <label>{t.labels.address[lang]}</label>
  <input
    name="address"
    value={form.address}
    onChange={handleChange}
    required
  />

  <label>{t.labels.marital[lang]}</label>
  <select
    name="marital_status"
    value={form.marital_status}
    onChange={handleChange}
  >
    {Object.keys(t.maritalOptions || {}).map((key) => (
      <option key={key} value={key}>
        {t.maritalOptions[key][lang]}
      </option>
    ))}
  </select>

  <button>{t.update[lang]}</button>

</form>
    </div>
  );
}

export default EditApplication;