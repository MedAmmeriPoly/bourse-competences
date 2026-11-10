const express = require("express");
const Feedback = require("../models/Feedback");
const Atelier = require("../models/Atelier");
const protect = require("../middleware/protect");

const router = express.Router();

// GET /api/feedbacks/atelier/:atelierId : public
router.get("/atelier/:atelierId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ atelier: req.params.atelierId })
      .populate("auteur", "nom")
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(400).json({ message: "Identifiant invalide" });
  }
});

// POST /api/feedbacks : protégé
router.post("/", protect, async (req, res) => {
  try {
    const { texte, note, atelier } = req.body;

    if (!texte || !atelier) {
      return res.status(400).json({ message: "Texte et atelier obligatoires" });
    }

    const existe = await Atelier.findById(atelier);
    if (!existe) {
      return res.status(404).json({ message: "Atelier introuvable" });
    }

    const feedback = await Feedback.create({
      texte,
      note,
      atelier,
      auteur: req.user._id,
    });

    const complet = await feedback.populate("auteur", "nom");
    res.status(201).json(complet);
  } catch (err) {
    res.status(400).json({ message: "Données invalides", erreur: err.message });
  }
});

// DELETE /api/feedbacks/:id : protégé, seulement l'auteur
router.delete("/:id", protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback introuvable" });
    }

    if (feedback.auteur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Vous ne pouvez supprimer que vos feedbacks" });
    }

    await feedback.deleteOne();
    res.json({ message: "Feedback supprimé" });
  } catch (err) {
    res.status(400).json({ message: "Identifiant invalide" });
  }
});

module.exports = router;