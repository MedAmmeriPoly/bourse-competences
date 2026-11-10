import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AtelierCard from "../components/AtelierCard";
import AtelierForm from "../components/AtelierForm";

function Home() {
  const [ateliers, setAteliers] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const charger = async () => {
      try {
        const { data } = await api.get("/ateliers");
        setAteliers(data);
      } catch (err) {
        setErreur("Impossible de charger les ateliers");
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const ajouterAtelier = (nouveau) => {
    setAteliers([...ateliers, nouveau]);
  };

  const supprimerAtelier = async (id) => {
    if (!window.confirm("Supprimer cet atelier ?")) return;
    try {
      await api.delete(`/ateliers/${id}`);
      setAteliers(ateliers.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <section className="hero">
        <h1>
          Partage ce que tu sais, <span>apprends le reste</span>
        </h1>
        <p>
          Des mini-ateliers proposés par les membres du club : une heure, une compétence, une
          rencontre.
        </p>
      </section>

      {user ? (
        <AtelierForm onAjout={ajouterAtelier} />
      ) : (
        <p className="info">Connectez-vous pour proposer un atelier ou laisser un feedback.</p>
      )}

      <h2 className="section-title">Ateliers proposés</h2>

      {chargement && <p className="info">Chargement...</p>}
      {erreur && <p className="error">{erreur}</p>}
      {!chargement && ateliers.length === 0 && <p className="empty">Aucun atelier pour le moment.</p>}

      <div className="grid">
        {ateliers.map((atelier) => (
          <AtelierCard key={atelier._id} atelier={atelier} onDelete={supprimerAtelier} />
        ))}
      </div>
    </div>
  );
}

export default Home;