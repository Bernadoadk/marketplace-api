const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
