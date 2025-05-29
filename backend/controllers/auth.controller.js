const User = require("../models/User");


exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email.includes("@") || password.length < 6) {
            return res.status(400).json({ message: "Correo inválido o contraseña muy corta" });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Crear el usuario
        const newUser = new User({ email, password });
        await newUser.save();

        // Responder con el userId
        res.status(201).json({ 
            message: "Usuario registrado exitosamente", 
            userId: newUser._id 
        });
    } catch (error) {
        console.log("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

exports.login = async (req, res) => {  // Endpoint de inicio de sesión
    try {
        const { email, password } = req.body;

        // Verificar si el usuario ya existe
        const user = await User.findOne({ email, password});

        if (!user) {
            return res.status(401).json({ message: "correo o contraseña incorrectos"});
        }

        res.status(200).json({ message: "Inicio de sesión exitoso ", userId: user._id});
        
    } catch (error) {
        console.log("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error en el servidor"});
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { id } = req.query;

        if (id) {
            const user = await User.findById(id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            return res.json(user);  // Devuelve un solo objeto
        }

        // Si no se proporciona ID, devuelve todos
        const users = await User.find({}, "-password");
        res.json(users);
    } catch (error) {
        console.log("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
