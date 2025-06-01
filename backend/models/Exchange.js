const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestedBook: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    offeredBook: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    status: {
        type: String,
        enum: ["pendiente", "aceptado", "rechazado", "completado"],
        default: "pendiente"
    },
    exchangeDetails: {
        requesterAddress: String,
        requesterPhone: String,
        requesterEmail: String,
        ownerAddress: String,
        ownerPhone: String,
        ownerEmail: String,
        meetingPoint: String,
        meetingDate: Date,
        status: {
            type: String,
            enum: ["pending_meetup", "meetup_scheduled", "completed"],
            default: "pending_meetup"
        }
    },
    requestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Exchange", exchangeSchema);