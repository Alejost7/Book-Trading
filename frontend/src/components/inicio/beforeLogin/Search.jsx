import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../../../Redux/modalSlice';
import '../../../styles/beforeLogin/search.css';
import searchIcon from '../../../assets/icons/searchIcon.png';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [allBooks, setAllBooks] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const searchContainerRef = useRef(null);

    // Cargar todos los libros al montar el componente
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const response = await fetch('http://localhost:5000/books');
                const data = await response.json();
                setAllBooks(data);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchAllBooks();
    }, []);

    // Agregar evento de clic al documento para cerrar los resultados cuando se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        
        setIsSearching(true);
        setShowResults(true);
        
        try {
            const response = await fetch(`http://localhost:5000/books/search?q=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();
            
            if (data.length === 0) {
                setNoResults(true);
                setSearchResults([]);
            } else {
                setNoResults(false);
                setSearchResults(data);
            }
        } catch (error) {
            console.error('Error searching books:', error);
            setNoResults(true);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleBookClick = () => {
        if (isAuthenticated) {
            navigate('/afterLogin');
            // Aquí podrías pasar el ID del libro como parámetro para abrir directamente el intercambio
        } else {
            dispatch(openModal("auth"));
        }
        setShowResults(false);
    };

    const handleExchangeClick = () => {
        if (isAuthenticated) {
            navigate('/afterLogin');
            // Aquí podrías pasar el ID del libro como parámetro para abrir directamente el intercambio
        } else {
            dispatch(openModal("auth"));
        }
        setShowResults(false);
    };

    return (
        <div className="search-container" ref={searchContainerRef}>
            <div className="search">
                <input 
                    type="text" 
                    placeholder="Busca lo mejor para ti..." 
                    className="searchInput"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <img 
                    src={searchIcon} 
                    className="searchIcon" 
                    alt="Search Icon" 
                    onClick={handleSearch}
                />
            </div>

            {showResults && (
                <div className="search-results-container">
                    {isSearching ? (
                        <div className="search-loading-text">Buscando...</div>
                    ) : noResults ? (
                        <div className="search-no-results">
                            <p>No se encontraron resultados para "{searchTerm}"</p>
                            <div className="search-all-books">
                                <h3>Libros disponibles</h3>
                                <div className="search-books-grid">
                                    {allBooks.slice(0, 6).map(book => (
                                        <div key={book._id} className="search-book-item">
                                            <img src={book.image || 'https://via.placeholder.com/150x200'} alt={book.title} />
                                            <h4>{book.title}</h4>
                                            <p>{book.author}</p>
                                            <button onClick={handleBookClick}>Ver detalles</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="search-results-grid">
                            {searchResults.map(book => (
                                <div key={book._id} className="search-book-item">
                                    <img src={book.image || 'https://via.placeholder.com/150x200'} alt={book.title} />
                                    <h4>{book.title}</h4>
                                    <p>{book.author}</p>
                                    <div className="search-book-actions">
                                        <button onClick={handleBookClick}>Ver detalles</button>
                                        <button onClick={handleExchangeClick}>Intercambiar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;