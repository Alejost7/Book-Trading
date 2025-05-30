import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiEdit2, FiLogOut, FiBookOpen, FiHeart, 
    FiRefreshCw, FiUser, FiSettings, FiMail, 
    FiMapPin, FiCalendar, FiArrowLeft, FiPlus 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Navbar from '../inicio/beforeLogin/NavBar';
import Footer from '../inicio/beforeLogin/Footer';
import "../../styles/miPerfil/MiPerfil.css";
const API_URL = import.meta.env.VITE_API_URL;


const MiPerfil = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('acerca');
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        booksAdded: 0,
        exchangesCompleted: 0,
    });
    
    // Función para extraer el username del email
    const getUsernameFromEmail = (email) => {
        return email ? email.split('@')[0] : 'Usuario';
    };
    
    // Función para obtener los datos del usuario
    const fetchUserData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('No hay un usuario autenticado');
            }
            
            // Obtener información del usuario
            const userResponse = await axios.get(`${API_URL}/auth/users?id=${userId}`);
            
            // Si el endpoint anterior no devuelve datos específicos del usuario
            // podríamos usar otro enfoque (usar lo que tengamos en localStorage)
            if (!userResponse.data) {
                const userData = {
                    _id: userId,
                    email: localStorage.getItem('userEmail') || 'usuario@example.com',
                    role: 'user',
                    name: localStorage.getItem('userName') || 'Usuario',
                    joinDate: new Date().toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                };
                setUser(userData);
            } else {
                // Si tenemos datos del usuario, los procesamos
                const userData = Array.isArray(userResponse.data) 
                    ? userResponse.data.find(u => u._id === userId) 
                    : userResponse.data;
                
                // Si no existe name, usamos el nombre de usuario del email
                if (!userData.name || userData.name === "Usuario") {
                    userData.name = getUsernameFromEmail(userData.email);
                }
                
                // Agregar fecha de registro
                userData.joinDate = new Date(userData.createdAt || Date.now()).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                setUser(userData);
            }
            
            // Obtener libros del usuario
            const booksResponse = await axios.get(`${API_URL}/books/myBooks?owner=${userId}`);
            setBooks(booksResponse.data || []);
            
            // Obtener intercambios del usuario
            const exchangesResponse = await axios.get(`${API_URL}/exchanges/exchangesUser?userId=${userId}`);
            setExchanges(exchangesResponse.data || []);
            
            // Actualizar estadísticas
            const completedExchanges = exchangesResponse.data ? 
                exchangesResponse.data.filter(e => e.status === 'completado').length : 0;
            
            setStats({
                booksAdded: booksResponse.data ? booksResponse.data.length : 0,
                exchangesCompleted: completedExchanges,
            });
            
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar datos del perfil:', err);
            setError(err.message);
            setLoading(false);
            
            // Establecer datos predeterminados en caso de error
            if (!user) {
                setUser({
                    _id: localStorage.getItem('userId') || '1',
                    email: localStorage.getItem('userEmail') || 'usuario@example.com',
                    name: localStorage.getItem('userName') || 'Usuario',
                    role: 'user',
                    joinDate: new Date().toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                });
            }
        }
    };
    
    useEffect(() => {
        fetchUserData();
    },);

    // Para modificar la descripción en formato Markdown
    const formatBio = (text) => {
        if (!text) return <p>No hay información biográfica disponible.</p>;
        
        // Esto es una versión muy simple, en un caso real usarías una librería de Markdown
        const formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
        
        return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
    };
    
    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.setItem('isAuthenticated', false);
        // Redirigir a la página de inicio o login
        navigate('/');
        window.location.reload(); // Recargar para actualizar el estado de autenticación
    };
    
    const handleAddBook = () => {
        // Redirigir a la página de subir libro o mostrar modal
        navigate('/afterLogin/subirLibro');
    };
    
    const handleGoToExchanges = () => {
        // Redirigir a la página de intercambios
        navigate('/afterLogin/exchanges');
    };
    
    // Bio de ejemplo (se debería cargar desde el backend)
    const userBio = user?.bio || "Soy un apasionado de la lectura y me encanta intercambiar libros para descubrir nuevas historias. ¡Bienvenido a mi perfil de BookSwap!";

    if (loading && !user) {
        return (
            <div className="user-loading-full-page">
                <div className="user-loading-spinner large"></div>
                <p>Cargando perfil...</p>
            </div>
        );
    }

    return (
        <div className="user-profile-page">
            {isAuthenticated ? null : <Navbar />}
            
            <div className="user-profile-container">
                {error && (
                    <div className="user-profile-error">
                        <p>Ocurrió un error al cargar tus datos: {error}</p>
                        <button onClick={fetchUserData}>Reintentar</button>
                    </div>
                )}
                
                <button 
                    className="user-back-button" 
                    onClick={() => navigate("/afterLogin")}
                >
                    <FiArrowLeft />
                    <span>Volver</span>
                </button>
                
                <div className="user-profile-header">
                    <motion.div 
                        className="user-profile-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="user-avatar-container">
                            <motion.div 
                                className="user-avatar-placeholder"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </motion.div>
                            <button className="edit-avatar-btn">
                                <FiEdit2 />
                            </button>
                        </div>
                    </motion.div>
                    
                    <div className="user-profile-info">
                        <div className="user-profile-titles">
                            <h1>{user?.name || 'Cargando...'}</h1>
                            <h2>@{getUsernameFromEmail(user?.email)}</h2>
                            <span className="user-profile-role">{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
                        </div>
                        
                        <div className="user-profile-meta">
                            <div className="user-meta-item">
                                <FiMail />
                                <span>{user?.email || 'email@example.com'}</span>
                            </div>
                            <div className="user-meta-item">
                                <FiCalendar />
                                <span>Miembro desde {user?.joinDate}</span>
                            </div>
                        </div>
                        
                        <div className="user-profile-actions">
                            <button className="user-profile-btn edit-profile-btn">
                                <FiEdit2 />
                                <span>Editar perfil</span>
                            </button>
                            <button className="user-profile-btn settings-profile-btn">
                                <FiSettings />
                                <span>Configuración</span>
                            </button>
                            <button 
                                className="user-profile-btn logout-profile-btn"
                                onClick={handleLogout}
                            >
                                <FiLogOut />
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="user-profile-stats">
                    <div className="user-stat-card">
                        <div className="user-stat-value">{stats.booksAdded}</div>
                        <div className="user-stat-label">Libros</div>
                    </div>
                    <div className="user-stat-card">
                        <div className="user-stat-value">{stats.exchangesCompleted}</div>
                        <div className="user-stat-label">Intercambios</div>
                    </div>
                </div>
                
                <div className="user-profile-tabs">
                    <button 
                        className={`user-tab-btn ${activeTab === 'acerca' ? 'active' : ''}`}
                        onClick={() => setActiveTab('acerca')}
                    >
                        <FiUser />
                        <span>Acerca de</span>
                    </button>
                    <button 
                        className={`user-tab-btn ${activeTab === 'libros' ? 'active' : ''}`}
                        onClick={() => setActiveTab('libros')}
                    >
                        <FiBookOpen />
                        <span>Mis Libros</span>
                    </button>
                    <button 
                        className={`user-tab-btn ${activeTab === 'intercambios' ? 'active' : ''}`}
                        onClick={() => setActiveTab('intercambios')}
                    >
                        <FiRefreshCw />
                        <span>Intercambios</span>
                    </button>
                </div>
                
                <div className="user-profile-content">
                    {loading ? (
                        <div className="user-loading-container">
                            <div className="user-loading-spinner"></div>
                            <p>Cargando información...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'acerca' && (
                                <motion.div 
                                    className="user-about-section"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="user-about-bio">
                                        <h3>Biografía</h3>
                                        <div className="user-bio-content">
                                            {formatBio(userBio)}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            
                            {activeTab === 'libros' && (
                                <motion.div 
                                    className="user-books-section"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="user-section-header">
                                        <h3>Mis Libros</h3>
                                        <div className="user-header-actions">
                                            <button 
                                                className="user-add-book-btn"
                                                onClick={handleAddBook}
                                            >
                                                <FiPlus />
                                                <span>Agregar Libro</span>
                                            </button>
                                            <button 
                                                className="user-view-all-btn"
                                                onClick={() => navigate('/afterLogin/myBooks')}
                                            >
                                                <span>Ver todo</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="user-books-filters">
                                        <button className="user-filter-btn active">Todos</button>
                                        <button className="user-filter-btn">Disponibles</button>
                                        <button className="user-filter-btn">En intercambio</button>
                                    </div>
                                    
                                    {books.length === 0 ? (
                                        <div className="user-empty-state">
                                            <FiBookOpen size={40} />
                                            <h4>No tienes libros registrados</h4>
                                            <p>Agrega tus primeros libros para empezar a intercambiar</p>
                                            <button 
                                                className="user-add-book-btn-large"
                                                onClick={handleAddBook}
                                            >
                                                <FiPlus />
                                                <span>Agregar mi primer libro</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="user-books-grid">
                                            {books.slice(0, 6).map((book) => (
                                                <motion.div 
                                                    key={book._id} 
                                                    className="user-book-item"
                                                    whileHover={{ y: -8, boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
                                                >
                                                    <div className="user-book-status">
                                                        <span className={`user-status-badge ${book.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                            {book.status}
                                                        </span>
                                                    </div>
                                                    <div className="user-book-cover">
                                                        <img src={book.image} alt={book.title} />
                                                    </div>
                                                    <div className="user-book-details">
                                                        <h4>{book.title}</h4>
                                                        <p>{book.author}</p>
                                                    </div>
                                                    <div className="user-book-actions">
                                                        <button onClick={() => navigate(`/afterLogin/book/${book._id}`)}>
                                                            Ver detalles
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            
                                            {books.length > 6 && (
                                                <div className="user-more-books">
                                                    <button 
                                                        className="user-view-all-books"
                                                        onClick={() => navigate('/afterLogin/myBooks')}
                                                    >
                                                        Ver todos los libros ({books.length})
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                            
                            {activeTab === 'intercambios' && (
                                <motion.div 
                                    className="user-exchanges-section"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="user-section-header">
                                        <h3>Historial de Intercambios</h3>
                                        <button 
                                            className="user-view-all-btn"
                                            onClick={handleGoToExchanges}
                                        >
                                            <span>Ver todo</span>
                                        </button>
                                    </div>
                                    
                                    {exchanges.length === 0 ? (
                                        <div className="user-empty-state">
                                            <FiRefreshCw size={40} />
                                            <h4>No tienes intercambios</h4>
                                            <p>Explora libros disponibles y realiza tu primer intercambio</p>
                                            <button 
                                                className="user-explore-btn"
                                                onClick={() => navigate('/afterLogin')}
                                            >
                                                Explorar libros
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="user-exchanges-list">
                                            {exchanges.slice(0, 3).map((exchange) => {
                                                const isRequester = exchange.isRequester;
                                                const givenBook = isRequester ? exchange.offeredBook : exchange.requestedBook;
                                                const receivedBook = isRequester ? exchange.requestedBook : exchange.offeredBook;
                                                const otherUser = isRequester 
                                                    ? getUsernameFromEmail(exchange.requestedBook.owner.email)
                                                    : getUsernameFromEmail(exchange.requester.email);
                                                
                                                return (
                                                    <div key={exchange._id} className="user-exchange-item">
                                                        <div className="user-exchange-header">
                                                            <span className="user-exchange-date">
                                                                {new Date(exchange.requestedAt).toLocaleDateString('es-ES')}
                                                            </span>
                                                            <span className={`user-exchange-status ${exchange.status.toLowerCase()}`}>
                                                                {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="user-exchange-books">
                                                            <div className="user-exchange-book">
                                                                <img src={givenBook.image} alt={givenBook.title} />
                                                                <h5>{givenBook.title}</h5>
                                                                <span className="user-book-direction">Entregado</span>
                                                            </div>
                                                            
                                                            <div className="user-exchange-arrow">
                                                                <FiRefreshCw />
                                                            </div>
                                                            
                                                            <div className="user-exchange-book">
                                                                <img src={receivedBook.image} alt={receivedBook.title} />
                                                                <h5>{receivedBook.title}</h5>
                                                                <span className="user-book-direction">Recibido</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="user-exchange-details">
                                                            <span className="user-exchange-with">
                                                                Intercambio con @{otherUser}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            
                                            {exchanges.length > 3 && (
                                                <div className="user-more-exchanges">
                                                    <button 
                                                        className="user-view-all-exchanges"
                                                        onClick={handleGoToExchanges}
                                                    >
                                                        Ver todos los intercambios ({exchanges.length})
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                            
                        </>
                    )}
                </div>
            </div>
            
            {!isAuthenticated && <Footer />}
        </div>
    );
};

export default MiPerfil;