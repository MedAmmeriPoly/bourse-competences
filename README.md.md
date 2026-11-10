# Bourse de compétences

Application web MERN où les membres d'un club étudiant proposent de mini-ateliers
(« je t'apprends Git en 1h ») et laissent des feedbacks. Projet MERN Stack,
École Polytechnique de Sousse, 2025-2026.

## Liens

- Front-end (Vercel) : https://bourse-competences.vercel.app
- API (Render) : https://bourse-competences-api.onrender.com
- Dépôt : https://github.com/MedAmmeriPoly/bourse-competences

## Technologies

MongoDB Atlas, Express, React 18 (Vite), Node.js, Mongoose, JWT, bcryptjs, Axios, React Router.

## Fonctionnalités

- Inscription et connexion (mot de passe haché avec bcrypt, authentification par JWT)
- Visiteur : lecture seule (ateliers et feedbacks)
- Membre connecté : créer et supprimer ses ateliers, laisser et supprimer ses feedbacks
- Middleware `protect` qui contrôle `Authorization: Bearer <token>`

## Modèles Mongoose

- **User** : nom, email, motDePasse
- **Atelier** : titre, description, niveau, date, auteur (ref User)
- **Feedback** : texte, note, atelier (ref Atelier), auteur (ref User)

Relations 1-N : un User a plusieurs Ateliers, un Atelier a plusieurs Feedbacks (`.populate()`).

## Routes API

| Méthode | Route | Accès |
|---|---|---|
| POST | /api/auth/register | public |
| POST | /api/auth/login | public |
| GET | /api/ateliers | public |
| GET | /api/ateliers/:id | public |
| POST | /api/ateliers | protégé |
| DELETE | /api/ateliers/:id | protégé (auteur) |
| GET | /api/feedbacks/atelier/:id | public |
| POST | /api/feedbacks | protégé |
| DELETE | /api/feedbacks/:id | protégé (auteur) |

## Installation en local

```bash
git clone https://github.com/MedAmmeriPoly/bourse-competences.git
cd bourse-competences

# API
cd server
npm install
# créer server/.env avec PORT, MONGO_URI, JWT_SECRET
npm run dev

# Front (autre terminal)
cd client
npm install
# créer client/.env avec VITE_API_URL=http://localhost:5000/api
npm run dev
```

## Variables d'environnement

- `server/.env` : `PORT`, `MONGO_URI`, `JWT_SECRET`
- `client/.env` : `VITE_API_URL`

Les fichiers `.env` ne sont pas versionnés.

## Déploiement

MongoDB Atlas (M0), API sur Render (dossier `server/`), front sur Vercel (dossier `client/`).
