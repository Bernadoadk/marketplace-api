const Order = require("../models/Order");
const Product = require("../models/Product");

// Créer une commande
exports.createOrder = async (req, res) => {
    try {
        const { products } = req.body; // Liste des produits avec leur quantité

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "La commande doit contenir au moins un produit" });
        }

        let totalPrice = 0;
        const orderItems = [];

        // Vérifier la disponibilité des produits et calculer le total
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Produit non trouvé : ${item.product}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Stock insuffisant pour le produit ${product.name}` });
            }

            // Déduire le stock
            product.stock -= item.quantity;
            await product.save();

            orderItems.push({ product: product._id, quantity: item.quantity });
            totalPrice += product.price * item.quantity;
        }

        const order = new Order({
            buyer: req.user.id,
            products: orderItems,
            totalPrice
        });

        await order.save();
        res.status(201).json({ message: "Commande créée avec succès", order });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Obtenir les commandes d'un utilisateur (acheteur ou vendeur)
exports.getUserOrders = async (req, res) => {
    try {
        let orders;
        if (req.user.role === "seller") {
            // Récupérer les commandes contenant les produits du vendeur
            orders = await Order.find().populate({
                path: "products.product",
                match: { seller: req.user.id }
            });
            orders = orders.filter(order => order.products.some(p => p.product));
        } else {
            // Récupérer les commandes d'un acheteur
            orders = await Order.find({ buyer: req.user.id }).populate("products.product");
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Mettre à jour le statut d'une commande (seulement les vendeurs et admins)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        if (req.user.role !== "seller" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Accès refusé" });
        }

        if (!["pending", "shipped", "delivered"].includes(status)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

        order.status = status;
        await order.save();
        res.json({ message: "Statut de la commande mis à jour", order });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Supprimer une commande (optionnel, réservé aux admins)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Accès refusé" });
        }

        await Order.deleteOne({ _id: order._id }); // ✅ Remplace .remove() par .deleteOne()

        res.json({ message: "Commande supprimée avec succès" });
    } catch (error) {
        console.error("🔥 Erreur lors de la suppression de la commande :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

