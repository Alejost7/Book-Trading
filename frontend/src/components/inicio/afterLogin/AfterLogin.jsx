import { FiPlus, FiBookOpen, FiUser, FiBookmark, FiArrowLeft, FiLogOut, FiHelpCircle} from 'react-icons/fi';
import '../../../styles/afterLogin/afterLogin.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { openModal } from '../../../Redux/modalSlice';
import MyBooks from '../../tradeLibros/MyBooks';
import MiPerfil from '../../miPerfil/MiPerfil';
import Donaciones from '../../donaciones/Donaciones';
import Ayuda from '../../ayuda/Ayuda';
import LogOut from './logOut';
import Upload from '../../tradeLibros/SubirLibro';
import { useDispatch } from 'react-redux';

const AfterLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [currentView, setCurrentView] = useState("Books");
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const storeUserId = localStorage.getItem("userId");
        console.log("storeUserId:", storeUserId);
        if (storeUserId) {
            fetch(`http://localhost:5000/books?excludeOwner=${storeUserId}`)
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error("Error fetching books:", error));
        } else {
            console.error("UserId no encontrado en local storage.");
        }
    }, []);

    const handleLogout = () => {
        dispatch(openModal("logout")); 
    };

    const handleAddBook = () => {
        dispatch(openModal("upload")); 
    };

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
                {currentView === "Books" &&(
                <>
                    <h2 className="section-title">Libros Disponibles</h2>
                    <div className="books-grid">
                        {books.map((book) => (
                            <div key={book._id} className="book-card">
                                <img src={book.image} alt={book.title} className="book-cover"/>
                                <h3 className="book-title">{book.title}</h3>
                                <p className="book-author">{book.author}</p>
                                <button className="exchange-button">Solicitar Intercambio</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
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
        </div>
    );
};

export default AfterLogin;