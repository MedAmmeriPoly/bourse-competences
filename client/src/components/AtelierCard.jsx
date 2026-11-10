import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AtelierCard({ atelier, onDelete }) {
  const { user } = useAuth();
  const estAuteur = user && atelier.auteur && user.id === atelier.auteur._id;

  return (
    <div className="card">
      <span className={`badge badge-${atelier.niveau}`}>{atelier.niveau}</span>
      <h3>
        <Link to={`/ateliers/${atelier._id}`}>{atelier.titre}</Link>
      </h3>
      <p>{atelier.description}</p>

      <div className="card-footer">
        <div>
          <div>Par {atelier.auteur ? atelier.auteur.nom : "inconnu"}</div>
          <div>{new Date(atelier.date).toLocaleDateString("fr-FR")}</div>
        </div>
        {estAuteur && (
          <button className="btn-danger" onClick={() => onDelete(atelier._id)}>
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}

export default AtelierCard;