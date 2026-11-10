import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function AtelierDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [atelier, setAtelier] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [texte, setTexte] = useState("");
  const [note, setNote] = useState(5);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const charger = async () => {
      try {
        const res1 = await api.get(`/ateliers/${id}`);
        const res2 = await api.get(`/feedbacks/atelier/${id}`);
        setAtelier(res1.data);
        setFeedbacks(res2.data);
      } catch (err) {
        setErreur("Atelier introuvable");
      }
    };
    charger();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      const { data } = await api.post("/feedbacks", {
        texte,
        note: Number(note),
        atelier: id,
      });
      setFeedbacks([data, ...feedbacks]);
      setTexte("");
      setNote(5);
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'envoi");
    }
  };

  const supprimerFeedback = async (fid) => {
    try {
      await api.delete(`/feedbacks/${fid}`);
      setFeedbacks(feedbacks.filter((f) => f._id !== fid));
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const etoiles = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  if (erreur && !atelier) return <p className="error">{erreur}</p>;
  if (!atelier) return <p className="info">Chargement...</p>;

  return (
    <div>
      <Link to="/" className="back-link">← Retour aux ateliers</Link>

      <div className="panel detail-card">
        <span className={`badge badge-${atelier.niveau}`}>{atelier.niveau}</span>
        <h1>{atelier.titre}</h1>
        <p className="description">{atelier.description}</p>
        <div className="detail-meta">
          <span>Proposé par <strong>{atelier.auteur ? atelier.auteur.nom : "inconnu"}</strong></span>
          <span>Le <strong>{new Date(atelier.date).toLocaleDateString("fr-FR")}</strong></span>
        </div>
      </div>

      <h2 className="section-title" style={{ marginTop: 0 }}>
        Feedbacks ({feedbacks.length})
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="panel form-grid feedback-form">
          <textarea
            placeholder="Votre avis sur cet atelier"
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            required
          />
          <select value={note} onChange={(e) => setNote(e.target.value)}>
            <option value={5}>5 - Excellent</option>
            <option value={4}>4 - Très bien</option>
            <option value={3}>3 - Bien</option>
            <option value={2}>2 - Moyen</option>
            <option value={1}>1 - Décevant</option>
          </select>
          <button type="submit">Envoyer le feedback</button>
          {erreur && <p className="error">{erreur}</p>}
        </form>
      ) : (
        <p className="info">Connectez-vous pour laisser un feedback.</p>
      )}

      {feedbacks.length === 0 && <p className="empty">Aucun feedback pour le moment.</p>}

      <div className="feedback-list">
        {feedbacks.map((f) => (
          <div key={f._id} className="feedback">
            <div className="feedback-head">
              <div className="feedback-author">
                <div className="avatar">{f.auteur ? f.auteur.nom.charAt(0).toUpperCase() : "?"}</div>
                <span>{f.auteur ? f.auteur.nom : "inconnu"}</span>
              </div>
              {f.note && <span className="stars">{etoiles(f.note)}</span>}
            </div>
            <p>{f.texte}</p>
            {user && f.auteur && user.id === f.auteur._id && (
              <button className="btn-danger" style={{ marginTop: 12 }} onClick={() => supprimerFeedback(f._id)}>
                Supprimer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AtelierDetail;