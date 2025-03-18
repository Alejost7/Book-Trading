const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const users = [];  // Aquí se almacenarán los usuarios registrados

app.get("/", (req, res) => {
    res.send("¡Servidor funcionando!");
});

app.get("/api/mensaje", (req, res) => {
    res.json({ mensaje: "Hola desde el servidor!!!!"});
});

app.post("/register", (req, res) => {
    console.log("Body recibido:", req.body);
    const { email, password } = req.body;

    if (!email.includes("@") || password.length < 6) {
        return res.status(400).json({ message: "correo invalido o contraseña muy corta"});
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe"});
    }

    users.push({ email, password });
    res.status(201).json({ message: "Usuario registrado exitosamente"});
});

app.post("/login", (req, res) => {
    console.log("Body recibido:", req.body);
    const { email, password } = req.body;

    // Verificar si el usuario ya existe
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        return res.status(401).json({ message: "correo o contraseña incorrectos"});
    }

    res.status(200).json({ message: "Inicio de sesión exitoso "});
})

app.get("/users", (req, res) => {
    res.json(users);
});

app.listen(5000, () => console.log("Servidor corriendo en http://localhost:5000"));
