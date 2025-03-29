require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const User = require("./models/User");  // Importar el modelo de usuario
const Book = require("./models/Books");
const Exchange = require("./models/Exchange");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("🟢 Conectado a MongoDB Atlas"))
.catch(err => console.error("🔴 Error conectando a MongoDB:", err));

async function createAdminUser() {
    const adminEmail = "admin@example.com"; // Cambiar esto por el correo del admin
    const extingAdmin = await User.findOne({ email: adminEmail });
    if (!extingAdmin) {
        const admin = new User({
            name: "Admin",
            email: adminEmail,
            password: "tupassword", // Cambiar esto por una contraseña segura
            role: "admin"
        });
        await admin.save();
        console.log("Usuario admin creado:", admin);
    }
}

createAdminUser();

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
});


app.post("/login", async (req, res) => {  // Endpoint de inicio de sesión
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
});

app.get("/users",  async (req, res) => {  // Endpoint para obtener todos los usuarios
    try {
        const users = await User.find({}, "-password");
        res.json(users);
    } catch (error) {
        console.log("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error en el servidor"});
    }
});

app.get("/books", async (req, res) => {  // Endpoint para obtener todos los libros menos los del usuario logueado
    try {
        const { excludeOwner } = req.query;
        const query = { status: "Disponible" };
        if (excludeOwner) {
            query.owner = { $ne: excludeOwner };
        }
        const books = await Book.find(query).populate("owner", "email");
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener libros"});
    }
});

app.get("/allBooks", async (req, res) => {  // Endpoint para obtener todos los libros
    try {
        const books = await Book.find().populate("owner", "email"); 
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener libros"});
    }
});

app.get("/myBooks", async (req, res) => {  // Endpoint para obtener los libros de un usuario
    try {
        const { owner } = req.query;

        if (!owner || !mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ message: "El ID del usuario no es válido." });
        }

        const books = await Book.find({ owner }).populate("owner", "email");
        res.json(books);
    } catch (error) {
        console.error("Error en /myBooks:", error);
        res.status(500).json({ message: "Error al obtener los libros del usuario." });
    }
});



app.post("/addBooks", async (req, res) => {  // Endpoint para agregar un nuevo libro
    try {
        const { title, author, image, owner} = req.body;

        // convertir owner a objectId
        if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ message: "El ID del propietario no es válido." });
        }
        const ownerId = new mongoose.Types.ObjectId(owner);

        // crear nuevo libro
        const newBook = new Book({ title, author, image, owner: ownerId });
        await newBook.save();
        res.status(201).json({message: "Libro agregado correctamente", newBook });
    } catch (error) {
        console.error("Error en addBooks: ", error);
        res.status(500).json({message: "Error al agregar libro ", error: error.message});
    }
});

app.post("/exchanges", async (req, res) => { // Endpoint para crear un nuevo intercambio
    try {
        const { requester, requestedBookId, offeredBookId } = req.body;
        const requestedBook = await Book.findById(requestedBookId);
        if (!requestedBook || requestedBook.status != "Disponible") {
            return res.status(400).json({ message: "Libro no disponible para intercambio"});
        }
        // Verificar que el libro ofrecido también esté disponible
        const offeredBook = await Book.findById(offeredBookId);
        if (!offeredBook || offeredBook.status !== "Disponible") {
        return res.status(400).json({ message: "El libro ofrecido no está disponible para intercambio" });
    }
        // Crear la solicitud de intercambio
        const newExchange = new Exchange({
        requester,
        requestedBook: requestedBookId,
        offeredBook: offeredBookId,
    });

    // actualizar el estado de los libros a "En intercambio"
    requestedBook.status = "En intercambio";
    offeredBook.status = "En intercambio";

    await requestedBook.save();
    await offeredBook.save();
    await newExchange.save();

    res.status(201).json({ message: "Solicitud de intercambio enviada", newExchange });
    } catch (error) {
        res.status(500).json({ message: "Error al solicitar el intercambio" });
    }
});

app.patch("/exchange/:id", async (req, res) => { // Endpoint para actualizar el estado de un intercambio
    try {
        const { status } = req.body;
        const exchange = await Exchange.findById(req.params.id)
        .populate("requestedBook")
        .populate("offeredBook")

        if (!exchange) {
            return res.status(404).json({ message: "Solicitud no encontrada "});
        }

        exchange.status = status;
        // si se rechaza, se puede devolver el libro a "disponible"
        if (status === "rechazado") {
            exchange.requestedBook.status = "Disponible";
            exchange.offeredBook.status = "Disponible";
            await exchange.requestedBook.save();
            await exchange.offeredBook.save();
        }
        if (status === "aceptado") {
            exchange.requestedBook.status = "intercambiado";
            exchange.offeredBook.status = "intercambiado";
            await exchange.requestedBook.save();
            await exchange.offeredBook.save();
        }

        await exchange.save();
        res.json({ message: "Estado de solicitud acutalizado", exchange });
    }   catch (error) {
        res.status(500).json({ message: "Error al actualizar la solicitud"});
    }

});

app.post("/donate", async (req, res) => {  // Donar un libro 
    try {
        const { bookId, userId } = req.body;
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Libro no encontrado" });


        // Buscar el usuario admin
        const adminUser = await User.findOne({ role: "admin"} );
        if (!adminUser) return res.status(404).json({ message: "Usuario admin no encontrado" });

        book.owner = adminUser._id; // Se transfiere al usuario especial
        book.isDonation = true;
        book.status = "Disponible";
        book.previousOwners.push(userId);

        await book.save();
        res.json({ message: "Libro donado exitosamente"})        
    } catch (error) {
        res.status(500).json({ message: "Error al donar libro" });
    }
});

app.get("/donations", async (req, res) => {  // Obtener todos los libros donados
    try {
        const books = await Book.find({isDonation: true, status: "Disponible" });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener libros de donación" });
    }
})


app.post("/exchangeDonation", async (req, res) => {  // Intercambiar un libro con uno donado
    try {
        const { donatedBookId, userBookId, userId } = req.body;

        const donatedBook = await Book.findById(donatedBookId);
        const userBook = await Book.findById(userBookId);

        if (!donatedBook || !userBook) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        if (donatedBook.status !== "available") {
            return res.status(400).json({ message: "El libro ya fue tomado" });
        }

        // Intercambio de dueños
        const adminId = donatedBook.owner;
        donatedBook.owner = userId;
        donatedBook.isDonation = false;
        donatedBook.previousOwners.push(adminId);
        donatedBook.status = "exchanged";

        userBook.owner = adminId;
        userBook.status = "available";

        await donatedBook.save();
        await userBook.save();

        res.json({ message: "Intercambio exitoso" });
    } catch (error) {
        res.status(500).json({ message: "Error al intercambiar" });
    }
});

app.listen(5000, () => console.log("Servidor corriendo en http://localhost:5000"));
