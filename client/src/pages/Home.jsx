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
      <h2>Ateliers proposés</h2>

      {user ? (
        <AtelierForm onAjout={ajouterAtelier} />
      ) : (
        <p>
          <em>Connectez-vous pour proposer un atelier ou laisser un feedback.</em>
        </p>
      )}

      {chargement && <p>Chargement...</p>}
      {erreur && <p style={{ color: "red" }}>{erreur}</p>}
      {!chargement && ateliers.length === 0 && <p>Aucun atelier pour le moment.</p>}

      {ateliers.map((atelier) => (
        <AtelierCard key={atelier._id} atelier={atelier} onDelete={supprimerAtelier} />
      ))}
    </div>
  );
}

export default Home;