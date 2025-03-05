const express = require("express");
const { register, login, verifyToken } = require("../controllers/authController");
const { auth } = require("../middleware/authMiddleware");
const { check } = require("express-validator");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jean Dupont"
 *               email:
 *                 type: string
 *                 example: "jean@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [buyer, seller, admin]
 *                 example: "buyer"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation ou email déjà utilisé
 */

// Route d'inscription
router.post("/register", [
    check("name", "Le nom est requis").not().isEmpty().escape(), // 🔥 Ajout de .escape() pour empêcher XSS
    check("email", "Email invalide").isEmail().normalizeEmail(),
    check("password", "Le mot de passe doit contenir au moins 6 caractères").isLength({ min: 6 })
], register);

// Route de connexion
router.post("/login", login);

// Vérifier le token
router.get("/verify", auth, verifyToken);

module.exports = router;
