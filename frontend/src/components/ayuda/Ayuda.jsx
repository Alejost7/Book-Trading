import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from "react-icons/fi";
import "../../styles/ayuda/ayuda.css";

const Ayuda = () => {
    const [selectedTopic, setSelectedTopic] = useState("general");
    const navigate = useNavigate();

    const ayudaContenido = {
        general: "Aquí encontrarás información general sobre el uso de la plataforma.",
        perfil: "En la sección de perfil puedes editar tu información personal.",
        seguridad: "Recomendamos utilizar una contraseña segura y activar la verificación en dos pasos.",
        libros: "Aquí puedes aprender cómo donar o intercambiar libros con otros usuarios."
    };

    return (
        <div className="ayuda-container">
            <div className="ayuda-sidebar">
                <h2 className="ayuda-title">Centro de Ayuda</h2>
                <ul className="ayuda-nav">
                    <li 
                        className={`ayuda-item ${selectedTopic === "general" ? "active" : ""}`} 
                        onClick={() => setSelectedTopic("general")}
                    >
                        Información General
                    </li>
                    <li 
                        className={`ayuda-item ${selectedTopic === "perfil" ? "active" : ""}`} 
                        onClick={() => setSelectedTopic("perfil")}
                    >
                        Gestión de Perfil
                    </li>
                    <li 
                        className={`ayuda-item ${selectedTopic === "seguridad" ? "active" : ""}`} 
                        onClick={() => setSelectedTopic("seguridad")}
                    >
                        Seguridad
                    </li>
                    <li 
                        className={`ayuda-item ${selectedTopic === "libros" ? "active" : ""}`} 
                        onClick={() => setSelectedTopic("libros")}
                    >
                        Donación de Libros
                    </li>
                </ul>
                <button 
                    className="add-button" 
                    onClick={() => selectedTopic === "perfil" || selectedTopic === "seguridad" || selectedTopic === "libros" || selectedTopic === "Donation" ? setSelectedTopic("general") : navigate("/")}><FiArrowLeft />
            </button>
            </div>

            <div className="ayuda-content">
                <h3 className="ayuda-section-title">{selectedTopic.toUpperCase()}</h3>
                <p className="ayuda-text">{ayudaContenido[selectedTopic]}</p>
                <button className="ayuda-button">Contactar Soporte</button>
            </div>
        </div>
    );
};

export default Ayuda;