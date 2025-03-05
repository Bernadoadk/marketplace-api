# 📌 API de Gestion de Marketplace

## 🌍 Description
Cette API permet aux utilisateurs de **s'inscrire, vendre des produits, passer des commandes et gérer les transactions**. Elle est sécurisée avec **JWT** et suit une architecture **REST**.

---
## 🚀 Technologies utilisées
- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB Atlas
- **Authentification** : JSON Web Tokens (JWT)
- **Sécurité** : Helmet, Express-Rate-Limit, Express-Mongo-Sanitize, XSS-Clean, HPP
- **Documentation** : Swagger UI
- **Déploiement** : Railway

---
## 📥 Installation & Configuration
### 📌 Prérequis
- Node.js installé
- Un compte MongoDB Atlas
- Un compte Railway

### 📌 Installation
```bash
# Cloner le projet
git clone https://github.com/Bernadoadk/marketplace-api
cd marketplace-api

# Installer les dépendances
npm install
```

### 📌 Configuration de l’environnement
Créer un fichier `.env` à la racine et ajouter :
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/marketplace
JWT_SECRET=supersecretkey
```

---
## 📌 Structure du Projet
```
marketplace-api/
│── config/
│   ├── swagger.js
│── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│── middleware/
│   ├── authMiddleware.js
│── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│── server.js
│── package.json
│── .env
```

---
## 📌 Endpoints Principaux
### 🔐 Authentification
- `POST /api/auth/register` → Inscription
- `POST /api/auth/login` → Connexion
- `GET /api/auth/verify` → Vérification du token

### 🛍️ Gestion des Produits
- `POST /api/products` → Ajouter un produit (vendeur)
- `GET /api/products` → Lister les produits
- `PUT /api/products/:id` → Modifier un produit (vendeur)
- `DELETE /api/products/:id` → Supprimer un produit (vendeur)

### 📦 Gestion des Commandes
- `POST /api/orders` → Passer une commande (acheteur)
- `GET /api/orders` → Voir ses commandes
- `PUT /api/orders/:id` → Modifier une commande (vendeur/admin)
- `DELETE /api/orders/:id` → Supprimer une commande (admin)

---
## 📜 Documentation API avec Swagger
La documentation interactive est disponible à l’URL suivante :
```
/api-docs
```

---
## 🌐 Déploiement sur Railway
1️⃣ **Créer un projet sur Railway et connecter le repo GitHub**
2️⃣ **Ajouter les variables d’environnement** (`MONGO_URI`, `JWT_SECRET`)
3️⃣ **Lancer le déploiement** et récupérer l’URL de l’API

---
## 📌 Améliorations Futures
✅ Ajout des tests unitaires (Jest & Supertest)
✅ Intégration de paiement (Stripe, Flutterwave...)
✅ Rôles avancés (Super Admin, gestion des permissions)

---
📌 **Développé par : Bernado ADIKPETO** 🚀

