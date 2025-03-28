const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true},
    author: { type: String, required: true},
    image: { type: String, default: "https://via.placeholder.com/150" },
    status: {
        type: String,
        enum: ["Disponible", "En intercambio", "intercambiado"],
        default: "Disponible"
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Book", bookSchema);