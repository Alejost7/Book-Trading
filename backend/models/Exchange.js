//const mongoose = require("mongoose");

/*const exchangeSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Exchange", exchangeSchema);*/
const mongoose = require("mongoose");
const responseSchema = new mongoose.Schema({
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredBook:  {
        bookId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        title:     String,
        condition: String
    },
    responseDate: { type: Date, default: Date.now },
    status:       { type: String, enum: ['pending','accepted','rejected'], default: 'pending' }
}, { _id: false });

const exchangeSchema = new mongoose.Schema({
    proposerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookOffered:   {
        bookId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        title:     String,
        author:    String,
        condition: String
    },
    status:        { type: String, enum: ['open','done'], default: 'open' },
    createdAt:     { type: Date, default: Date.now },
    responses:     [ responseSchema ],
    exchangeResult:{
        withUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        theirBook:  {
        bookId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        title:     String,
        condition: String
    },
    date:      Date
    }
});

exchangeSchema.index({ proposerId: 1, status: 1, createdAt: 1 }); 
module.exports = mongoose.model('Exchange', exchangeSchema);