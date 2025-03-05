const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");

// Fonction pour générer un token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, role } = req.body;

        // Vérifier si l'email existe déjà
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        // 🔥 Supprimer tout script ou balises HTML du nom
        const cleanName = sanitizeHtml(name, {
            allowedTags: [], // Supprime toutes les balises HTML
            allowedAttributes: {}
        });

        // Vérifier si l'utilisateur a tenté d'injecter du code malveillant
        if (name !== cleanName) {
            return res.status(400).json({ message: "Caractères interdits détectés dans le nom" });
        }

        // Créer l'utilisateur
        user = new User({ name: cleanName, email, password, role });
        await user.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Connexion de l'utilisateur
exports.login = async (req, res) => {
    console.log("🛑 Tentative de connexion avec :", req.body); // 🔥 Ajout de logs pour voir ce qui est envoyé

    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Identifiants invalides" });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Identifiants invalides" });
        }

        // Générer le token JWT
        const token = generateToken(user);
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Vérification du token JWT
exports.verifyToken = async (req, res) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Accès refusé, token manquant" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        res.json({ message: "Token valide", user: decoded });
    } catch (error) {
        res.status(401).json({ message: "Token invalide", error });
    }
};
