import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      await register(nom, email, motDePasse);
      navigate("/");
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={handleSubmit} className="panel auth-card form-grid">
        <div>
          <h2>Rejoindre le club</h2>
          <p className="auth-subtitle">Créez votre compte en quelques secondes.</p>
        </div>
        <input
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe (6 caractères min.)"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit">Créer mon compte</button>
        {erreur && <p className="error">{erreur}</p>}
        <p className="auth-footer">
          Déjà membre ? <Link to="/login">Connectez-vous</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;