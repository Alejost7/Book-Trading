const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type:           { type: String, enum: ['exchange_request','exchange_accepted','exchange_rejected','meetup_scheduled', 'exchange_completed'], required: true },
    message:        { type: String, required: true },
    relatedExchange:{ type: mongoose.Schema.Types.ObjectId, ref: 'Exchange' },
    read:           { type: Boolean, default: false },
    createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);