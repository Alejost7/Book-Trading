import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../Redux/modalSlice";
import { useState, useEffect } from "react";
import "../../styles/tradeLibros/subirLibros.css";

const ModalDonateBook = ({ onBookSelect }) => {
    const { isOpen, modalType } = useSelector((state) => state.modal);
    const dispatch = useDispatch();

    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const userId = localStorage.getItem("userId");
        // Ejemplo: obtener los libros disponibles del usuario (puedes cambiar la URL según tu lógica)
        fetch(`http://localhost:5000/myBooks?owner=${userId}`)
        .then((res) => res.json())
        .then((data) => {
            setBooks(data);
            setIsLoading(false);
        })
        .catch((err) => {
            console.error("Error al cargar libros:", err);
            setError("Error al cargar los libros");
            setIsLoading(false);
        });
    }, [isOpen, modalType]);

    if (!isOpen || modalType !== "donate") return null;

    return (
        <div className="modal-overlay">
        <div className="modal-content">
            <button
            className="close-button"
            onClick={() => dispatch(closeModal())}
            >
            X
            </button>
            <h2>Selecciona un libro para donar</h2>
            {error && <p className="error">{error}</p>}
            {isLoading ? (
            <p>Cargando...</p>
            ) : (
            <ul className="books-list">
                {books.map((book) => (
                <li
                    key={book._id}
                    className="book-item"
                    onClick={() => {
                    onBookSelect(book);
                    dispatch(closeModal());
                    }}
                >
                    <img
                    src={book.image}
                    alt={book.title}
                    className="book-thumb"
                    />
                    <span>{book.title}</span>
                </li>
                ))}
            </ul>
            )}
        </div>
        </div>
    );
    };

export default ModalDonateBook;
