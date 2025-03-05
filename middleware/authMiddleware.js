const jwt = require("jsonwebtoken");

// Vérifie si l'utilisateur est authentifié
exports.auth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Accès refusé" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide" });
    }
};

// Vérifie si l'utilisateur a le rôle admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Accès interdit" });
    }
    next();
};

// Vérifie si l'utilisateur a le rôle vendeur
exports.isSeller = (req, res, next) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({ message: "Accès interdit" });
    }
    next();
};
