import '../../styles/afterLogin/afterLogin.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTrash2 } from 'react-icons/fi';


/*const books = [
    {id: 1, title: "El Principito", author:"Antoine de Saint-Exupéry", cover: "https://m.media-amazon.com/images/I/81t2CVWEsUL.jpg" },
    {id: 2, title: "1984", author:"George Orwell", cover: "https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg"},
    {id: 3, title: "Cien Años de Soledad", author:"Gabriel Garcia Márquez", cover: "https://www.polifemo.com/static/img/portadas/_visd_0000JPG030DW.jpg"},
    { id: 4, title: "Matar a un Ruiseñor", author: "Harper Lee", cover: "https://http2.mlstatic.com/D_NQ_NP_992079-MLM47037519198_082021-F.jpg" },
    { id: 5, title: "Orgullo y Prejuicio", author: "Jane Austen", cover: "https://th.bing.com/th/id/OIP.HZSbelhvhKDwxOa89IhJ2wHaLH?rs=1&pid=ImgDetMain" },
    { id: 6, title: "Crónica de una Muerte Anunciada", author: "Gabriel García Márquez", cover: "https://silverlibros.com/wp-content/uploads/2022/02/9786070729560-CRONICA-DE-UNA-MUERTE-ANUNCIADA-BOLSILLO-550x874.jpg" },
    { id: 7, title: "Los Juegos del Hambre", author: "Suzanne Collins", cover: "https://th.bing.com/th/id/OIP.2FzanwakaeIDelMFFoQZeAHaLd?rs=1&pid=ImgDetMain" },
    { id: 8, title: "Divergente", author: "Veronica Roth", cover: "https://th.bing.com/th/id/OIP.Adzs6aBljTq9mC6zuDtncwHaLH?rs=1&pid=ImgDetMain" },
    { id: 9, title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", cover: "https://th.bing.com/th/id/OIP.p2Qht0iMCaSgQb3wbzHukAHaKN?rs=1&pid=ImgDetMain" },
    { id: 10, title: "El Hobbit", author: "J.R.R. Tolkien", cover: "https://th.bing.com/th/id/R.f89526de5ee0fa74d32f2964234bd1fa?rik=sG1dlqxlGPVAJg&pid=ImgRaw&r=0" },
    { id: 11, title: "Harry Potter y la Piedra Filosofal", author: "J.K. Rowling", cover: "https://i0.wp.com/www.epubgratis.org/wp-content/uploads/2012/04/Harry-Potter-y-la-Piedra-Filosofal-J.K.-Rowling-portada.jpg?fit=683%2C1024&ssl=1" },
    { id: 12, title: "Las Crónicas de Narnia", author: "C.S. Lewis", cover: "https://horadelrecreo.com/wp-content/uploads/2020/04/Libro-Las-cr%C3%B3nicas-de-Narnia2.jpg" },
    { id: 13, title: "El Código Da Vinci", author: "Dan Brown", cover: "https://imagessl9.casadellibro.com/a/l/t0/59/9788408013259.jpg" },
    { id: 14, title: "La Sombra del Viento", author: "Carlos Ruiz Zafón", cover: "https://th.bing.com/th/id/R.5cc24bedaa87fca5eb7156c563abeeb5?rik=qryTx8r%2fiZNs8Q&pid=ImgRaw&r=0" },
    { id: 15, title: "El Alquimista", author: "Paulo Coelho", cover: "https://th.bing.com/th/id/OIP.sL5SnA4DPVj2aAJ0TRa05wHaLH?rs=1&pid=ImgDetMain" },
    { id: 16, title: "La Metamorfosis", author: "Franz Kafka", cover: "https://imagessl5.casadellibro.com/a/l/t0/05/9788466236805.jpg" },
    { id: 17, title: "Rayuela", author: "Julio Cortázar", cover: "https://pendulo.com/imagenes_grandes/9788420/978842043748.GIF" },
    { id: 18, title: "Drácula", author: "Bram Stoker", cover: "https://th.bing.com/th/id/OIP.YFVrlGipuvc2Ttja87hr5AHaLu?rs=1&pid=ImgDetMain" },
    { id: 19, title: "Frankenstein", author: "Mary Shelley", cover: "https://th.bing.com/th/id/R.97a3db160e61253b8d6e0bbe8e08b944?rik=g4eQsHxZE0vt%2bQ&pid=ImgRaw&r=0" },
    { id: 20, title: "Ulises", author: "James Joyce", cover: "https://images.cdn3.buscalibre.com/fit-in/360x360/4c/4f/4c4fc4695ca447acd3450f0e52b0a7b5.jpg" }
];*/

const MyBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            fetchMyBooks(userId);
        }
    }, []);

    const fetchMyBooks = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/myBooks?owner=${userId}`);
            const data = await response.json();
            setBooks(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching my books:", error);
            setLoading(false);
        }
    };

    const handleOfferToggle = async (bookId, isCurrentlyOffered) => {
        try {
            const endpoint = isCurrentlyOffered ? 'unoffer' : 'offer';
            const response = await axios.patch(`http://localhost:5000/books/${bookId}/${endpoint}`);
            
            if (response.status === 200) {
                // Actualizar el estado local
                setBooks(books.map(book => 
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

    const handleDeleteBook = async (bookId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este libro? Esta acción no se puede deshacer.')) {
            try {
                const response = await axios.delete(`http://localhost:5000/books/${bookId}`);
                if (response.status === 200) {
                    // Eliminar el libro del estado local
                    setBooks(books.filter(book => book._id !== bookId));
                    alert('Libro eliminado exitosamente');
                }
            } catch (error) {
                console.error('Error al eliminar el libro:', error);
                alert(error.response?.data?.message || 'Error al eliminar el libro');
            }
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="my-books-container">
            <div className="books-grid">
                {books.map((book) => (
                    <div key={book._id} className="book-card">
                        <div className="book-actions">
                            <button 
                                className="delete-book-btn"
                                onClick={() => handleDeleteBook(book._id)}
                                disabled={book.status === "En intercambio"}
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                        <img src={book.image} alt={book.title} className="book-cover"/>
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-author">{book.author}</p>
                        <div className="book-status">
                            <p>Estado: {book.status}</p>
                            {book.isDonation ? (
                                <p className="donation-badge">Donación</p>
                            ) : (
                                <button 
                                    className={`offer-button ${book.isOfferedForExchange ? 'offered' : ''}`}
                                    onClick={() => handleOfferToggle(book._id, book.isOfferedForExchange)}
                                >
                                    {book.isOfferedForExchange ? 'Retirar de oferta' : 'Ofertar para intercambio'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBooks;