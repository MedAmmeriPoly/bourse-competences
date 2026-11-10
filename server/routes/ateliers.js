const express = require("express");
const Atelier = require("../models/Atelier");
const Feedback = require("../models/Feedback");
const protect = require("../middleware/protect");

const router = express.Router();

// GET /api/ateliers : public, liste avec le nom de l'auteur
router.get("/", async (req, res) => {
  try {
    const ateliers = await Atelier.find()
      .populate("auteur", "nom")
      .sort({ date: 1 });
    res.json(ateliers);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", erreur: err.message });
  }
});

// GET /api/ateliers/:id : public, un atelier
router.get("/:id", async (req, res) => {
  try {
    const atelier = await Atelier.findById(req.params.id).populate("auteur", "nom");
    if (!atelier) {
      return res.status(404).json({ message: "Atelier introuvable" });
    }
    res.json(atelier);
  } catch (err) {
    res.status(400).json({ message: "Identifiant invalide" });
  }
});

// POST /api/ateliers : protégé
router.post("/", protect, async (req, res) => {
  try {
    const { titre, description, niveau, date } = req.body;

    if (!titre || !description || !date) {
      return res.status(400).json({ message: "Titre, description et date obligatoires" });
    }

    const atelier = await Atelier.create({
      titre,
      description,
      niveau,
      date,
      auteur: req.user._id,
    });

    const complet = await atelier.populate("auteur", "nom");
    res.status(201).json(complet);
  } catch (err) {
    res.status(400).json({ message: "Données invalides", erreur: err.message });
  }
});

// DELETE /api/ateliers/:id : protégé, seulement l'auteur
router.delete("/:id", protect, async (req, res) => {
  try {
    const atelier = await Atelier.findById(req.params.id);
    if (!atelier) {
      return res.status(404).json({ message: "Atelier introuvable" });
    }

    if (atelier.auteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Vous ne pouvez supprimer que vos ateliers" });
    }

    await Feedback.deleteMany({ atelier: atelier._id });
    await atelier.deleteOne();

    res.json({ message: "Atelier supprimé" });
  } catch (err) {
    res.status(400).json({ message: "Identifiant invalide" });
  }
});

module.exports = router;