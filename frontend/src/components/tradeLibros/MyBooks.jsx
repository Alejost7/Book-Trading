import '../../styles/afterLogin/afterLogin.css';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
const API_URL = import.meta.env.VITE_API_URL;


const MyBooks = () => {
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyBooks = useCallback(async () => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await axios.get(`${API_URL}/books/myBooks?owner=${userId}`);
            setMyBooks(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching my books:", error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyBooks();
        // Actualización automática cada x segundos
        const interval = setInterval(fetchMyBooks, 1000);
        return () => clearInterval(interval);
    }, [fetchMyBooks]);

    const handleDeleteBook = async (bookId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer.')) {
            try {
                await axios.delete(`${API_URL}/books/books/${bookId}`);
                setMyBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
                alert('Libro eliminado exitosamente');
            } catch (error) {
                console.error('Error al eliminar el libro:', error);
                alert(error.response?.data?.message || 'Error al eliminar el libro');
            }
        }
    };

    const handleOfferToggle = async (bookId, isCurrentlyOffered) => {
        try {
            const endpoint = isCurrentlyOffered ? 'unoffer' : 'offer';
            const response = await axios.patch(`${API_URL}/books/books/${bookId}/${endpoint}`);
            
            if (response.status === 200) {
                // Actualizar el estado local
                setMyBooks(books => books.map(book => 
                    book._id === bookId 
                        ? { ...book, isOfferedForExchange: !isCurrentlyOffered, status: "Disponible" }
                        : book
                ));

                alert(isCurrentlyOffered 
                    ? 'Libro retirado de la oferta de intercambio' 
                    : 'Libro ofertado para intercambio'
                );
            } 
        } catch (error) {
            console.error('Error al cambiar el estado de oferta:', error);
            alert(error.response?.data?.message || 'Error al cambiar el estado de oferta del libro');
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="books-container">
            <div className="books-grid">
                {myBooks.length > 0 ? (
                    myBooks.map((book) => (
                        <motion.div 
                            key={book._id} 
                            className="book-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.1 }}
                            whileHover={{ 
                                y: -10,
                                boxShadow: "0 15px 30px rgba(96, 165, 250, 0.2)"
                            }}
                        >
                            <div 
                                className="book-image-container"
                                style={{
                                    background: `linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.8)), url(${book.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <div className="book-actions">
                                    <motion.button 
                                        className="delete-book-btn"
                                        onClick={() => handleDeleteBook(book._id)}
                                        disabled={book.status === "En intercambio"}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <FiTrash2 />
                                    </motion.button>
                                </div>
                                <div className="book-status-badge">
                                    {book.status === "Disponible" && <span className="status available">Disponible</span>}
                                    {book.status === "En intercambio" && <span className="status trading">En intercambio</span>}
                                    {book.isDonation && <span className="status donation">Donación</span>}
                                </div>
                            </div>
                            
                            <div className="book-info">
                                <h3 className="book-title">{book.title}</h3>
                                <p className="book-author">{book.author}</p>
                                
                                {!book.isDonation && (
                                    <motion.button 
                                        className={`offer-button ${book.isOfferedForExchange ? 'offered' : ''}`}
                                        onClick={() => handleOfferToggle(book._id, book.isOfferedForExchange)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {book.isOfferedForExchange ? 'Retirar oferta' : 'Ofertar'}
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <motion.div 
                        className="no-content-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p>No tienes libros registrados</p>
                        <p>¡Agrega un libro para comenzar!</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MyBooks;