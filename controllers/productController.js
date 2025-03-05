const Product = require("../models/Product");

// Ajouter un produit (réservé aux vendeurs)
exports.addProduct = async (req, res) => {
    try {
        if (req.user.role !== "seller") {
            return res.status(403).json({ message: "Seuls les vendeurs peuvent ajouter des produits" });
        }

        const { name, description, price, stock } = req.body;
        const product = new Product({
            seller: req.user.id,
            name,
            description,
            price,
            stock
        });

        await product.save();
        res.status(201).json({ message: "Produit ajouté avec succès", product });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Obtenir tous les produits
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("seller", "name email");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Obtenir un seul produit par ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("seller", "name email");
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Modifier un produit (réservé au vendeur propriétaire)
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });

        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        const { name, description, price, stock } = req.body;
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;

        await product.save();
        res.json({ message: "Produit mis à jour", product });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Supprimer un produit (réservé au vendeur propriétaire)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });

        if (product.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        await product.remove();
        res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
