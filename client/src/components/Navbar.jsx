import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          Bourse de <span>compétences</span>
        </Link>

        <div className="nav-actions">
          {user ? (
            <div className="nav-user">
              <div className="avatar">{user.nom.charAt(0).toUpperCase()}</div>
              <span>{user.nom}</span>
              <button className="btn-outline" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">Connexion</Link>
              <Link to="/register" className="btn-primary-link">Inscription</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;