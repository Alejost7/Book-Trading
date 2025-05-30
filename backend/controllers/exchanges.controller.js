const mongoose = require("mongoose");
const Exchange = require("../models/Exchange");
const Notification = require("../models/Notification");
const Book = require("../models/Books");

exports.createExchange = async (req, res) => {  // Crear un intercambio
    try {
        const { requester, requestedBookId, offeredBookId } = req.body;
        console.log("→ Crear intercambio:", { requester, requestedBookId, offeredBookId });

        // 1. Validar libros
        const requestedBook = await Book.findById(requestedBookId).populate('owner');
        if (!requestedBook) return res.status(404).json({ message: "Libro solicitado no encontrado" });
        if (requestedBook.status !== "Disponible")
        return res.status(400).json({ message: "El libro solicitado no está disponible para intercambio" });

        const offeredBook = await Book.findById(offeredBookId).populate('owner');
        if (!offeredBook) return res.status(404).json({ message: "Libro ofrecido no encontrado" });
        if (offeredBook.status !== "Disponible")
        return res.status(400).json({ message: "El libro ofrecido no está disponible para intercambio" });

        if (offeredBook.owner._id.toString() !== requester)
        return res.status(403).json({ message: "No puedes ofrecer un libro que no te pertenece" });

        // 2. Crear intercambio y marcar libros
        const newExchange = new Exchange({
        requester,
        requestedBook: requestedBookId,
        offeredBook: offeredBookId,
        status: "pendiente"
        });
        requestedBook.status = "En intercambio";
        offeredBook.status   = "En intercambio";

        await Promise.all([
        requestedBook.save(),
        offeredBook.save(),
        newExchange.save()
        ]);
        console.log("→ Intercambio y libros guardados");

        // 3. Crear notificaciones
        let ownerNotification, requesterNotification;
        try {
        ownerNotification = new Notification({
            recipient: requestedBook.owner._id,
            type: 'exchange_request',
            message: `Nueva solicitud de intercambio para el libro "${requestedBook.title}"`,
            relatedExchange: newExchange._id
        });
        requesterNotification = new Notification({
            recipient: requester,
            type: 'exchange_request_sent',
            message: `Has solicitado intercambiar "${requestedBook.title}" con "${offeredBook.title}"`,
            relatedExchange: newExchange._id
        });
        await Promise.all([
            ownerNotification.save(),
            requesterNotification.save()
        ]);
        console.log("→ Notificaciones creadas");
        } catch (notifErr) {
        console.error("Error creando notificaciones:", notifErr);
        // ¡Ojo! Podemos decidir no abortar el flujo por una noti
        }

        // 4. Populate y responder
        let populatedExchange;
        try {
        populatedExchange = await Exchange.findById(newExchange._id)
            .populate({ path: 'requestedBook', populate: { path: 'owner', select: 'email' } })
            .populate({ path: 'offeredBook',   populate: { path: 'owner', select: 'email' } })
            .populate('requester', 'email');
        console.log("→ Exchange poblado:", populatedExchange);
        } catch (popErr) {
        console.error("Error al poblar intercambio:", popErr);
        // Podemos responder igualmente el newExchange sin populate
        return res.status(201).json({
            message: "Intercambio creado, pero fallo al poblar datos adicionales",
            newExchange
        });
        }

        // 5. Envío final
        return res.status(201).json({
        message: "Solicitud de intercambio creada exitosamente",
        newExchange: populatedExchange
        });

    } catch (error) {
        console.error("Error general al crear intercambio:", error);
        return res.status(500).json({ message: "Error al crear la solicitud de intercambio", error: error.message });
    }
};


// Aceptar o rechazar una solicitud de intercambio
exports.updateExchangeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, userId } = req.body; // 'aceptado' | 'rechazado' pasamos el userId desde el body para pruebas, en producción se debería obtener del token de usuario
        // const userId = req.user._id.toString(); // Descomentar en producción para obtener del token, hay que asegurarse de que el middleware de autenticación esté configurado

        // Buscar intercambio con libros y propietarios
        const exchange = await Exchange.findById(id)
        .populate('requestedBook')
        .populate('offeredBook');
        console.log('Dueño del libro solicitado:', exchange.requestedBook.owner.toString());
        console.log('UserId que viene en la solicitud:', userId);
        if (!exchange) return res.status(404).json({ message: "Intercambio no encontrado" });

        // Solo el owner del libro solicitado puede cambiar el estado
        if (exchange.requestedBook.owner.toString() !== userId) {
        return res.status(403).json({ message: "No autorizado" });
        }

        exchange.status = status;

        // Actualizar estado de libros y enviar notificaciones
        if (status === 'rechazado') {
            exchange.requestedBook.status = 'Disponible';
            exchange.offeredBook.status   = 'Disponible';
            await Promise.all([
                exchange.requestedBook.save(),
                exchange.offeredBook.save()
            ]);
            await Notification.create({
                recipient: exchange.requester,
                type: 'exchange_rejected',
                message: `Tu solicitud de intercambio para "${exchange.requestedBook.title}" fue rechazada.`,
                relatedExchange: id
            });
        }
        if (status === 'aceptado') {
            await Notification.create({
                recipient: exchange.requester,
                type: 'exchange_accepted',
                message: `Tu solicitud de intercambio para "${exchange.requestedBook.title}" fue aceptada.`,
                relatedExchange: id
            });
        }
        // Guardar intercambio y ejecutar tareas agrupadas
        await exchange.save();
        return res.json({ message: `Intercambio ${status}`, exchange: exchange });
    } catch (err) {
        console.error('Error updateExchangeStatus:', err);
        res.status(500).json({ message: 'Error al actualizar el intercambio', error: err.message });
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


// Actualizar detalles de meetup del intercambio
exports.exchangeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const {userId, ...details } = req.body;

        // Buscar intercambio existente
        const exchange = await Exchange.findById(id)
        .populate('requestedBook')
        .populate('offeredBook');
        if (!exchange) return res.status(404).json({ message: "Intercambio no encontrado" });
        if (exchange.status !== 'aceptado') {
        return res.status(400).json({ message: 'Intercambio no está en estado aceptado' });
        }

        // Solo requester u owner pueden actualizar detalles
        const isRequester = exchange.requester.toString() === userId;
        const isOwner = exchange.requestedBook.owner.toString() === userId;
        if (!isRequester && !isOwner) {
        return res.status(403).json({ message: 'No autorizado' });
        }

        // Extender detalles de intercambio sin sobrescribir campos internos
        exchange.exchangeDetails = {
            ...(exchange.exchangeDetails?.toObject?.() || {}),
            ...details,
            status: 'meetup_scheduled'
        };

        await exchange.save();

        // Crear notificaciones agrupadas para ambas partes
        await Promise.all([
        Notification.create({
            recipient: exchange.requester,
            type: 'meetup_scheduled',
            message: `Encuentro agendado en ${details.meetingPoint} para ${details.meetingDate}`,
            relatedExchange: id
        }),
        Notification.create({
            recipient: exchange.requestedBook.owner,
            type: 'meetup_scheduled',
            message: `Encuentro agendado en ${details.meetingPoint} para ${details.meetingDate}`,
            relatedExchange: id
        })
        ]);

        const result = exchange.toObject();
        result.isRequester = isRequester;
        result.isOwner = isOwner;

        res.json({ message: 'Detalles del intercambio actualizados', exchange: result });
    } catch (err) {
        console.error('Error exchangeDetails:', err);
        res.status(500).json({ message: 'Error al actualizar detalles', error: err.message });
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


            return exchangeObj;
        });

        res.json(processedExchanges);
    } catch (error) {
        console.error('Error al obtener intercambios:', error);
        res.status(500).json({ message: 'Error al obtener los intercambios' });
    }
};

exports.confirmDeliveryBook = async (req, res) => {
    try {
        const { confirmedBy, bookId } = req.body;
        const exchangeId = req.params.id;

        // 1. Buscar el intercambio con todos los datos necesarios
        const exchange = await Exchange.findById(exchangeId)
            .populate({
                path: "requestedBook",
                populate: { path: "owner" }
            })
            .populate({
                path: "offeredBook",
                populate: { path: "owner" }
            });

        if (!exchange) {
            return res.status(404).json({ message: "Intercambio no encontrado" });
        }

        // 2. Verificar autorización
        const requesterId = exchange.requester.toString();
        const requestedOwnerId = exchange.requestedBook.owner._id.toString();
        const offeredOwnerId = exchange.offeredBook.owner._id.toString();

        if (confirmedBy !== requesterId && confirmedBy !== requestedOwnerId) {
            return res.status(403).json({ message: "No autorizado para confirmar la entrega" });
        }

        // 3. Identificar y actualizar el libro confirmado
        let bookToUpdate;
        if (bookId === exchange.requestedBook._id.toString()) {
            bookToUpdate = exchange.requestedBook;
        } else if (bookId === exchange.offeredBook._id.toString()) {
            bookToUpdate = exchange.offeredBook;
        } else {
            return res.status(400).json({ message: "ID de libro no válido" });
        }

        if (bookToUpdate.status === "intercambiado") {
            return res.status(400).json({ message: "Este libro ya fue confirmado como entregado" });
        }

        // 4. Marcar el libro como intercambiado
        bookToUpdate.status = "intercambiado";
        await bookToUpdate.save();

        // 5. Verificar si ambos libros están confirmados
        if (exchange.requestedBook.status === "intercambiado" && 
            exchange.offeredBook.status === "intercambiado") {
            
            // 6. Guardar propietarios anteriores
            exchange.requestedBook.previousOwners.push(exchange.requestedBook.owner._id);
            exchange.offeredBook.previousOwners.push(exchange.offeredBook.owner._id);

            // 7. Intercambiar propietarios
            const oldRequestedOwner = exchange.requestedBook.owner._id;
            const oldOfferedOwner = exchange.offeredBook.owner._id;

            // Actualizar propietarios y establecer estado como "Disponible" y no ofertado
            exchange.requestedBook.owner = oldOfferedOwner;
            exchange.requestedBook.status = "Disponible";
            exchange.requestedBook.isOffered = false; // Marcar como no ofertado

            exchange.offeredBook.owner = oldRequestedOwner;
            exchange.offeredBook.status = "Disponible";
            exchange.offeredBook.isOffered = false; // Marcar como no ofertado

            // 8. Actualizar estado del intercambio
            exchange.status = "completado";

            // 9. Guardar todos los cambios en una transacción
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    await exchange.requestedBook.save({ session });
                    await exchange.offeredBook.save({ session });
                    await exchange.save({ session });
                });
            } finally {
                await session.endSession();
            }

            // 10. Crear notificaciones
            await Notification.insertMany([
                {
                    recipient: requesterId,
                    type: "exchange_completed",
                    message: "El intercambio ha sido completado exitosamente",
                    relatedExchange: exchange._id,
                },
                {
                    recipient: oldOfferedOwner,
                    type: "exchange_completed",
                    message: "El intercambio ha sido completado exitosamente",
                    relatedExchange: exchange._id,
                },
            ]);
        }

        // 11. Responder con el estado actualizado
        const updatedExchange = await Exchange.findById(exchangeId)
            .populate({
                path: "requestedBook",
                populate: { path: "owner" }
            })
            .populate({
                path: "offeredBook",
                populate: { path: "owner" }
            });

        res.json({
            message: "Entrega confirmada",
            exchange: updatedExchange
        });

    } catch (error) {
        console.error("Error al confirmar la entrega:", error);
        res.status(500).json({
            message: "Error al confirmar la entrega",
            error: error.message,
        });
    }
};

