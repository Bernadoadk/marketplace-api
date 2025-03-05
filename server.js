require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

// Initialisation de l'application
const app = express();

// Middleware de sécurité
app.use(helmet()); // Sécurise les headers HTTP
app.use(mongoSanitize()); // Protège contre l'injection NoSQL
console.log("🛡️ MongoDB Sanitize activé !");
app.use(xss()); // Protège contre les attaques XSS
app.use(hpp()); // Protège contre la pollution des paramètres HTTP

// Limite le nombre de requêtes par IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes max par IP
    message: "Trop de requêtes, veuillez réessayer plus tard."
});
app.use(limiter);

// Middleware global
app.use(express.json());
app.use(cors());

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connexion à MongoDB réussie"))
    .catch(err => console.error("❌ Erreur de connexion MongoDB :", err));

// Import des routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Définition des routes API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error("🔥 Erreur détectée :", err);
    res.status(500).json({ message: "Une erreur interne est survenue" });
});

const swaggerDocs = require("./config/swagger");
swaggerDocs(app);

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
