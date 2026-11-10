import { useState } from "react";
import api from "../api/axios";

function AtelierForm({ onAjout }) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [niveau, setNiveau] = useState("débutant");
  const [date, setDate] = useState("");
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      const { data } = await api.post("/ateliers", { titre, description, niveau, date });
      onAjout(data);
      setTitre("");
      setDescription("");
      setNiveau("débutant");
      setDate("");
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'ajout");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 400 }}>
      <h3>Proposer un atelier</h3>
      <input
        placeholder="Titre (ex : Git en 1h)"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select value={niveau} onChange={(e) => setNiveau(e.target.value)}>
        <option value="débutant">Débutant</option>
        <option value="intermédiaire">Intermédiaire</option>
        <option value="avancé">Avancé</option>
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Publier</button>
      {erreur && <p style={{ color: "red" }}>{erreur}</p>}
    </form>
  );
}

export default AtelierForm;