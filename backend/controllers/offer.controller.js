const Book = require("../models/Books");

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
exports.unofferBook =  async (req, res) => {
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