import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AtelierCard({ atelier, onDelete }) {
  const { user } = useAuth();

  const estAuteur = user && atelier.auteur && user.id === atelier.auteur._id;

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, margin: "12px 0" }}>
      <h3>
        <Link to={`/ateliers/${atelier._id}`}>{atelier.titre}</Link>
      </h3>
      <p>{atelier.description}</p>
      <p>
        Niveau : <strong>{atelier.niveau}</strong> | Date :{" "}
        {new Date(atelier.date).toLocaleDateString("fr-FR")}
      </p>
      <p>Proposé par : {atelier.auteur ? atelier.auteur.nom : "inconnu"}</p>

      {estAuteur && (
        <button onClick={() => onDelete(atelier._id)}>Supprimer</button>
      )}
    </div>
  );
}

export default AtelierCard;