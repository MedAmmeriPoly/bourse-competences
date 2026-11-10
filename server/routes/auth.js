const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Fabrique un jeton JWT contenant l'id de l'utilisateur
const genererToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { nom, email, motDePasse } = req.body;

    if (!nom || !email || !motDePasse) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
    if (motDePasse.length < 6) {
      return res.status(400).json({ message: "Mot de passe : 6 caractères minimum" });
    }

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(motDePasse, salt);

    const user = await User.create({ nom, email, motDePasse: hash });

    res.status(201).json({
      token: genererToken(user._id),
      user: { id: user._id, nom: user.nom, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({ message: "Email et mot de passe obligatoires" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    const ok = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!ok) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    res.json({
      token: genererToken(user._id),
      user: { id: user._id, nom: user.nom, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
});

module.exports = router;