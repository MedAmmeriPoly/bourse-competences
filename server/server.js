require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


require("./models/User");
require("./models/Atelier");
require("./models/Feedback");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/ateliers", require("./routes/ateliers"));
app.use("/api/feedbacks", require("./routes/feedbacks"));

app.get("/", (req, res) => {
  res.json({ message: "API Bourse de compétences en marche" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté");
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion MongoDB :", err.message);
  });