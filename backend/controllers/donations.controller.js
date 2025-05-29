const Book = require("../models/Books");
const User = require("../models/User");

exports.donateBook = async (req, res) => {  // Donar un libro 
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
};

exports.getDonatedBooks = async (req, res) => {  // Obtener todos los libros donados
    try {
        const books = await Book.find({isDonation: true, status: "Disponible" });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener libros de donación" });
    }
};
