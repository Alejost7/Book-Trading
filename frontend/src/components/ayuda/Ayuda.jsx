import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiX } from "react-icons/fi";
import "../../styles/ayuda/ayuda.css";

const Ayuda = () => {
    const [selectedTopic, setSelectedTopic] = useState("general");
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [supportMessage, setSupportMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const navigate = useNavigate();

    const ayudaContenido = {
        general: "Aquí encontrarás información general sobre el uso de la plataforma.",
        perfil: "En la sección de perfil puedes editar tu información personal.",
        seguridad: "Recomendamos utilizar una contraseña segura y activar la verificación en dos pasos.",
        libros: "Aquí puedes aprender cómo donar o intercambiar libros con otros usuarios."
    };

    const handleOpenSupportModal = () => {
        setShowSupportModal(true);
        setSupportMessage("");
        setSubmitSuccess(false);
    };

    const handleCloseSupportModal = () => {
        setShowSupportModal(false);
        setSupportMessage("");
        setSubmitSuccess(false);
    };

    const handleSubmitSupport = () => {
        if (!supportMessage.trim()) return;
        
        setIsSubmitting(true);
        
        // Simulación de envío (aquí se implementaría la llamada real a la API)
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            
            // Cerrar el modal después de 2 segundos
            setTimeout(() => {
                handleCloseSupportModal();
            }, 2000);
        }, 1000);
    };

    return (
        <div className="ayuda-container">
            {/* Título principal */}
            <h2 className="ayuda-title">Centro de Ayuda</h2>
            
            {/* Navegación (Tabs) */}
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

            {/* Contenido */}
            <div className="ayuda-content">
                <h3 className="ayuda-section-title">{selectedTopic.toUpperCase()}</h3>
                <p className="ayuda-text">{ayudaContenido[selectedTopic]}</p>
                
                <button className="ayuda-button" onClick={handleOpenSupportModal}>Contactar Soporte</button>
                
                {/* Botón "volver" (o cambiar de sección) */}
                <button
                className="add-button"
                onClick={() =>
                    selectedTopic === "perfil" ||
                    selectedTopic === "seguridad" ||
                    selectedTopic === "libros"
                    ? setSelectedTopic("general")
                    : navigate("/")
                }
                >
                <FiArrowLeft />
                </button>
            </div>

            {/* Modal de Contacto con Soporte */}
            {showSupportModal && (
                <div className="support-modal-overlay">
                    <div className="support-modal">
                        <button className="close-modal-button" onClick={handleCloseSupportModal}>
                            <FiX />
                        </button>
                        <h3>Contactar con Soporte</h3>
                        
                        {submitSuccess ? (
                            <div className="success-message">
                                <p>¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</p>
                            </div>
                        ) : (
                            <>
                                <p>Describe tu problema o consulta y nuestro equipo de soporte te responderá lo antes posible.</p>
                                <textarea
                                    className="support-textarea"
                                    placeholder="Escribe tu mensaje aquí..."
                                    value={supportMessage}
                                    onChange={(e) => setSupportMessage(e.target.value)}
                                    rows={6}
                                />
                                <button 
                                    className="submit-button"
                                    onClick={handleSubmitSupport}
                                    disabled={!supportMessage.trim() || isSubmitting}
                                >
                                    {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                                </button>
                                <p className="support-email">
                                    También puedes contactarnos directamente en: <span>soporte@bookzone.com</span>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ayuda;
