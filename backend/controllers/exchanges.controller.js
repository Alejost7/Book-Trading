const Exchange = require("../models/Exchange");
const Notification = require("../models/Notification");
const Book = require("../models/Books");

exports.createExchange = async (req, res) => { // Endpoint para crear un nuevo intercambio
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
};


exports.updateExchangeStatus = async (req, res) => {
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
};

exports.exchangeDonation = async (req, res) => {  // Intercambiar un libro con uno donado
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
};

// Endpoint para actualizar los detalles del intercambio
exports.exchangeDetails = async (req, res) => {
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
};

// Obtener intercambios de un usuario
exports.getExchanges = async (req, res) => {
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
};