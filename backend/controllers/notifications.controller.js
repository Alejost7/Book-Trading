const Notification = require("../models/Notification");

// Nuevos endpoints para notificaciones
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('relatedExchange');
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener notificaciones" });
    }
};

exports.markAsRead = async (req, res) => {
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
};