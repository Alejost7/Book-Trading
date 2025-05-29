const mongoose = require('mongoose');

module.exports = function connectDB() {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('🟢 MongoDB conectado'))
    .catch(err => console.error('🔴 Error MongoDB:', err));
};