const express = require("express");
const { createOrder, getUserOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderController");
const { auth, isAdmin, isSeller } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Passer une commande (réservé aux acheteurs)
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "65f8b28e92e1c2b34a44a3b1"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Erreur (produit non disponible, stock insuffisant)
 */
router.post("/", auth, createOrder); // Passer une commande

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Récupérer les commandes de l'utilisateur (acheteur ou vendeur)
 *     tags: [Commandes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes de l'utilisateur
 */
router.get("/", auth, getUserOrders); // Voir les commandes de l'utilisateur

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Modifier le statut d'une commande (réservé aux vendeurs et admins)
 *     tags: [Commandes]
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
 *               status:
 *                 type: string
 *                 enum: [pending, shipped, delivered]
 *                 example: "shipped"
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       403:
 *         description: Accès refusé
 */
router.put("/:id", auth, isSeller, updateOrderStatus); // Modifier le statut d'une commande

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Supprimer une commande (réservé aux admins)
 *     tags: [Commandes]
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
 *         description: Commande supprimée avec succès
 *       403:
 *         description: Accès refusé
 */
router.delete("/:id", auth, isAdmin, deleteOrder); // Supprimer une commande (admin)

module.exports = router;
