const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestedBook: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    offeredBook: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true},
    status: {
        type: String,
        enum: ["pendiente", "aceptado", "rechazado"],
        default: "pendiente"
    },
    requestedAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model("Exchange", exchangeSchema);