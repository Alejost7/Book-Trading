require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const User = require("./models/User");  // Importar el modelo de usuario


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("🟢 Conectado a MongoDB Atlas"))
.catch(err => console.error("🔴 Error conectando a MongoDB:", err));

app.get("/", (req, res) => {
    res.send("¡Servidor funcionando!");
});

app.get("/api/mensaje", (req, res) => {
    res.json({ mensaje: "Hola desde el servidor!!!!"});
});

app.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email.includes("@") || password.length < 6) {
            return res.status(400).json({ message: "correo invalido o contraseña muy corta"});
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe"});
        }

        const newUser = new User({ email, password});
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado exitosamente"});
    } catch (error) {
        console.log("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error en el servidor"});
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario ya existe
        const user = await User.findOne({ email, password});

        if (!user) {
            return res.status(401).json({ message: "correo o contraseña incorrectos"});
        }

        res.status(200).json({ message: "Inicio de sesión exitoso "});
        
    } catch (error) {
        console.log("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error en el servidor"});
    }
});

app.get("/users",  async (req, res) => {
    try {
        const users = await User.find({}, "-password");
        res.json(users);
    } catch (error) {
        console.log("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error en el servidor"});
    }
});

app.listen(5000, () => console.log("Servidor corriendo en http://localhost:5000"));
