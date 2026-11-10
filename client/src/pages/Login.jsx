import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      await login(email, motDePasse);
      navigate("/");
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={handleSubmit} className="panel auth-card form-grid">
        <div>
          <h2>Bon retour 👋</h2>
          <p className="auth-subtitle">Connectez-vous pour proposer des ateliers.</p>
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
        {erreur && <p className="error">{erreur}</p>}
        <p className="auth-footer">
          Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;