require("dotenv").config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/dataBase');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const booksRoutes = require('./routes/books.routes');
const donationsRoutes = require('./routes/donations.routes');
const exchangesRoutes = require('./routes/exchanges.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const offersRoutes = require('./routes/offer.routes')

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a base de datos
connectDB();

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/exchanges', exchangesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/offers', offersRoutes);

// Ruta de prueba
app.get('/', (req, res) => res.send('Servidor corriendo 🚀'));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
server.listen(PORT, () => console.log("Servidor corriendo en http://localhost:5000"));