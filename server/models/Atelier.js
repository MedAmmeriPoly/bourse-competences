const mongoose = require("mongoose");

const atelierSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    niveau: {
      type: String,
      enum: ["débutant", "intermédiaire", "avancé"],
      default: "débutant",
    },
    date: { type: Date, required: true },
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Atelier", atelierSchema);