import '../../styles/donaciones/donaciones.css';
import { BookOpen, Plus, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openModal } from '../../Redux/modalSlice';
import { useState } from 'react';
import DonarLibro from './DonarLibro';
import ModalNuevoLibro from '../tradeLibros/ModalNuevoLibro';

const Donacion = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedBook, setSelectedBook] = useState(null);

    const handleSelectBook = () => {
        dispatch(openModal("donate"));
    }

    const handleNewBook = () => {
        dispatch(openModal("uploadNew"));
    }

    const handleDonar = async () => {
        if (!selectedBook) {
            alert("Por favor selecciona un libro para donar.");
            return;
        }
        const userId = localStorage.getItem("userId");
        const donationPayLoad = {
            bookId: selectedBook._id,
            userId: userId,
        };

        try {
            const response = await fetch("http://localhost:5000/donate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(donationPayLoad),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Error al donar el libro");
            }
            alert("Libro donado exitosamente");
            setSelectedBook(null); // se reinicia el libro seleccionado
        } catch (error) {
            console.error("Error al donar el libro:", error);
            alert("Error al donar el libro. Por favor intenta de nuevo.");
        }
    };

    const handleBookSelect = (book) => {
        setSelectedBook(book);
    };

    return (
        <div className="donacion-container">
            <h1 className="donacion-title">📖 Crear Donación</h1>
            <div className="donacion-buttons">
                <span className="btn btn-primary" onClick={handleSelectBook}>
                    <BookOpen size={60}/>
                    Seleccionar<br></br>libro
                    </span>
                <span className="btn btn-primary" onClick={handleNewBook}>
                    <Plus size={50}/>
                    Nuevo Libro
                </span>
            </div>
            {selectedBook && (
                <div className="selected-book">
                    Libro seleccionado: <strong>{selectedBook.title}</strong>
                    <img src={selectedBook.image} alt={selectedBook.title} className="book-cover tamn"/>
                    <button className="btn remove-button" onClick={() => setSelectedBook(null)}>Eliminar Selección</button>
                </div>
            )}
            <span className="btn btn-donar" onClick={handleDonar}>
                <CheckCircle size={50}/>
                DONAR
            </span>
            <div className="donacion-info">
                <h3 className="donacion-body">
                    <p>
                        <strong>
                            Hola, aquí puedes donar los libros que quieras para que otros tenga la oportunidad de intercambiarlos<br></br>
                            Para más información o si tienes algún problema dirigete al apartado de ayuda sección "donación libros"
                        </strong>
                    </p>
                </h3>
                <button 
                    className="add-button" 
                    onClick={() => navigate("/")}><ArrowLeft />
                </button>
            </div>
            <DonarLibro onBookSelect={handleBookSelect} />
            <ModalNuevoLibro onBookAdded={handleBookSelect}/>
        </div>
    );
};

export default Donacion