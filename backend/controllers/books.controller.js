const mongoose = require("mongoose");
const Book = require("../models/Books");
const Exchange = require("../models/Exchange");
const Notification = require("../models/Notification");

exports.getBooksExceptUser = async (req, res) => {  // Endpoint para obtener todos los libros menos los del usuario logueado
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
};

exports.getAllBooks = async (req, res) => {  // Endpoint para obtener todos los libros
    try {
        const books = await Book.find().populate("owner", "email"); 
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener libros"});
    }
};

exports.getMyBooks = async (req, res) => {  // Endpoint para obtener los libros de un usuario
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
};

exports.addBooks = async (req, res) => {  // Endpoint para agregar un nuevo libro
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
};

exports.deleteBook = async (req, res) => {  // Endpoint para eliminar libros
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
};

exports.deleteBooks = async (req, res) => {  // Endpoint para eliminar todos los libros de todos los usuarios (admin)
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
};

exports.confirmDeliveryBook = async (req, res) => {
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
};

// Nuevo endpoint para ofertar un libro para intercambio
exports.offerBook =  async (req, res) => {
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
};

// Nuevo endpoint para retirar un libro de la oferta
exports.unofferBook = async (req, res) => {
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
};