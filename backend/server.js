require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const User = require("./models/User");  // Importar el modelo de usuario
const Book = require("./models/Books");
const Exchange = require("./models/Exchange");
const Notification = require("./models/Notification");

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
        const query = { 
            status: "Disponible",
            $or: [
                { isDonation: true },
                { isOfferedForExchange: true }
            ]
        };
        if (excludeOwner) {
            query.owner = { $ne: excludeOwner };
        }
        const books = await Book.find(query).populate("owner", "email");
        
        // Procesar los libros para extraer el nombre de usuario del correo
        const processedBooks = books.map(book => {
            const userEmail = book.owner?.email || '';
            const username = userEmail.split('@')[0] || 'Usuario';
            return {
                ...book.toObject(),
                owner: {
                    ...book.owner?.toObject(),
                    name: username
                }
            };
        });
        
        res.json(processedBooks);
    } catch (error) {
        console.error("Error en /books:", error); // Para debugging
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
        
        // Verificar que el libro solicitado existe y está disponible
        const requestedBook = await Book.findById(requestedBookId).populate('owner');
        if (!requestedBook) {
            return res.status(404).json({ message: "Libro solicitado no encontrado" });
        }
        if (requestedBook.status !== "Disponible") {
            return res.status(400).json({ message: "El libro solicitado no está disponible para intercambio" });
        }

        // Verificar que el libro ofrecido existe y está disponible
        const offeredBook = await Book.findById(offeredBookId).populate('owner');
        if (!offeredBook) {
            return res.status(404).json({ message: "Libro ofrecido no encontrado" });
        }
        if (offeredBook.status !== "Disponible") {
            return res.status(400).json({ message: "El libro ofrecido no está disponible para intercambio" });
        }

        // Verificar que el libro ofrecido pertenece al solicitante
        if (offeredBook.owner._id.toString() !== requester) {
            return res.status(403).json({ message: "No puedes ofrecer un libro que no te pertenece" });
        }

        // Crear la solicitud de intercambio
        const newExchange = new Exchange({
            requester,
            requestedBook: requestedBookId,
            offeredBook: offeredBookId,
            status: "pendiente"
        });

        // Actualizar el estado de los libros a "En intercambio"
        requestedBook.status = "En intercambio";
        offeredBook.status = "En intercambio";

        await Promise.all([
            requestedBook.save(),
            offeredBook.save(),
            newExchange.save()
        ]);

        // Crear notificación para el propietario del libro solicitado
        const ownerNotification = new Notification({
            recipient: requestedBook.owner._id,
            type: 'exchange_request',
            message: `Nueva solicitud de intercambio para el libro "${requestedBook.title}"`,
            relatedExchange: newExchange._id
        });

        // Crear notificación para el solicitante
        const requesterNotification = new Notification({
            recipient: requester,
            type: 'exchange_request_sent',
            message: `Has solicitado intercambiar "${requestedBook.title}" con "${offeredBook.title}"`,
            relatedExchange: newExchange._id
        });

        await Promise.all([
            ownerNotification.save(),
            requesterNotification.save()
        ]);

        // Obtener el intercambio con toda la información necesaria
        const populatedExchange = await Exchange.findById(newExchange._id)
            .populate({
                path: 'requestedBook',
                populate: { path: 'owner', select: 'email' }
            })
            .populate({
                path: 'offeredBook',
                populate: { path: 'owner', select: 'email' }
            })
            .populate('requester', 'email');

        res.status(201).json({ 
            message: "Solicitud de intercambio creada exitosamente",
            newExchange: populatedExchange
        });
    } catch (error) {
        console.error('Error al crear intercambio:', error);
        res.status(500).json({ message: 'Error al crear la solicitud de intercambio' });
    }
});

app.patch("/exchanges/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const exchange = await Exchange.findById(req.params.id)
            .populate({
                path: 'requestedBook',
                populate: { path: 'owner', select: 'email' }
            })
            .populate({
                path: 'offeredBook',
                populate: { path: 'owner', select: 'email' }
            })
            .populate('requester', 'email');

        if (!exchange) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        exchange.status = status;
        
        // Crear notificación según el estado
        if (status === "rechazado") {
            exchange.requestedBook.status = "Disponible";
            exchange.offeredBook.status = "Disponible";
            await Promise.all([
                exchange.requestedBook.save(),
                exchange.offeredBook.save()
            ]);

            const notification = new Notification({
                recipient: exchange.requester._id,
                type: 'exchange_rejected',
                message: `Tu solicitud de intercambio para "${exchange.requestedBook.title}" fue rechazada`,
                relatedExchange: exchange._id
            });
            await notification.save();
        }
        
        if (status === "aceptado") {
            const notification = new Notification({
                recipient: exchange.requester._id,
                type: 'exchange_accepted',
                message: `Tu solicitud de intercambio para "${exchange.requestedBook.title}" fue aceptada`,
                relatedExchange: exchange._id
            });
            await notification.save();
        }

        await exchange.save();

        // Devolver el intercambio actualizado y poblado
        const updatedExchange = await Exchange.findById(exchange._id)
            .populate({
                path: 'requestedBook',
                populate: { path: 'owner', select: 'email' }
            })
            .populate({
                path: 'offeredBook',
                populate: { path: 'owner', select: 'email' }
            })
            .populate('requester', 'email');

        res.json({ 
            message: "Estado de solicitud actualizado", 
            exchange: updatedExchange 
        });
    } catch (error) {
        console.error('Error al actualizar el intercambio:', error);
        res.status(500).json({ message: "Error al actualizar la solicitud" });
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

// Nuevos endpoints para notificaciones
app.get("/notifications/:userId", async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('relatedExchange');
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener notificaciones" });
    }
});

app.patch("/notifications/:id/read", async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: "Notificación no encontrada" });
        }
        notification.read = true;
        await notification.save();
        res.json({ message: "Notificación marcada como leída" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la notificación" });
    }
});

// Nuevo endpoint para ofertar un libro para intercambio
app.patch("/books/:id/offer", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        // Asegurarse de que el libro esté disponible antes de ofertarlo
        if (book.status !== "Disponible") {
            return res.status(400).json({ message: "Solo se pueden ofertar libros que estén disponibles" });
        }

        book.isOfferedForExchange = true;
        book.status = "Disponible"; // Asegurarse de que el estado sea Disponible
        await book.save();

        res.json({ message: "Libro ofertado para intercambio", book });
    } catch (error) {
        console.error("Error al ofertar libro:", error);
        res.status(500).json({ message: "Error al ofertar el libro" });
    }
});

// Nuevo endpoint para retirar un libro de la oferta
app.patch("/books/:id/unoffer", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        book.isOfferedForExchange = false;
        book.status = "Disponible"; // Asegurarse de que el estado sea Disponible
        await book.save();

        res.json({ message: "Libro retirado de la oferta", book });
    } catch (error) {
        console.error("Error al retirar libro de la oferta:", error);
        res.status(500).json({ message: "Error al retirar el libro de la oferta" });
    }
});

// Endpoint para eliminar un libro específico
app.delete("/books/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Libro no encontrado" });
        }

        // Verificar que el libro no esté en proceso de intercambio
        if (book.status === "En intercambio") {
            return res.status(400).json({ message: "No se puede eliminar un libro que está en proceso de intercambio" });
        }

        await book.deleteOne();
        res.json({ message: "Libro eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar libro:", error);
        res.status(500).json({ message: "Error al eliminar el libro" });
    }
});

// Endpoint para eliminar todos los libros
app.delete("/booksDelete", async (req, res) => {
    try {
        const total = await Book.countDocuments({});
        if (total === 0) {
            res.json({message: "No hay libros para eliminar"});
        } else  {
            await Book.deleteMany({});
            res.json({ message: "Todos los libros han sido eliminados" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar los libros" });
    }
});

// Endpoint para actualizar los detalles del intercambio
app.patch("/exchanges/:id/details", async (req, res) => {
    try {
        const { 
            requesterAddress, 
            requesterPhone, 
            requesterEmail,
            ownerAddress, 
            ownerPhone, 
            ownerEmail,
            meetingPoint,
            meetingDate
        } = req.body;

        const exchange = await Exchange.findById(req.params.id)
            .populate({
                path: 'requestedBook',
                populate: { path: 'owner', select: 'email _id' }
            })
            .populate({
                path: 'offeredBook',
                populate: { path: 'owner', select: 'email _id' }
            })
            .populate('requester', 'email _id');

        if (!exchange) {
            return res.status(404).json({ message: "Intercambio no encontrado" });
        }

        // Actualizar los detalles del intercambio
        exchange.exchangeDetails = {
            requesterAddress,
            requesterPhone,
            requesterEmail,
            ownerAddress,
            ownerPhone,
            ownerEmail,
            meetingPoint,
            meetingDate,
            status: "meetup_scheduled"
        };

        await exchange.save();

        // Crear notificaciones para ambos usuarios
        const requesterNotification = new Notification({
            recipient: exchange.requester._id,
            type: 'exchange_details_updated',
            message: `Los detalles del intercambio han sido actualizados. Punto de encuentro: ${meetingPoint}`,
            relatedExchange: exchange._id
        });

        const ownerNotification = new Notification({
            recipient: exchange.requestedBook.owner._id,
            type: 'exchange_details_updated',
            message: `Los detalles del intercambio han sido actualizados. Punto de encuentro: ${meetingPoint}`,
            relatedExchange: exchange._id
        });

        await Promise.all([
            requesterNotification.save(),
            ownerNotification.save()
        ]);

        // Obtener el intercambio actualizado con toda la información
        const updatedExchange = await Exchange.findById(exchange._id)
            .populate({
                path: 'requestedBook',
                populate: { path: 'owner', select: 'email _id' }
            })
            .populate({
                path: 'offeredBook',
                populate: { path: 'owner', select: 'email _id' }
            })
            .populate('requester', 'email _id');

        // Procesar el intercambio para incluir isOwner e isRequester
        const processedExchange = updatedExchange.toObject();
        const requesterId = updatedExchange.requester._id.toString();
        const bookOwnerId = updatedExchange.requestedBook.owner._id.toString();
        processedExchange.isRequester = requesterId === req.body.userId;
        processedExchange.isOwner = bookOwnerId === req.body.userId;

        res.json({ 
            message: "Detalles del intercambio actualizados",
            exchange: processedExchange
        });
    } catch (error) {
        console.error('Error al actualizar detalles del intercambio:', error);
        res.status(500).json({ 
            message: "Error al actualizar los detalles del intercambio",
            error: error.message 
        });
    }
});

// Endpoint para confirmar la entrega del libro
app.patch("/exchanges/:id/confirm-delivery", async (req, res) => {
    try {
        const { confirmedBy, bookId } = req.body;
        const exchange = await Exchange.findById(req.params.id)
            .populate("requestedBook")
            .populate("offeredBook");

        if (!exchange) {
            return res.status(404).json({ message: "Intercambio no encontrado" });
        }

        // Verificar que el usuario que confirma es parte del intercambio
        if (confirmedBy !== exchange.requester.toString() && 
            confirmedBy !== exchange.requestedBook.owner.toString()) {
            return res.status(403).json({ message: "No autorizado para confirmar la entrega" });
        }

        // Actualizar el estado del libro específico
        if (bookId === exchange.requestedBook._id.toString()) {
            exchange.requestedBook.status = "intercambiado";
            await exchange.requestedBook.save();
        } else if (bookId === exchange.offeredBook._id.toString()) {
            exchange.offeredBook.status = "intercambiado";
            await exchange.offeredBook.save();
        }

        // Si ambos libros han sido entregados, actualizar el estado del intercambio
        if (exchange.requestedBook.status === "intercambiado" && 
            exchange.offeredBook.status === "intercambiado") {
            exchange.status = "completado";
            await exchange.save();

            // Crear notificaciones de confirmación
            const requesterNotification = new Notification({
                recipient: exchange.requester,
                type: 'exchange_completed',
                message: `El intercambio ha sido completado exitosamente`,
                relatedExchange: exchange._id
            });

            const ownerNotification = new Notification({
                recipient: exchange.requestedBook.owner,
                type: 'exchange_completed',
                message: `El intercambio ha sido completado exitosamente`,
                relatedExchange: exchange._id
            });

            await requesterNotification.save();
            await ownerNotification.save();
        }

        res.json({ 
            message: "Entrega confirmada",
            exchange,
            requestedBook: exchange.requestedBook,
            offeredBook: exchange.offeredBook
        });
    } catch (error) {
        console.error('Error al confirmar la entrega:', error);
        res.status(500).json({ 
            message: "Error al confirmar la entrega",
            error: error.message 
        });
    }
});

// Obtener intercambios de un usuario
app.get('/exchanges', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: 'Se requiere el ID del usuario' });
        }

        // Primero, obtener todos los libros del usuario
        const userBooks = await Book.find({ owner: userId });
        const userBookIds = userBooks.map(book => book._id);

        const exchanges = await Exchange.find({
            $or: [
                { requester: userId },
                { requestedBook: { $in: userBookIds } }
            ]
        })
        .populate({
            path: 'requestedBook',
            populate: { path: 'owner', select: 'email _id' }
        })
        .populate({
            path: 'offeredBook',
            populate: { path: 'owner', select: 'email _id' }
        })
        .populate('requester', 'email _id')
        .sort({ createdAt: -1 });

        // Procesar los intercambios para incluir información adicional
        const processedExchanges = exchanges.map(exchange => {
            const exchangeObj = exchange.toObject();
            // Asegurarse de que ambos IDs estén en formato string para la comparación
            const requesterId = exchange.requester._id.toString();
            const bookOwnerId = exchange.requestedBook.owner._id.toString();
            const userIdStr = userId.toString();

            exchangeObj.isRequester = requesterId === userIdStr;
            exchangeObj.isOwner = bookOwnerId === userIdStr;

            console.log('Exchange processed:', {
                exchangeId: exchange._id,
                requesterId,
                bookOwnerId,
                userIdStr,
                isRequester: exchangeObj.isRequester,
                isOwner: exchangeObj.isOwner
            });

            return exchangeObj;
        });

        res.json(processedExchanges);
    } catch (error) {
        console.error('Error al obtener intercambios:', error);
        res.status(500).json({ message: 'Error al obtener los intercambios' });
    }
});

app.listen(5000, () => console.log("Servidor corriendo en http://localhost:5000"));
