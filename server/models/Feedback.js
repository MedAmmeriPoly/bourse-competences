const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    texte: { type: String, required: true },
    note: { type: Number, min: 1, max: 5 },
    atelier: { type: mongoose.Schema.Types.ObjectId, ref: "Atelier", required: true },
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);