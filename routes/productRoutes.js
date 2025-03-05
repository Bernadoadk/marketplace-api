const express = require("express");
const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const { auth, isSeller } = require("../middleware/authMiddleware");

const router = express.Router();
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Ajouter un produit (réservé aux vendeurs)
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop HP"
 *               description:
 *                 type: string
 *                 example: "Un ordinateur portable performant"
 *               price:
 *                 type: number
 *                 example: 500000
 *               stock:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Produit ajouté avec succès
 *       403:
 *         description: Accès refusé (seuls les vendeurs peuvent ajouter des produits)
 */
router.post("/", auth, isSeller, addProduct); // Ajouter un produit

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupérer tous les produits
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits
 */
router.get("/", getAllProducts); // Obtenir tous les produits

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupérer un produit par ID
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65f8b28e92e1c2b34a44a3b1"
 *     responses:
 *       200:
 *         description: Produit trouvé
 *       404:
 *         description: Produit non trouvé
 */
router.get("/:id", getProductById); // Obtenir un produit par ID

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Modifier un produit (réservé au vendeur propriétaire)
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65f8b28e92e1c2b34a44a3b1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 example: 480000
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *       403:
 *         description: Accès refusé
 */
router.put("/:id", auth, isSeller, updateProduct); // Modifier un produit

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Supprimer un produit (réservé au vendeur propriétaire)
 *     tags: [Produits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65f8b28e92e1c2b34a44a3b1"
 *     responses:
 *       200:
 *         description: Produit supprimé
 *       403:
 *         description: Accès refusé
 */
router.delete("/:id", auth, isSeller, deleteProduct); // Supprimer un produit

module.exports = router;
