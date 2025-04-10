import { FiPlus, FiBookOpen, FiUser, FiBookmark, FiArrowLeft, FiLogOut, FiHelpCircle, FiTrash2} from 'react-icons/fi';
import '../../../styles/afterLogin/afterLogin.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { openModal } from '../../../Redux/modalSlice';
import MyBooks from '../../tradeLibros/MyBooks';
import MiPerfil from '../../miPerfil/MiPerfil';
import Donaciones from '../../donaciones/Donaciones';
import Ayuda from '../../ayuda/Ayuda';
import LogOut from './logOut';
import Upload from '../../tradeLibros/SubirLibro';
import { useDispatch } from 'react-redux';
import NotificationCenter from '../../NotificationCenter';
import MisIntercambios from '../../intercambios/MisIntercambios';
import axios from 'axios';

const AfterLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentView, setCurrentView] = useState("Books");
    const [books, setBooks] = useState([]);
    const [myBooks, setMyBooks] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [showExchangeModal, setShowExchangeModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBooks = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/books?excludeOwner=${userId}`);
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    }, [userId]);

    const fetchMyBooks = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:5000/myBooks?owner=${userId}`);
            setMyBooks(response.data);
        } catch (error) {
            console.error("Error fetching my books:", error);
        }
    }, [userId]);

    const fetchUserRole = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/users');
            const currentUser = response.data.find(user => user._id === userId);
            if (currentUser) {
                setUserRole(currentUser.role);
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    }, [userId]);

    useEffect(() => {
        const storeUserId = localStorage.getItem("userId");
        setUserId(storeUserId);
        if (storeUserId) {
            fetchBooks();
            fetchMyBooks();
            fetchUserRole();
            setLoading(false);
        } else {
            console.error("UserId no encontrado en local storage.");
        }
    }, [fetchBooks, fetchMyBooks, fetchUserRole]);

    // Actualización automática cada 3 segundos
    useEffect(() => {
        if (userId) {
            const interval = setInterval(() => {
                fetchBooks();
                fetchMyBooks();
            }, 3000); // 3000 ms = 3 segundos

            return () => clearInterval(interval);
        }
    }, [userId, fetchBooks, fetchMyBooks]);

    const handleLogout = () => {
        dispatch(openModal("logout")); 
    };

    const handleAddBook = () => {
        dispatch(openModal("upload")); 
    };

    const handleDeleteAllBooks = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar todos los libros? Esta acción no se puede deshacer.')) {
            try {
                await axios.delete('http://localhost:5000/books/all');
                setBooks([]);
                setMyBooks([]);
                alert('Todos los libros han sido eliminados exitosamente');
            } catch (error) {
                console.error('Error al eliminar los libros:', error);
                alert('Error al eliminar los libros');
            }
        }
    };

    const handleExchangeRequest = (book) => {
        setSelectedBook(book);
        setShowExchangeModal(true);
    };

    const handleExchange = async (requestedBookId, offeredBookId) => {
        try {
            const response = await axios.post('http://localhost:5000/exchanges', {
                requester: userId,
                requestedBookId,
                offeredBookId
            });

            if (response.data.newExchange) {
                // Actualizar la lista de libros disponibles
                setBooks(prevBooks => 
                    prevBooks.filter(book => 
                        book._id !== requestedBookId
                    )
                );

                // Actualizar la lista de mis libros
                setMyBooks(prevBooks => 
                    prevBooks.filter(book => 
                        book._id !== offeredBookId
                    )
                );

                // Cerrar el modal
                setShowExchangeModal(false);
                setSelectedBook(null);

                // Mostrar mensaje de éxito
                alert('Solicitud de intercambio creada exitosamente');
            }
        } catch (error) {
            console.error('Error al crear intercambio:', error);
            alert(error.response?.data?.message || 'Error al crear la solicitud de intercambio');
        }
    };

    const getSectionTitle = () => {
        switch(currentView) {
            case "Books":
                return "BookZone";
            case "MyBooks":
                return "Mis Libros";
            case "Changes":
                return "Intercambios";
            default:
                return;
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="afterLogin-container">
            <aside className="slidebar">
                <h1 className="logo-title" onClick={() => navigate("/")}>BookSwap</h1>
                <nav className="nav-links">
                    <a onClick= {() => setCurrentView("MyBooks")} className={`nav-item ${currentView === "MyBooks" ? "active" : ""}`}><FiBookOpen />Mis Libros</a>
                    <a onClick= {() => setCurrentView("Changes")} className={`nav-item ${currentView === "Changes" ? "active" : ""}`}><FiBookmark />Intercambios</a>
                    <a onClick= {() => setCurrentView("Donation")} className={`nav-item ${currentView === "Donation" ? "active" : ""}`}><FiBookOpen/>Donaciones</a>
                    <a onClick= {() => setCurrentView("Profile")} className={`nav-item ${currentView === "Profile" ? "active" : ""}`}><FiUser />Perfil</a>
                    <a onClick= {() => setCurrentView("Books")} className={`nav-item ${currentView === "Books" ? "active" : ""}`}><FiBookOpen />BookZone</a>
                    <a onClick= {() => setCurrentView("Help")} className={`nav-item ${currentView === "Help" ? "active" : ""}`}><FiHelpCircle />Ayuda</a>
                </nav>
                <button 
                    className="add-button up"  
                    onClick={() => currentView === "Profile" || currentView === "Changes" || currentView === "MyBooks" || currentView === "Donation" || currentView === "Help" ? setCurrentView("Books") : navigate("/")}><FiArrowLeft /></button>
                <button className="logout-button" onClick={handleLogout}><FiLogOut />Cerrar Sesión</button>
            </aside>
            <main className="main-content">
                <div className="header-content">
                    <h2 className="section-title">{getSectionTitle()}</h2>
                    <div className="header-actions">
                        {userId && <NotificationCenter userId={userId} />}
                        {userRole === 'admin' && currentView === "Books" && (
                            <button 
                                className="delete-all-books-btn"
                                onClick={handleDeleteAllBooks}
                            >
                                <FiTrash2 /> Eliminar todos los libros
                            </button>
                        )}
                    </div>
                </div>
                {currentView === "Books" && (
                    <div className="books-grid">
                        {books.length > 0 ? (
                            books.map((book) => (
                                <div key={book._id} className="book-card">
                                    <img src={book.image} alt={book.title} className="book-cover"/>
                                    <h3 className="book-title">{book.title}</h3>
                                    <p className="book-author">{book.author}</p>
                                    <p className="book-owner">Ofertado por: {book.owner?.name || 'Usuario'}</p>
                                    <button 
                                        className="exchange-button"
                                        onClick={() => handleExchangeRequest(book)}
                                    >
                                        Solicitar Intercambio
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="no-content-message">
                                <p>En este momento no hay nada para mostrar</p>
                            </div>
                        )}
                    </div>
                )}
                {currentView === "Changes" && <MisIntercambios userId={userId} />}
                {currentView === "Profile" && <MiPerfil/>}
                {currentView === "Donation" && <Donaciones/>}
                {currentView === "Help" && <Ayuda/>}
                {currentView === "MyBooks" && <MyBooks/>}
            </main>
            <button className="add-button tooltip-btn" onClick={handleAddBook}><FiPlus />
                <span className="tooltip-text">Agregar libro</span>
            </button>
            <Upload/>
            <LogOut/>

            {/* Modal de selección de libro para intercambio */}
            {showExchangeModal && (
                <div className="exchange-modal">
                    <div className="exchange-modal-content">
                        <h3>Selecciona un libro para intercambiar</h3>
                        <div className="selected-book">
                            <h4>Libro solicitado:</h4>
                            <p>{selectedBook.title} - {selectedBook.author}</p>
                        </div>
                        <div className="my-books-list">
                            <h4>Mis libros disponibles:</h4>
                            {myBooks.map(book => (
                                <div key={book._id} className="book-option">
                                    <p>{book.title} - {book.author}</p>
                                    <button 
                                        onClick={() => handleExchange(selectedBook._id, book._id)}
                                        className="confirm-exchange-btn"
                                    >
                                        Seleccionar
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="cancel-exchange-btn"
                            onClick={() => {
                                setShowExchangeModal(false);
                                setSelectedBook(null);
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AfterLogin;