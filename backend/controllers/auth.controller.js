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

// Actualizar nombre de usuario
exports.updateUserName = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Nombre requerido" });

        const user = await User.findByIdAndUpdate(id, { name }, { new: true, select: '-password' });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json({ message: "Nombre actualizado", user });
    } catch (error) {
        console.log("Error al actualizar nombre:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

// Actualizar correo y/o contraseña
exports.updateUserConfig = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;

        const updateFields = {};
        if (email) updateFields.email = email;
        if (password) {
            if (password.length < 6) return res.status(400).json({ message: "Contraseña muy corta" });
            updateFields.password = password;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "Nada para actualizar" });
        }

        const user = await User.findByIdAndUpdate(id, updateFields, { new: true, select: '-password' });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json({ message: "Configuración actualizada", user });
    } catch (error) {
        console.log("Error al actualizar configuración:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

