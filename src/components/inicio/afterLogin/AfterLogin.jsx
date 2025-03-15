import { FiPlus, FiBookOpen, FiUser, FiBookmark, FiArrowLeft, FiLogOut} from 'react-icons/fi';
import '../../../styles/afterLogin/afterLogin.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MiPerfil from '../../miPerfil/MiPerfil';
import Donaciones from '../../donaciones/donaciones';


const books = [
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
];
const AfterLogin = () => {
    const navigate = useNavigate();

    const [currentView, setCurrentView] = useState("Books");

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userEmail");
        navigate("/");
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
                </nav>
                <button 
                    className="add-button up" 
                    onClick={() => currentView === "Profile" || currentView === "Changes" || currentView === "MyBooks" || currentView === "Donation" ? setCurrentView("Books") : navigate("/")}><FiArrowLeft /></button>
                <button className="logout-button" onClick={handleLogout}><FiLogOut /></button>
            </aside>
            <main className="main-content">
                {currentView === "Books" &&(
                <>
                    <h2 className="section-title">Libros Disponibles</h2>
                    <div className="books-grid">
                        {books.map((book) => (
                            <div key={book.id} className="book-card">
                                <img src={book.cover} alt={book.title} className="book-cover"/>
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
            </main>
            <button className="add-button"><FiPlus /></button>
        </div>
    );
};

export default AfterLogin;