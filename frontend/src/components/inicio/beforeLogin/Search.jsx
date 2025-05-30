import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { openModal } from '../../../Redux/modalSlice';
import '../../../styles/beforeLogin/search.css';
import { FiSearch, FiX, FiBookOpen, FiRefreshCw } from 'react-icons/fi';
const API_URL = import.meta.env.VITE_API_URL;


const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [allBooks, setAllBooks] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const searchContainerRef = useRef(null);
    const inputRef = useRef(null);


    // Cargar todos los libros y búsquedas recientes al montar el componente
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const response = await fetch(`${API_URL}/books/books`);
                const data = await response.json();
                setAllBooks(data);
                
                // Extraer títulos para autocompletado
                const titles = data.map(book => book.title);
                const authors = data.map(book => book.author);
                const uniqueSuggestions = [...new Set([...titles, ...authors])];
                setSuggestions(uniqueSuggestions);
                
                // Cargar búsquedas recientes del localStorage
                const savedSearches = localStorage.getItem('recentSearches');
                if (savedSearches) {
                    setRecentSearches(JSON.parse(savedSearches).slice(0, 5));
                }
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchAllBooks();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowResults(false);
                setShowSuggestions(false);
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
        setShowSuggestions(false);
        
        try {
            // Primero buscamos coincidencias exactas en los libros locales
            const exactMatches = allBooks.filter(book => {
                const searchTermLower = searchTerm.toLowerCase();
                const titleLower = book.title.toLowerCase();
                const authorLower = book.author.toLowerCase();
                
                // Coincidencia exacta con el título o autor
                return titleLower === searchTermLower || authorLower === searchTermLower;
            });

            if (exactMatches.length > 0) {
                // Si encontramos coincidencias exactas, las mostramos
                setNoResults(false);
                setSearchResults(exactMatches);
            } else {
                // Si no hay coincidencias exactas, intentamos la búsqueda en el servidor
                const response = await fetch(`${API_URL}/books/books/search?q=${encodeURIComponent(searchTerm)}`);
                const data = await response.json();
                
                if (data.length === 0) {
                    // Si no hay resultados del servidor, buscamos coincidencias parciales
                    const partialMatches = allBooks.filter(book => {
                        const searchTermLower = searchTerm.toLowerCase();
                        const titleLower = book.title.toLowerCase();
                        const authorLower = book.author.toLowerCase();
                        
                        // Buscar coincidencias en el título
                        if (titleLower.includes(searchTermLower)) return true;
                        
                        // Buscar coincidencias en el autor
                        if (authorLower.includes(searchTermLower)) return true;
                        
                        // Buscar palabras individuales
                        const searchWords = searchTermLower.split(' ');
                        const titleWords = titleLower.split(' ');
                        const authorWords = authorLower.split(' ');
                        
                        // Verificar si alguna palabra de búsqueda coincide con palabras del título o autor
                        return searchWords.some(word => 
                            titleWords.some(titleWord => titleWord.includes(word)) ||
                            authorWords.some(authorWord => authorWord.includes(word))
                        );
                    });
                    
                    if (partialMatches.length > 0) {
                        setNoResults(false);
                        setSearchResults(partialMatches);
                    } else {
                        setNoResults(true);
                        setSearchResults([]);
                    }
                } else {
                    setNoResults(false);
                    setSearchResults(data);
                }
            }
            
            // Guardar en búsquedas recientes
            saveRecentSearch(searchTerm);
            
        } catch (error) {
            console.error('Error searching books:', error);
            setNoResults(true);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const saveRecentSearch = (term) => {
        const newRecentSearches = [
            term, 
            ...recentSearches.filter(item => item !== term)
        ].slice(0, 5);
        
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.length > 2) {
            // Filtrar sugerencias basadas en la entrada
            const searchTermLower = value.toLowerCase();
            const filtered = allBooks
                .filter(book => {
                    const titleLower = book.title.toLowerCase();
                    const authorLower = book.author.toLowerCase();
                    
                    return titleLower.includes(searchTermLower) || 
                           authorLower.includes(searchTermLower);
                })
                .map(book => ({
                    type: 'book',
                    title: book.title,
                    author: book.author,
                    id: book._id
                }))
                .slice(0, 5);
            
            if (filtered.length > 0) {
                setSuggestions(filtered);
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        inputRef.current.focus();
    };
    
    const handleRecentSearchClick = (term) => {
        setSearchTerm(term);
        setShowSuggestions(false);
        // Ejecutar búsqueda automáticamente
        setTimeout(() => {
            handleSearch();
        }, 100);
    };

    const handleBookClick = () => {
        if (isAuthenticated) {
            navigate('/afterLogin');
            // Aquí pasar el ID del libro como parámetro para abrir directamente el intercambio
        } else {
            dispatch(openModal("auth"));
        }
        setShowResults(false);
    };

    const handleExchangeClick = () => {
        if (isAuthenticated) {
            navigate('/afterLogin');
            // Aquí pasar el ID del libro como parámetro para abrir directamente el intercambio
        } else {
            dispatch(openModal("auth"));
        }
        setShowResults(false);
    };

    const handleFocus = () => {
        if (searchTerm.trim() === '' && recentSearches.length > 0) {
            setShowSuggestions(true);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setShowResults(false);
        setShowSuggestions(false);
        inputRef.current.focus();
    };

    return (
        <div className="search-container" ref={searchContainerRef}>
            <div className="search">
                <FiSearch className="search-icon-left" />
                <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="Busca por título, autor..." 
                    className="searchInput"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    onFocus={handleFocus}
                />
                {searchTerm && (
                    <motion.button 
                        className="clear-search-btn"
                        onClick={clearSearch}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FiX />
                    </motion.button>
                )}
                <motion.button 
                    className="search-button"
                    onClick={handleSearch}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Buscar
                </motion.button>
            </div>

            <AnimatePresence>
                {showSuggestions && (
                    <motion.div 
                        className="search-suggestions"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {searchTerm.length > 0 ? (
                            <>
                                <div className="suggestions-title">Sugerencias</div>
                                {suggestions.map((suggestion, index) => (
                                    <motion.div 
                                        key={index} 
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(suggestion.title)}
                                        whileHover={{ backgroundColor: '#f0f9ff', x: 4 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FiBookOpen className="suggestion-icon" />
                                        <div className="suggestion-content">
                                            <span className="suggestion-title">{suggestion.title}</span>
                                            <span className="suggestion-author">{suggestion.author}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </>
                        ) : (
                            <>
                                <div className="suggestions-title">Búsquedas recientes</div>
                                {recentSearches.length > 0 ? (
                                    recentSearches.map((term, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="suggestion-item recent"
                                            onClick={() => handleRecentSearchClick(term)}
                                            whileHover={{ backgroundColor: '#f0f9ff', x: 4 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FiRefreshCw className="suggestion-icon" />
                                            <span>{term}</span>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="no-suggestions">No hay búsquedas recientes</div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}

                {showResults && (
                    <motion.div 
                        className="search-results-container"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isSearching ? (
                            <div className="search-loading-container">
                                <div className="search-loader"></div>
                                <div className="search-loading-text">Buscando resultados...</div>
                            </div>
                        ) : noResults ? (
                            <div className="search-no-results">
                                <div className="no-results-icon">😕</div>
                                <p>No se encontraron resultados para "{searchTerm}"</p>
                                <div className="search-all-books">
                                    <h3>Libros que podrían interesarte</h3>
                                    {allBooks.length > 0 ? (
                                        <motion.div 
                                            className="search-books-grid"
                                            initial="hidden"
                                            animate="visible"
                                            variants={{
                                                visible: {
                                                    transition: {
                                                        staggerChildren: 0.1
                                                    }
                                                }
                                            }}
                                        >
                                            {allBooks.slice(0, 6).map((book, index) => (
                                                <motion.div 
                                                    key={book._id} 
                                                    className="search-book-item"
                                                    variants={{
                                                        hidden: { opacity: 0, y: 20 },
                                                        visible: { opacity: 1, y: 0 }
                                                    }}
                                                    whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
                                                >
                                                    <div className="book-cover-container">
                                                        <img src={book.image || 'https://via.placeholder.com/150x200'} alt={book.title} />
                                                    </div>
                                                    <h4>{book.title}</h4>
                                                    <p>{book.author}</p>
                                                    <motion.button 
                                                        onClick={handleBookClick}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Ver detalles
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <div className="no-content-messagess">
                                            <p>En este momento no hay libros disponibles</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <motion.div 
                                className="search-results-grid"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05
                                        }
                                    }
                                }}
                            >
                                <div className="results-header">
                                    <h3>Resultados para "{searchTerm}"</h3>
                                    <span className="results-count">{searchResults.length} libros encontrados</span>
                                </div>
                                
                                {searchResults.map((book, index) => (
                                    <motion.div 
                                        key={book._id} 
                                        className="search-book-item"
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
                                    >
                                        <div className="book-cover-container">
                                            <img src={book.image || 'https://via.placeholder.com/150x200'} alt={book.title} />
                                            {book.status && (
                                                <span className={`book-status ${book.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                    {book.status}
                                                </span>
                                            )}
                                        </div>
                                        <h4>{book.title}</h4>
                                        <p>{book.author}</p>
                                        <div className="search-book-actions">
                                            <motion.button 
                                                onClick={handleBookClick}
                                                className="view-details-btn"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Ver detalles
                                            </motion.button>
                                            <motion.button 
                                                onClick={handleExchangeClick}
                                                className="exchange-btn"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Intercambiar
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Search;